import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function inspect() {
    console.log('\n✦ Angel Tarot - Database Inspector ✦\n');

    // 1. ユーザー統計
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
    if (pError) {
        console.error('profilesの取得に失敗:', pError.message);
    } else {
        const premiumCount = profiles.filter(p => p.is_premium).length;
        console.log(`[ 👥 ユーザー統計 ]`);
        console.log(`総ユーザー数: ${profiles.length} 名`);
        console.log(`プレミアム会員: ${premiumCount} 名`);
        console.log('----------------------------------');
    }

    // 2. 鑑定履歴統計
    const { count: readingsCount, error: rError } = await supabase.from('readings').select('*', { count: 'exact', head: true });
    if (rError) {
        console.error('readingsの取得に失敗:', rError.message);
    } else {
        console.log(`[ 🔮 鑑定統計 ]`);
        console.log(`総鑑定回数: ${readingsCount || 0} 回`);
        console.log('----------------------------------');
    }

    // 3. 最新の鑑定 5件
    const { data: latestReadings, error: lrError } = await supabase
        .from('readings')
        .select('*, profiles(nickname, email)')
        .order('created_at', { ascending: false })
        .limit(5);

    if (lrError) {
        console.error('最新履歴の取得に失敗:', lrError.message);
    } else {
        console.log(`[ 📜 最新の鑑定履歴 (Top 5) ]`);
        latestReadings.forEach((r, i) => {
            const name = r.profiles?.nickname || r.profiles?.email || 'Guest';
            console.log(`${i + 1}. [${new Date(r.created_at).toLocaleString('ja-JP')}] ${name} さん`);
            console.log(`   カード: ${r.card_names} (${r.position})`);
            console.log(`   内容抜粋: ${r.reading_text.substring(0, 40).replace(/<br>/g, '')}...`);
            console.log('');
        });
    }
}

inspect();
