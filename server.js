import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const requiredEnv = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GROQ_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_MONTHLY',
    'STRIPE_PRICE_YEARLY'
];

const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const cspDirectives = {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    frameSrc: ["'self'", 'https://checkout.stripe.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', "'unsafe-inline'"],
    styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
};

if (isProduction) {
    cspDirectives.upgradeInsecureRequests = [];
}

app.use(helmet({
    contentSecurityPolicy: { directives: cspDirectives },
}));

// APIの連続アクセス制限（15分間に150回まで）
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: { error: 'リクエストが多すぎます。しばらくしてからもう一度お試しください。' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
}));

/* ============================================================
   Webhook は raw body が必要なため express.json の前に定義
   ============================================================ */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        
        if (userId) {
            const { error } = await supabase
                .from('profiles')
                .update({ is_premium: true })
                .eq('id', userId);
            
            if (error) {
                console.error('Error upgrading user to premium via webhook:', error);
            } else {
                console.log(`User ${userId} upgraded to Premium!`);
            }
        }
    } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
            const { error } = await supabase
                .from('profiles')
                .update({ is_premium: false })
                .eq('id', userId);

            if (error) {
                console.error('Error downgrading user after subscription cancellation:', error);
            }
        }
    }

    res.json({ received: true });
});

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname)));

/* ============================================================
   📦 簡易データベース（JSONファイル）
   ============================================================ */
const DATA_DIR = path.join(__dirname, 'data');
const USAGE_FILE = path.join(DATA_DIR, 'usage.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJSON(filepath, defaultValue = {}) {
    try {
        if (fs.existsSync(filepath)) return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    } catch (e) { console.error(`Error loading ${filepath}:`, e.message); }
    return defaultValue;
}

function saveJSON(filepath, data) {
    try { fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8'); } 
    catch (e) { console.error(`Error saving ${filepath}:`, e.message); }
}

/* ============================================================
   🔧 設定
   ============================================================ */
const FREE_DAILY_LIMIT = 1;        // 無料ユーザーの1日の占い回数
const SHARE_BONUS = 1;             // シェアで追加される回数
const AD_BONUS_LIMIT = 0;          // 実広告ネットワーク連携まではリワード広告を無効化
const FREE_MAX_TOKENS = 512;       // 無料ユーザーのレスポンス上限
const PREMIUM_MAX_TOKENS = 1024;   // プレミアムユーザーのレスポンス上限

/* ============================================================
   🛡️ 認証ミドルウェア＆ヘルパー
   ============================================================ */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection?.remoteAddress || req.ip || 'unknown';
}

/* ========================================
   認証ミドルウェア (Supabase Auth)
   ======================================== */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            req.user = null;
            return next();
        }
        
        // プロフィール情報を取得
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        req.user = { 
            id: user.id, 
            email: user.email, 
            nickname: profile?.nickname,
            birthdate: profile?.birthdate,
            isPremium: (user.email === 'pyramidshop.88@gmail.com' || user.email === 'angeliquetarot.jp@gmail.com') ? true : (profile?.is_premium || false)
        };
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

/* ============================================================
   👤 ユーザー管理 API
   ============================================================ */
app.post('/api/register', async (req, res) => {
    const { email, password, nickname, birthdate } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'メールアドレスとパスワードが必要です。' });

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) return res.status(400).json({ error: authError.message });

        if (authData.user) {
            // プロフィール作成
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    email: email,
                    nickname: nickname || '',
                    birthdate: birthdate || '',
                    is_premium: false
                }]);
            
            if (profileError) {
                console.error('Profile creation error:', profileError);
            }

            res.json({ success: true, message: '確認メールを送信しました（設定による）。ログインしてください。' });
        }
    } catch (e) {
        console.error('Register error:', e.message);
        res.status(500).json({ error: 'エラーが発生しました。' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'メールアドレスとパスワードが必要です。' });

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return res.status(401).json({ error: 'ログインに失敗しました。' });

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                nickname: profile?.nickname,
                birthdate: profile?.birthdate,
                isPremium: (data.user.email === 'pyramidshop.88@gmail.com' || data.user.email === 'angeliquetarot.jp@gmail.com') ? true : (profile?.is_premium || false)
            }
        });
    } catch (e) {
        console.error('Login error:', e.message);
        res.status(500).json({ error: 'サーバーエラーが発生しました。' });
    }
});

/* ============================================================
   📊 利用状況管理
   ============================================================ */
function getTodayKey() {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().split('T')[0];
}

async function getUserUsage(req) {
    const today = getTodayKey();
    const userKey = req.user ? req.user.id : getClientIP(req);
    
    if (process.env.TEST_PREMIUM_MODE === 'true') {
        return { userKey, usageData: { count: 0, shared: false, ad_bonus: 0, usage_date: today, isPremium: true } };
    }

    let { data: usageData, error } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', userKey)
        .eq('usage_date', today)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
        throw new Error(`Error fetching usage: ${error.message}`);
    }

    if (!usageData) {
        const { data: newUsage, error: insertError } = await supabase
            .from('daily_usage')
            .insert([{ user_id: userKey, usage_date: today, count: 0, shared: false, ad_bonus: 0 }])
            .select()
            .single();
        
        if (insertError) throw new Error(`Error inserting usage: ${insertError.message}`);
        if (!newUsage) throw new Error('Usage row could not be created.');
        usageData = newUsage;
    }

    // プレミアムフラグを統合
    const isPremium = req.user ? req.user.isPremium : false;

    return { userKey, usageData: { ...usageData, isPremium } };
}

async function updateUsageCount(userKey, incrementCount, setShared, incrementAdBonus = false) {
    const today = getTodayKey();
    
    if (process.env.TEST_PREMIUM_MODE === 'true') {
        return { count: 1, shared: true, ad_bonus: 0 };
    }

    let updateData = {};
    if (incrementCount) {
        const { data } = await supabase.from('daily_usage').select('count').eq('user_id', userKey).eq('usage_date', today).single();
        updateData.count = (data?.count || 0) + 1;
    }
    if (setShared) updateData.shared = true;
    if (incrementAdBonus) {
        const { data } = await supabase.from('daily_usage').select('ad_bonus').eq('user_id', userKey).eq('usage_date', today).single();
        updateData.ad_bonus = (data?.ad_bonus || 0) + 1;
    }

    const { data: updated, error } = await supabase
        .from('daily_usage')
        .update(updateData)
        .eq('user_id', userKey)
        .eq('usage_date', today)
        .select()
        .single();
    
    if (error) throw new Error(`Error updating usage: ${error.message}`);
    return updated || { count: updateData.count || 0, shared: updateData.shared || false, ad_bonus: updateData.ad_bonus || 0 };
}

async function saveReading(identifier, cardName, position, reading, isFull) {
    if (process.env.TEST_PREMIUM_MODE === 'true') {
        return 'mock-reading-id-12345';
    }

    const { data, error } = await supabase
        .from('readings')
        .insert([{
            user_id: identifier,
            card_names: cardName,
            position: position,
            reading_text: reading,
            is_full: isFull,
            is_favorite: false,
            chat_history: []
        }])
        .select('id')
        .single();
    
    if (error) console.error('Error saving reading:', error);
    return data?.id || null;
}

/* ============================================================
   🔮 API: 利用状況・シェア・広告ボーナス
   ============================================================ */
app.get('/api/usage', authenticate, async (req, res) => {
    try {
        const { usageData } = await getUserUsage(req);
        const adBonus = usageData.ad_bonus || 0;
        const limit = usageData.isPremium ? Infinity : (FREE_DAILY_LIMIT + (usageData.shared ? SHARE_BONUS : 0) + adBonus);
        res.json({
            count: usageData.count,
            limit: usageData.isPremium ? -1 : limit,
            remaining: usageData.isPremium ? -1 : Math.max(0, limit - usageData.count),
            shared: usageData.shared,
            adBonus: adBonus,
            isPremium: usageData.isPremium,
            date: usageData.usage_date,
            user: req.user ? { email: req.user.email } : null
        });
    } catch (error) {
        console.error('Usage API error:', error);
        res.status(503).json({ error: '利用状況を取得できませんでした。' });
    }
});

app.post('/api/shared', authenticate, async (req, res) => {
    try {
        const { userKey } = await getUserUsage(req);
        const updated = await updateUsageCount(userKey, false, true, false);
        const limit = FREE_DAILY_LIMIT + SHARE_BONUS + (updated.ad_bonus || 0);
        res.json({ success: true, remaining: Math.max(0, limit - updated.count) });
    } catch (error) {
        console.error('Share API error:', error);
        res.status(503).json({ error: '利用状況を更新できませんでした。' });
    }
});

app.post('/api/reward-ad', authenticate, async (req, res) => {
    if (AD_BONUS_LIMIT <= 0) {
        return res.status(403).json({ error: '広告視聴ボーナスは現在ご利用いただけません。' });
    }

    try {
        const { userKey, usageData } = await getUserUsage(req);
        const currentAdBonus = usageData.ad_bonus || 0;
        
        if (currentAdBonus >= AD_BONUS_LIMIT) {
            return res.status(400).json({ error: '1日の広告視聴上限に達しています。' });
        }
        
        const updated = await updateUsageCount(userKey, false, false, true);
        const limit = FREE_DAILY_LIMIT + (updated.shared ? SHARE_BONUS : 0) + updated.ad_bonus;
        res.json({ success: true, remaining: Math.max(0, limit - updated.count), adBonus: updated.ad_bonus });
    } catch (error) {
        console.error('Reward ad API error:', error);
        res.status(503).json({ error: '利用状況を更新できませんでした。' });
    }
});

app.get('/api/history', authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'ログインが必要です。' });
    }
    const { data: userHistory, error } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: '履歴の取得に失敗しました。' });
        
    res.json({ history: userHistory.map(r => ({
        id: r.id,
        cardName: r.card_names,
        position: r.position,
        reading: r.reading_text,
        isFull: r.is_full,
        isFavorite: r.is_favorite,
        chatHistory: r.chat_history,
        timestamp: r.created_at
    })) });
});

app.post('/api/history/favorite', authenticate, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'ログインが必要です。' });
    const { id, isFavorite } = req.body;
    
    const { error } = await supabase
        .from('readings')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: '更新に失敗しました。' });
    res.json({ success: true, isFavorite });
});

app.post('/api/chat-followup', authenticate, async (req, res) => {
    const isUserPremium = req.user && req.user.isPremium;
    if (!req.user || !isUserPremium) return res.status(403).json({ error: 'この機能はプレミアム限定です。' });
    
    const { id, message } = req.body;
    if (!id || !message) return res.status(400).json({ error: '不正なリクエストです。' });
    
    const { data: readingItem, error } = await supabase
        .from('readings')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

    if (error || !readingItem) return res.status(404).json({ error: '履歴が見つかりません。' });

    try {
        const messages = [
            { role: 'system', content: 'あなたは天使のタロットリーダーです。過去の神託に基づいて、相談者の追加の質問に慈愛をもって答えてください。' },
            { role: 'assistant', content: `【過去のリーディング】\nカード: ${readingItem.card_names} (${readingItem.position})\n内容: ${readingItem.reading_text}` }
        ];

        if (readingItem.chat_history) {
            readingItem.chat_history.forEach(chat => {
                messages.push({ role: chat.role, content: chat.content });
            });
        }

        messages.push({ role: 'user', content: message });

        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.8,
            max_tokens: 800,
        });

        const reply = completion.choices[0]?.message?.content || 'メッセージを受信できませんでした。';

        const updatedChatHistory = [...(readingItem.chat_history || [])];
        updatedChatHistory.push({ role: 'user', content: message });
        updatedChatHistory.push({ role: 'assistant', content: reply });
        
        await supabase
            .from('readings')
            .update({ chat_history: updatedChatHistory })
            .eq('id', id);

        res.json({ reply });
    } catch (e) {
        console.error('Followup chat error:', e);
        res.status(500).json({ error: '通信に失敗しました。' });
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim();
    const trimmedMessage = String(message || '').trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
        return res.status(400).json({ error: 'お名前、メールアドレス、メッセージを入力してください。' });
    }
    if (trimmedName.length > 120 || trimmedEmail.length > 254 || trimmedMessage.length > 4000) {
        return res.status(400).json({ error: '入力内容が長すぎます。' });
    }

    const { error } = await supabase
        .from('contact_messages')
        .insert([{
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            ip_address: getClientIP(req),
            user_agent: req.headers['user-agent'] || ''
        }]);

    if (error) {
        console.error('Contact message save error:', error);
        return res.status(500).json({ error: '送信に失敗しました。時間をおいて再度お試しください。' });
    }

    res.json({ success: true });
});

/* ============================================================
   🔮 API: 占い生成（フリーミアム・認証対応）
   ============================================================ */
app.post('/api/read-tarot', authenticate, async (req, res) => {
    try {
        const { cards, theme, spread, worry, targetPerson, angelPersona } = req.body;
        if (!cards || cards.length === 0) return res.status(400).json({ error: 'カード情報が不足しています' });

        const { userKey, usageData } = await getUserUsage(req);
        const adBonus = usageData.ad_bonus || 0;
        const dailyLimit = usageData.isPremium ? Infinity : (FREE_DAILY_LIMIT + (usageData.shared ? SHARE_BONUS : 0) + adBonus);

        if (!usageData.isPremium && usageData.count >= dailyLimit) {
            return res.status(429).json({ error: 'daily_limit', message: '制限に達しました。', shared: usageData.shared, ad_bonus: adBonus });
        }

        const isFull = usageData.isPremium;
        
        let promptContext = '';
        if (req.user && req.user.birthdate) {
            promptContext += `相談者の生年月日は${req.user.birthdate}です。`;
        }
        if (worry) {
            promptContext += `相談者は「${worry}」という具体的な悩みを抱えています。`;
        }
        if (targetPerson) {
            promptContext += `「${targetPerson}」という特定のお相手との関係性について占いたいと考えています。`;
        }
        
        let prompt = '';
        const themeText = theme && theme !== '総合' ? `テーマ「${theme}」について、` : '';

        if (spread === 10) {
            let cardsText = '';
            cards.forEach((c, i) => {
                cardsText += `${i + 1}. ${c.spreadPositionName || '位置不明'}: ${c.cardName} ${c.position}\n`;
            });

            prompt = `あなたは「Angelique Tarot」に宿る聖なる存在です。引かれた10枚のカードによる「ケルト十字スプレッド」に基づき、${themeText}深く総合的な神託を届けてください。
${promptContext}

引かれたカード（ケルト十字展開）:
${cardsText}

- 第一行で天使からの大局的なメッセージを優雅に伝えてください。
- 1〜6枚目のカードで「現状、障害、過去から近未来への流れ」を解き明かしてください。
- 7〜10枚目のカードで「相談者の内面、環境、そして最終結果」へと至る導きを示してください。
- 最後に、具体的な開運アクション（天使の祈りや心がけ）をアドバイスしてください。`;
        } else if (spread === 'hexagram') {
            let cardsText = '';
            cards.forEach((c, i) => {
                cardsText += `${i + 1}. ${c.spreadPositionName || '位置不明'}: ${c.cardName} ${c.position}\n`;
            });

            prompt = `あなたは「Angelique Tarot」に宿る聖なる存在です。引かれた7枚のカードによる「ヘキサグラム展開（六芒星）」に基づき、相手との「相性や関係性」について深く詳細な神託を届けてください。
${promptContext}

引かれたカード（ヘキサグラム展開）:
${cardsText}

以下の要件に従ってください：
- 1〜3枚目で「二人の過去・現在・未来の大きな流れ」を読み解いてください。
- 4枚目（あなたの本心）と5枚目（相手の本心）を対比させ、お互いの潜在的な感情や誤解を解き明かしてください。
- 6枚目（神託/助言）と7枚目（最終結果）から、二人がより良い関係を築くための具体的なアドバイスと最終的な結末を提示してください。
- 慈悲深く、包み込むような愛に満ちた語り口で伝えてください。
- 文字数：1200〜1500文字程度。改行は<br>タグを使用。`;
        } else if (spread === 3 || spread === 5 || spread === 7) {
            let cardsText = '';
            cards.forEach((c, i) => {
                cardsText += `${i + 1}. ${c.spreadPositionName || c.spreadPosition || '位置不明'}: ${c.cardName} ${c.position}\n`;
            });

            prompt = `あなたは「Angelique Tarot（アンジェリック・タロット）」に宿る聖なる存在です。引かれた${spread}枚のカードに基づき、${themeText}4大天使の視点から「神託（アークエンジェル・オラクル）」を届けてください。
${promptContext}

引かれたカード:
${cardsText}

以下の要件に従ってください：
- すべてのカードの繋がりを解き明かし、${themeText}深いリーディングを行うこと。
- ${promptContext ? '相談者の生年月日や具体的な悩み、相手の情報を深く考察し、パーソナライズされたアドバイスを提供すること。' : ''}
- 潜在意識のメッセージ、特別なガイダンス、開運アクションを追加。
- 慈悲深く荘厳な語り口。文字数：${spread === 3 ? '600〜800' : (spread === 5 ? '800〜1000' : '1000〜1500')}文字程度。改行は<br>タグを使用。メタ説明不要。`;
        } else {
            const { cardName, position } = cards[0];
            prompt = isFull
                ? `あなたは「Angelique Tarot」に宿る聖なる存在です。引かれたカード「${cardName}」の「${position}」に基づき、${themeText}天使の視点から神託を届けてください。
${promptContext}
- 第一行で天使的な意味を伝え、次に現状分析、最後に未来への希望とアドバイスを提供。
- ${promptContext ? '相談者の生年月日や具体的な悩み、相手の情報を深く考察し、パーソナライズされたアドバイスを提供すること。' : ''}
- さらに深層リーディングとして、潜在意識のメッセージ、特別なガイダンス、開運アクションを追加。
- 慈悲深く荘厳な語り口。文字数：400〜500文字程度。改行は<br>タグを使用。メタ説明不要。`
                : `あなたは「Angel Tarot」に宿る天使の霊的存在です。引かれたカード「${cardName}」の「${position}」に基づき、天使の視点から神託を届けてください。
${promptContext}
- 第一行で天使的な意味を伝え、次に現状分析、最後に未来への希望とアドバイスを提供。
- ${promptContext ? '相談者の生年月日や具体的な悩みを加味したアドバイスを提供すること。' : ''}
- 慈悲深く荘厳な語り口。文字数：250〜350文字程度。改行は<br>タグを使用。メタ説明不要。`;
        }

        let systemContent = 'あなたは天使のタロットリーダーです。相談者の個人的な状況や生年月日に深く寄り添い、慈愛に満ちた日本語で天使のメッセージを届けてください。';
        if (angelPersona === 'michael') {
            systemContent = 'あなたは大天使ミカエルとしてタロットリーディングを行います。力強く、相談者に勇気と行動を促すアドバイスを、威厳ある言葉で届けてください。';
        } else if (angelPersona === 'raphael') {
            systemContent = 'あなたは大天使ラファエルとしてタロットリーディングを行います。傷ついた心を癒し、優しく寄り添う心のケアを中心としたアドバイスを届けてください。';
        } else if (angelPersona === 'gabriel') {
            systemContent = 'あなたは大天使ガブリエルとしてタロットリーディングを行います。直感と創造性、対人関係のコミュニケーションに関するインスピレーションを与える助言を届けてください。';
        } else if (angelPersona === 'uriel') {
            systemContent = 'あなたは大天使ウリエルとしてタロットリーディングを行います。知恵と真実をもたらし、論理的でクリアな解決策を導く助言を届けてください。';
        }

        let maxTokens = isFull ? PREMIUM_MAX_TOKENS : FREE_MAX_TOKENS;
        if (spread === 3) maxTokens = 1500;
        if (spread === 5) maxTokens = 2000;
        if (spread === 7) maxTokens = 2500;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemContent },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.85,
            max_tokens: maxTokens,
        });

        const reading = completion.choices[0]?.message?.content || 'メッセージを受信できませんでした。';
        let updatedUsage = await updateUsageCount(userKey, true, false, false);
        
        // Supabase通信エラー等で取得できなかった場合のフォールバック
        if (!updatedUsage) {
            updatedUsage = { ...usageData, count: usageData.count + 1 };
        }
        
        // 履歴保存 (代表して1枚目を保存するか、カード名を結合)
        let historyCardName = cards[0].cardName;
        const selectedCount = spread === 'hexagram' ? 7 : Number(spread);
        if (selectedCount > 1) {
            historyCardName = cards.map(c => c.cardName).join(', ');
            if (historyCardName.length > 50) historyCardName = historyCardName.substring(0, 47) + '...';
        }
        const historyPosition = spread === 'hexagram' ? 'ヘキサグラム' : (selectedCount > 1 ? `${selectedCount}枚引き` : cards[0].position);
        const readingId = await saveReading(req.user ? req.user.id : getClientIP(req), historyCardName, historyPosition, reading, isFull);
        
        const newLimit = usageData.isPremium ? -1 : (FREE_DAILY_LIMIT + (updatedUsage.shared ? SHARE_BONUS : 0) + (updatedUsage.ad_bonus || 0));

        res.json({
            reading, readingId, isFull, spread, theme,
            usage: {
                count: updatedUsage.count, limit: newLimit,
                remaining: usageData.isPremium ? -1 : Math.max(0, newLimit - updatedUsage.count),
                shared: updatedUsage.shared,
                adBonus: updatedUsage.ad_bonus || 0
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        const status = /usage/i.test(error.message || '') ? 503 : 500;
        res.status(status).json({ error: status === 503 ? '利用状況を更新できませんでした。' : '通信に失敗しました。' });
    }
});

/* ============================================================
   💳 Stripe決済 API (本番想定)
   ============================================================ */
app.post('/api/create-checkout-session', authenticate, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'ログインが必要です。' });
    
    const { planId } = req.body;
    if (!['monthly', 'yearly'].includes(planId)) {
        return res.status(400).json({ error: '不正なプランです。' });
    }
    
    const priceId = planId === 'yearly' 
        ? process.env.STRIPE_PRICE_YEARLY
        : process.env.STRIPE_PRICE_MONTHLY;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            client_reference_id: req.user.id, // Webhookでユーザーを特定するために付与
            subscription_data: {
                metadata: {
                    userId: req.user.id,
                    planId,
                },
            },
            success_url: `${req.protocol}://${req.get('host')}/?success=true`,
            cancel_url: `${req.protocol}://${req.get('host')}/`,
        });

        res.json({ url: session.url });
    } catch (e) {
        console.error('Stripe Error:', e);
        res.status(500).json({ error: '決済セッションを作成できませんでした。' });
    }
});

// 404 Error Handler
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
    console.log(`✦ Angel Tarot Server running at http://localhost:${port}`);
});
