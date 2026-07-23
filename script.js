/* ============================================================
   Angelique Tarot  ─  script.js
   フリーミアム対応 + 認証 + 5枚のカードから1枚選ぶ仕様 + 幻想的なエフェクト群
   ============================================================ */

const TAROT_DECK = [
    // 大アルカナ (Major Arcana)
    { num: "0",    ja: "愚者",       img: "assets/fool.png" },
    { num: "I",    ja: "魔術師",     img: "assets/magician.png" },
    { num: "II",   ja: "女教皇",     img: "assets/high_priestess.png" },
    { num: "III",  ja: "女帝",       img: "assets/empress.png" },
    { num: "IV",   ja: "皇帝",       img: "assets/emperor.png" },
    { num: "V",    ja: "教皇",       img: "assets/hierophant.png" },
    { num: "VI",   ja: "恋人",       img: "assets/lovers.png" },
    { num: "VII",  ja: "戦車",       img: "assets/chariot.png" },
    { num: "VIII", ja: "力",         img: "assets/strength.png" },
    { num: "IX",   ja: "隠者",       img: "assets/hermit.png" },
    { num: "X",    ja: "運命の輪",   img: "assets/wheel_of_fortune.png" },
    { num: "XI",   ja: "正義",       img: "assets/justice.png" },
    { num: "XII",  ja: "吊るされた男", img: "assets/hanged_man.png" },
    { num: "XIII", ja: "死神",       img: "assets/death.png" },
    { num: "XIV",  ja: "節制",       img: "assets/temperance.png" },
    { num: "XV",   ja: "悪魔",       img: "assets/devil.png" },
    { num: "XVI",  ja: "塔",         img: "assets/tower.png" },
    { num: "XVII", ja: "星",         img: "assets/star.png" },
    { num: "XVIII",ja: "月",         img: "assets/moon.png" },
    { num: "XIX",  ja: "太陽",       img: "assets/sun.png" },
    { num: "XX",   ja: "審判",       img: "assets/judgement.png" },
    { num: "XXI",  ja: "世界",       img: "assets/world.png" },

    // ワンド (Wands)
    { num: "Wands Ace", ja: "ワンドのエース", img: "assets/wands_ace.png" },
    { num: "Wands 2",   ja: "ワンドの2", img: "assets/wands_2.png" },
    { num: "Wands 3",   ja: "ワンドの3", img: "assets/wands_3.png" },
    { num: "Wands 4",   ja: "ワンドの4", img: "assets/wands_4.png" },
    { num: "Wands 5",   ja: "ワンドの5", img: "assets/wands_5.png" },
    { num: "Wands 6",   ja: "ワンドの6", img: "assets/wands_6.png" },
    { num: "Wands 7",   ja: "ワンドの7", img: "assets/wands_7.png" },
    { num: "Wands 8",   ja: "ワンドの8", img: "assets/wands_8.png" },
    { num: "Wands 9",   ja: "ワンドの9", img: "assets/wands_9.png" },
    { num: "Wands 10",  ja: "ワンドの10", img: "assets/wands_10.png" },
    { num: "Wands Page", ja: "ワンドのペイジ", img: "assets/wands_page.png" },
    { num: "Wands Knight", ja: "ワンドのナイト", img: "assets/wands_knight.png" },
    { num: "Wands Queen", ja: "ワンドのクイーン", img: "assets/wands_queen.png" },
    { num: "Wands King", ja: "ワンドのキング", img: "assets/wands_king.png" },

    // カップ (Cups)
    { num: "Cups Ace", ja: "カップのエース", img: "assets/cups_ace.png" },
    { num: "Cups 2",   ja: "カップの2", img: "assets/cups_2.png" },
    { num: "Cups 3",   ja: "カップの3", img: "assets/cups_3.png" },
    { num: "Cups 4",   ja: "カップの4", img: "assets/cups_4.png" },
    { num: "Cups 5",   ja: "カップの5", img: "assets/cups_5.png" },
    { num: "Cups 6",   ja: "カップの6", img: "assets/cups_6.png" },
    { num: "Cups 7",   ja: "カップの7", img: "assets/cups_7.png" },
    { num: "Cups 8",   ja: "カップの8", img: "assets/cups_8.png" },
    { num: "Cups 9",   ja: "カップの9", img: "assets/cups_9.png" },
    { num: "Cups 10",  ja: "カップの10", img: "assets/cups_10.png" },
    { num: "Cups Page", ja: "カップのペイジ", img: "assets/cups_page.png" },
    { num: "Cups Knight", ja: "カップのナイト", img: "assets/cups_knight.png" },
    { num: "Cups Queen", ja: "カップのクイーン", img: "assets/cups_queen.png" },
    { num: "Cups King", ja: "カップのキング", img: "assets/cups_king.png" },

    // ソード (Swords)
    { num: "Swords Ace", ja: "ソードのエース", img: "assets/swords_ace.png" },
    { num: "Swords 2",   ja: "ソードの2", img: "assets/swords_2.png" },
    { num: "Swords 3",   ja: "ソードの3", img: "assets/swords_3.png" },
    { num: "Swords 4",   ja: "ソードの4", img: "assets/swords_4.png" },
    { num: "Swords 5",   ja: "ソードの5", img: "assets/swords_5.png" },
    { num: "Swords 6",   ja: "ソードの6", img: "assets/swords_6.png" },
    { num: "Swords 7",   ja: "ソードの7", img: "assets/swords_7.png" },
    { num: "Swords 8",   ja: "ソードの8", img: "assets/swords_8.png" },
    { num: "Swords 9",   ja: "ソードの9", img: "assets/swords_9.png" },
    { num: "Swords 10",  ja: "ソードの10", img: "assets/swords_10.png" },
    { num: "Swords Page", ja: "ソードのペイジ", img: "assets/swords_page.png" },
    { num: "Swords Knight", ja: "ソードのナイト", img: "assets/swords_knight.png" },
    { num: "Swords Queen", ja: "ソードのクイーン", img: "assets/swords_queen.png" },
    { num: "Swords King", ja: "ソードのキング", img: "assets/swords_king.png" },

    // ペンタクル (Pentacles)
    { num: "Pentacles Ace", ja: "ペンタクルのエース", img: "assets/pentacles_ace.png" },
    { num: "Pentacles 2",   ja: "ペンタクルの2", img: "assets/pentacles_2.png" },
    { num: "Pentacles 3",   ja: "ペンタクルの3", img: "assets/pentacles_3.png" },
    { num: "Pentacles 4",   ja: "ペンタクルの4", img: "assets/pentacles_4.png" },
    { num: "Pentacles 5",   ja: "ペンタクルの5", img: "assets/pentacles_5.png" },
    { num: "Pentacles 6",   ja: "ペンタクルの6", img: "assets/pentacles_6.png" },
    { num: "Pentacles 7",   ja: "ペンタクルの7", img: "assets/pentacles_7.png" },
    { num: "Pentacles 8",   ja: "ペンタクルの8", img: "assets/pentacles_8.png" },
    { num: "Pentacles 9",   ja: "ペンタクルの9", img: "assets/pentacles_9.png" },
    { num: "Pentacles 10",  ja: "ペンタクルの10", img: "assets/pentacles_10.png" },
    { num: "Pentacles Page", ja: "ペンタクルのペイジ", img: "assets/pentacles_page.png" },
    { num: "Pentacles Knight", ja: "ペンタクルのナイト", img: "assets/pentacles_knight.png" },
    { num: "Pentacles Queen", ja: "ペンタクルのクイーン", img: "assets/pentacles_queen.png" },
    { num: "Pentacles King", ja: "ペンタクルのキング", img: "assets/pentacles_king.png" }
];

function escapeHTML(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatReadingHTML(value = '') {
    return escapeHTML(value)
        .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
        .replace(/\r?\n/g, '<br>');
}

function plainTextFromReadingHTML(value = '') {
    const div = document.createElement('div');
    div.innerHTML = formatReadingHTML(value);
    return div.textContent || '';
}

function escapeCSSIdentifier(value = '') {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

/* ============================================================
   ✨ パーティクルシステム（Canvas）
   ============================================================ */
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.burstParticles = [];
        this.maxParticles = 80;
        this.colors = [
            { r: 212, g: 168, b: 83 },
            { r: 184, g: 169, b: 232 },
            { r: 245, g: 230, b: 184 },
            { r: 232, g: 160, b: 191 },
            { r: 255, g: 255, b: 255 },
        ];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    init() { for (let i = 0; i < this.maxParticles; i++) this.particles.push(this.createParticle()); }
    createParticle() {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        return {
            x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
            size: Math.random() * 2.5 + 0.5, speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3 - 0.1, opacity: Math.random() * 0.5 + 0.1,
            opacityDir: Math.random() > 0.5 ? 1 : -1, color,
            twinkleSpeed: Math.random() * 0.008 + 0.002, angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.01, wobbleRadius: Math.random() * 20 + 5
        };
    }
    burst(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
            const speed = Math.random() * 4 + 2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.burstParticles.push({
                x, y, speedX: Math.cos(angle) * speed, speedY: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1, opacity: 1, color, life: 1,
                decay: Math.random() * 0.015 + 0.008, gravity: 0.02, trail: []
            });
        }
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const p of this.particles) {
            p.angle += p.angleSpeed;
            p.x += p.speedX + Math.sin(p.angle) * 0.3;
            p.y += p.speedY + Math.cos(p.angle) * 0.15;
            p.opacity += p.opacityDir * p.twinkleSpeed;
            if (p.opacity >= 0.7) p.opacityDir = -1;
            if (p.opacity <= 0.05) p.opacityDir = 1;
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.y > this.canvas.height + 10) p.y = -10;
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            gradient.addColorStop(0, `rgba(${p.color.r},${p.color.g},${p.color.b},${p.opacity})`);
            gradient.addColorStop(1, `rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.opacity})`;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); this.ctx.fill();
        }
        for (let i = this.burstParticles.length - 1; i >= 0; i--) {
            const bp = this.burstParticles[i];
            bp.trail.push({ x: bp.x, y: bp.y, opacity: bp.opacity * 0.3 });
            if (bp.trail.length > 5) bp.trail.shift();
            bp.x += bp.speedX; bp.y += bp.speedY; bp.speedY += bp.gravity;
            bp.speedX *= 0.98; bp.speedY *= 0.98; bp.life -= bp.decay; bp.opacity = bp.life;
            if (bp.life <= 0) { this.burstParticles.splice(i, 1); continue; }
            for (const t of bp.trail) {
                this.ctx.fillStyle = `rgba(${bp.color.r},${bp.color.g},${bp.color.b},${t.opacity * 0.3})`;
                this.ctx.beginPath(); this.ctx.arc(t.x, t.y, bp.size * 0.5, 0, Math.PI * 2); this.ctx.fill();
            }
            const bg = this.ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, bp.size * 3);
            bg.addColorStop(0, `rgba(${bp.color.r},${bp.color.g},${bp.color.b},${bp.opacity})`);
            bg.addColorStop(1, `rgba(${bp.color.r},${bp.color.g},${bp.color.b},0)`);
            this.ctx.fillStyle = bg;
            this.ctx.beginPath(); this.ctx.arc(bp.x, bp.y, bp.size * 3, 0, Math.PI * 2); this.ctx.fill();
        }
        requestAnimationFrame(() => this.animate());
    }
}

/* ============================================================
   🪶 エフェクト生成
   ============================================================ */
function initFloatingFeathers() {
    const container = document.getElementById('floating-feathers');
    if (!container) return;
    const featherChars = ['🪶', '✦', '✧', '·', '✵'];
    const colors = ['#ffffff', '#f5e6b8', '#fff0f5', '#e6e6fa'];
    
    // 定期的に羽を生成
    setInterval(() => {
        const el = document.createElement('span');
        el.className = 'float-feather';
        el.textContent = featherChars[Math.floor(Math.random() * featherChars.length)];
        el.style.left = Math.random() * 100 + '%';
        
        const duration = Math.random() * 8 + 7; // 7〜15秒かけて落ちる
        el.style.animationDuration = duration + 's';
        
        const size = Math.random() * 1.5 + 0.8;
        el.style.fontSize = size + 'rem';
        
        const blur = Math.random() * 3;
        el.style.filter = `blur(${blur}px) drop-shadow(0 0 10px rgba(255,255,255,0.4))`;
        
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(el);
        
        // アニメーション終了後に削除
        setTimeout(() => el.remove(), duration * 1000);
    }, 1200); // 1.2秒おきに新しい羽を降らせる
}

function initSparkles() {
    const colors = ['#d4a853', '#f5e6b8', '#b8a9e8', '#e8a0bf', '#ffffff'];
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
        sparkle.style.setProperty('--delay', (Math.random() * 5) + 's');
        sparkle.style.width = (Math.random() * 3 + 2) + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(sparkle);
    }
}

function createDivineRays() {
    const container = document.getElementById('divine-rays');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'divine-ray';
        ray.style.transform = `rotate(${(360 / 12) * i}deg)`;
        ray.style.animationDelay = (i * 0.08) + 's';
        container.appendChild(ray);
    }
}

function activateDivineRays() {
    document.querySelectorAll('.divine-ray').forEach(ray => ray.classList.add('active'));
}

function screenFlash() {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.body.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function playSound(id) {
    const a = document.getElementById(id);
    if (a) { a.currentTime = 0; a.play().catch(() => {}); }
}

/* ============================================================
   🔐 認証管理
   ============================================================ */
class AuthManager {
    constructor(onAuthChange) {
        this.token = localStorage.getItem('angel_token');
        const savedUser = localStorage.getItem('angel_user');
        this.user = savedUser ? JSON.parse(savedUser) : null;
        this.onAuthChange = onAuthChange;
        
        // Modal Elements
        this.modal = document.getElementById('auth-modal-overlay');
        this.closeBtn = document.getElementById('auth-modal-close');
        this.form = document.getElementById('auth-form');
        this.emailInput = document.getElementById('auth-email');
        this.passwordInput = document.getElementById('auth-password');
        this.errorMsg = document.getElementById('auth-error');
        this.title = document.getElementById('auth-title');
        this.subtitle = document.getElementById('auth-subtitle');
        this.submitBtn = document.getElementById('auth-submit-btn');
        this.switchBtn = document.getElementById('auth-switch-btn');
        this.switchText = document.getElementById('auth-switch-text');
        this.headerBtn = document.getElementById('header-auth-btn');

        // Auth Form Additional Inputs
        this.nicknameInput = document.getElementById('auth-nickname');
        this.birthdateInput = document.getElementById('auth-birthdate');
        this.nicknameGroup = document.getElementById('auth-nickname-group');
        this.birthdateGroup = document.getElementById('auth-birthdate-group');

        this.isLoginMode = true;

        this.init();
        this.validateSession();
    }

    parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    init() {
        this.updateHeaderBtn();

        if (this.headerBtn) {
            this.headerBtn.addEventListener('click', () => {
                if (this.token) this.openMyPage();
                else this.openModal('login');
            });
        }

        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
        if (this.modal) this.modal.addEventListener('click', (e) => { if(e.target === this.modal) this.closeModal(); });

        if (this.switchBtn) {
            this.switchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.isLoginMode = !this.isLoginMode;
                this.updateFormUI();
            });
        }

        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitForm();
            });
        }

        // My Page Elements
        this.mypageModal = document.getElementById('mypage-modal-overlay');
        this.mypageClose = document.getElementById('mypage-close');
        this.mypageLogoutBtn = document.getElementById('mypage-logout-btn');
        this.billingBtn = document.getElementById('mypage-billing-btn');
        
        if (this.mypageClose) this.mypageClose.addEventListener('click', () => this.closeMyPage());
        if (this.mypageModal) this.mypageModal.addEventListener('click', (e) => { if (e.target === this.mypageModal) this.closeMyPage(); });
        if (this.mypageLogoutBtn) this.mypageLogoutBtn.addEventListener('click', () => this.logout());
        if (this.billingBtn) this.billingBtn.addEventListener('click', () => this.openBillingPortal());

        // History Tabs
        const historyTabs = document.querySelectorAll('.history-tab');
        historyTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                historyTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadHistory(tab.dataset.filter);
            });
        });
    }

    updateHeaderBtn() {
        if (!this.headerBtn) return;
        if (this.token) {
            this.headerBtn.innerHTML = '<img src="assets/icon-user.png" class="icon-tiny" onerror="this.style.visibility=\'hidden\'"> マイページ';
        } else {
            this.headerBtn.textContent = 'ログイン・登録';
        }
    }

    updateFormUI() {
        this.errorMsg.classList.add('hidden');
        if (this.isLoginMode) {
            this.title.textContent = 'ログイン';
            if (this.subtitle) this.subtitle.textContent = 'ログインして鑑定履歴やPremiumを管理';
            this.submitBtn.textContent = 'ログイン';
            this.switchText.textContent = 'アカウントをお持ちでないですか？';
            this.switchBtn.textContent = '新規登録';
            if (this.nicknameGroup) this.nicknameGroup.classList.add('hidden');
            if (this.birthdateGroup) this.birthdateGroup.classList.add('hidden');
        } else {
            this.title.textContent = '新規登録';
            if (this.subtitle) this.subtitle.textContent = '無料登録後、そのままPremium購入へ進めます';
            this.submitBtn.textContent = '登録して始める';
            this.switchText.textContent = 'すでにアカウントをお持ちですか？';
            this.switchBtn.textContent = 'ログイン';
            if (this.nicknameGroup) this.nicknameGroup.classList.remove('hidden');
            if (this.birthdateGroup) this.birthdateGroup.classList.remove('hidden');
        }
    }

    openModal(mode = 'login') {
        this.isLoginMode = mode !== 'register';
        this.updateFormUI();
        this.emailInput.value = '';
        this.passwordInput.value = '';
        if (this.nicknameInput) this.nicknameInput.value = '';
        if (this.birthdateInput) this.birthdateInput.value = '';
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    clearSession() {
        localStorage.removeItem('angel_token');
        localStorage.removeItem('angel_user');
        this.token = null;
        this.user = null;
        this.updateHeaderBtn();
        this.closeMyPage();
    }

    async validateSession() {
        if (!this.token) return;

        try {
            const res = await fetch('/api/me', { headers: this.getAuthHeaders() });
            if (!res.ok) throw new Error('session expired');
            const data = await res.json();
            this.user = data.user;
            localStorage.setItem('angel_user', JSON.stringify(this.user));
            if (this.onAuthChange) await this.onAuthChange();
        } catch (error) {
            this.clearSession();
        }
    }

    async openMyPage() {
        if (!this.mypageModal) return;
        this.mypageModal.classList.remove('hidden');
        const accountLines = [];
        if (this.user.nickname) accountLines.push(`${this.user.nickname} 様`);
        accountLines.push(this.user.email || '');
        if (this.user.birthdate) accountLines.push(`生年月日: ${this.user.birthdate}`);
        document.getElementById('mypage-email').innerHTML = accountLines.map(escapeHTML).join('<br>');
        document.getElementById('mypage-plan-badge').textContent = this.user.isPremium ? 'Premium ✦' : 'Free';
        if (this.billingBtn) {
            this.billingBtn.classList.toggle('hidden', !this.user.isPremium);
        }
        
        await this.loadHistory();
    }
    
    closeMyPage() {
        if (this.mypageModal) this.mypageModal.classList.add('hidden');
    }

    async loadHistory(filter = 'all') {
        const list = document.getElementById('history-list');
        list.innerHTML = '<p class="history-empty">履歴を読み込み中...</p>';
        try {
            const res = await fetch('/api/history', { headers: this.getAuthHeaders() });
            const data = await res.json();
            if (res.status === 401) {
                this.clearSession();
                this.openModal('login');
                return;
            }
            if (!res.ok) throw new Error(data.error || '履歴の取得に失敗しました。');
                
            // フィルタリング
            const filteredHistory = filter === 'favorite' 
                ? data.history.filter(item => item.isFavorite) 
                : data.history;

                if (filteredHistory.length === 0) {
                    list.innerHTML = filter === 'favorite'
                        ? '<p class="history-empty">お気に入りに登録された神託はありません</p>'
                        : '<p class="history-empty">まだ天使からのメッセージを受け取っていません</p>';
                } else {
                    list.innerHTML = '';
                    filteredHistory.forEach(item => {
                        const dateObj = new Date(item.timestamp);
                        const dateStr = dateObj.toLocaleDateString('ja-JP') + ' ' + dateObj.toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'});
                        const favClass = item.isFavorite ? 'favorite-btn active' : 'favorite-btn';
                        const favIcon = item.isFavorite ? '★' : '☆';
                        const safeId = escapeCSSIdentifier(item.id);
                        
                        const el = document.createElement('div');
                        el.className = 'history-item';
                        el.innerHTML = `
                            <div class="history-header">
                                <span class="history-date">${escapeHTML(dateStr)}</span>
                                <div class="history-header-actions">
                                    <span class="history-badge">${escapeHTML(item.position || '複数引き')}</span>
                                    <button class="${favClass}" data-id="${escapeHTML(item.id)}" title="お気に入り">${favIcon}</button>
                                </div>
                            </div>
                            <div class="history-card">${escapeHTML(item.cardName)}</div>
                            <div class="history-reading">${formatReadingHTML(item.reading)}</div>
                            
                            <div class="history-chat-section hidden" id="chat-section-${escapeHTML(item.id)}">
                                <div class="chat-history" id="chat-history-${escapeHTML(item.id)}">
                                    ${(item.chatHistory || []).map(chat => {
                                        const role = chat.role === 'user' ? 'user' : 'assistant';
                                        return `
                                        <div class="chat-msg ${role}">
                                            <span class="chat-icon">${role === 'user' ? '👤' : '👼'}</span>
                                            <div class="chat-bubble">${formatReadingHTML(chat.content)}</div>
                                        </div>
                                    `;
                                    }).join('')}
                                </div>
                                <div class="chat-input-area">
                                    <input type="text" id="chat-input-${escapeHTML(item.id)}" placeholder="天使に質問する...">
                                    <button class="chat-send-btn" data-id="${escapeHTML(item.id)}">送信</button>
                                </div>
                            </div>

                            <div class="history-actions">
                                <button class="pdf-download-btn" data-id="${escapeHTML(item.id)}" title="鑑定書をPDFでダウンロード">
                                    📜 PDFで保存
                                </button>
                                <button class="followup-toggle-btn" data-id="${escapeHTML(item.id)}">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                    深掘りチャット 🔒
                                </button>
                                <button class="calendar-btn">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    カレンダー保存
                                </button>
                                <div class="calendar-dropdown">
                                    <button class="calendar-option google-cal-btn">Googleカレンダーに追加</button>
                                    <button class="calendar-option apple-cal-btn">Appleカレンダー (.ics)</button>
                                </div>
                            </div>
                        `;

                        // Favorite toggle
                        const favBtn = el.querySelector('.favorite-btn');
                        favBtn.addEventListener('click', async () => {
                            const isFav = !favBtn.classList.contains('active');
                            const payload = { id: item.id, isFavorite: isFav };
                            const res = await fetch('/api/history/favorite', {
                                method: 'POST',
                                headers: this.getAuthHeaders(),
                                body: JSON.stringify(payload)
                            });
                            if (res.ok) {
                                favBtn.classList.toggle('active');
                                favBtn.textContent = isFav ? '★' : '☆';
                            }
                        });

                        // Chat Followup toggle
                        const chatToggle = el.querySelector('.followup-toggle-btn');
                        const chatSection = el.querySelector(`#chat-section-${safeId}`);
                        chatToggle.addEventListener('click', () => {
                            if (!this.user.isPremium) {
                                const overlay = document.getElementById('premium-modal-overlay');
                                if (overlay) overlay.classList.remove('hidden');
                                return;
                            }
                            chatSection.classList.toggle('hidden');
                        });

                        // Chat Send
                        const chatSend = el.querySelector('.chat-send-btn');
                        const chatInput = el.querySelector(`#chat-input-${safeId}`);
                        const chatHist = el.querySelector(`#chat-history-${safeId}`);
                        chatSend.addEventListener('click', async () => {
                            const msg = chatInput.value.trim();
                            if (!msg) return;
                            
                            // User msg rendering
                            chatHist.innerHTML += `
                                <div class="chat-msg user">
                                    <span class="chat-icon">👤</span>
                                    <div class="chat-bubble">${formatReadingHTML(msg)}</div>
                                </div>`;
                            chatInput.value = '';
                            
                            // Loading rendering
                            const loadingId = 'loading-' + Date.now();
                            chatHist.innerHTML += `
                                <div class="chat-msg assistant" id="${loadingId}">
                                    <span class="chat-icon">👼</span>
                                    <div class="chat-bubble"><div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;margin:0;"></div></div>
                                </div>`;
                            
                            try {
                                const chatRes = await fetch('/api/chat-followup', {
                                    method: 'POST',
                                    headers: this.getAuthHeaders(),
                                    body: JSON.stringify({ id: item.id, message: msg })
                                });
                                document.getElementById(loadingId).remove();
                                
                                if (chatRes.ok) {
                                    const chatData = await chatRes.json();
                                    chatHist.innerHTML += `
                                        <div class="chat-msg assistant">
                                            <span class="chat-icon">👼</span>
                                            <div class="chat-bubble">${formatReadingHTML(chatData.reply)}</div>
                                        </div>`;
                                } else {
                                    alert('チャットの送信に失敗しました。');
                                }
                            } catch (e) {
                                document.getElementById(loadingId).remove();
                                alert('エラーが発生しました。');
                            }
                        });
                        
                        // Dropdown toggle logic
                        const calBtn = el.querySelector('.calendar-btn');
                        const dropdown = el.querySelector('.calendar-dropdown');
                        calBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (!this.user.isPremium) {
                                const overlay = document.getElementById('premium-modal-overlay');
                                if (overlay) overlay.classList.remove('hidden');
                                return;
                            }
                            
                            // Close other dropdowns
                            document.querySelectorAll('.calendar-dropdown.show').forEach(d => {
                                if (d !== dropdown) d.classList.remove('show');
                            });
                            dropdown.classList.toggle('show');
                        });
                        
                        el.querySelector('.google-cal-btn').addEventListener('click', () => this.exportGoogleCalendar(item));
                        el.querySelector('.apple-cal-btn').addEventListener('click', () => this.exportAppleCalendar(item));
                        
                        // PDF Download
                        const pdfBtn = el.querySelector('.pdf-download-btn');
                        pdfBtn.addEventListener('click', () => this.exportPDF(item, dateStr));
                        
                        list.appendChild(el);
                    });
                    
                    // Close dropdowns on outside click
                    document.addEventListener('click', () => {
                        document.querySelectorAll('.calendar-dropdown.show').forEach(d => d.classList.remove('show'));
                    });
                }
        } catch (e) {
            list.innerHTML = '<p class="history-empty">履歴の読み込みに失敗しました。</p>';
        }
    }

    formatCalendarDate(date, isIcs = false) {
        const pad = (n) => n.toString().padStart(2, '0');
        const y = date.getUTCFullYear();
        const m = pad(date.getUTCMonth() + 1);
        const d = pad(date.getUTCDate());
        const h = pad(date.getUTCHours());
        const min = pad(date.getUTCMinutes());
        const s = pad(date.getUTCSeconds());
        
        if (isIcs) return `${y}${m}${d}T${h}${min}${s}Z`;
        // Google uses YYYYMMDDTHHmmssZ
        return `${y}${m}${d}T${h}${min}${s}Z`;
    }

    exportGoogleCalendar(item) {
        const title = encodeURIComponent(`🔮 Angelique Tarot: ${item.cardName}`);
        const date = new Date(item.timestamp);
        // Event length: 1 hour for reflection
        const endDate = new Date(date.getTime() + 60 * 60 * 1000);
        
        const startStr = this.formatCalendarDate(date);
        const endStr = this.formatCalendarDate(endDate);
        
        const details = encodeURIComponent(`【天使の神託】\n\n${item.reading.replace(/<br>/g, '\n')}\n\nURL: ${window.location.origin}`);
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startStr}/${endStr}`;
        
        window.open(url, '_blank');
    }

    exportAppleCalendar(item) {
        const date = new Date(item.timestamp);
        const endDate = new Date(date.getTime() + 60 * 60 * 1000);
        
        const startStr = this.formatCalendarDate(date, true);
        const endStr = this.formatCalendarDate(endDate, true);
        const nowStr = this.formatCalendarDate(new Date(), true);
        
        const title = `🔮 Angelique Tarot: ${item.cardName}`;
        // Clean up <br> tags and escape newlines
        const description = `【天使の神託】\\n\\n${item.reading.replace(/<br>/g, '\\n')}\\n\\nURL: ${window.location.origin}`;
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Angelique Tarot//JP',
            'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            `DTSTAMP:${nowStr}`,
            `DTSTART:${startStr}`,
            `DTEND:${endStr}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `tarot_${date.getTime()}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportPDF(item, dateStr) {
        // PDF用の一時的なコンテナを作成
        const container = document.createElement('div');
        container.style.backgroundColor = '#fdfbf7'; // 幻想的なクリームホワイト
        container.style.color = '#333333';
        container.style.fontFamily = "'Noto Serif JP', serif";
        
        let cardImagesHTML = '';
        if (item.cards && Array.isArray(item.cards)) {
            cardImagesHTML = item.cards.map(c => {
                const isReversed = c.position === '逆位置';
                const transform = isReversed ? 'transform: rotate(180deg);' : '';
                return `<img src="${window.location.origin}/${c.img}" style="width: 100px; margin: 10px; border-radius: 6px; box-shadow: 0 4px 15px rgba(212,168,83,0.3); ${transform}" crossorigin="anonymous">`;
            }).join('');
        } else {
            // 履歴からの復元など、cards配列がない場合のベストエフォート検索
            const sortedDeck = [...TAROT_DECK].sort((a,b) => b.ja.length - a.ja.length);
            let tempName = item.cardName || '';
            const foundImgs = [];
            sortedDeck.forEach(card => {
                if (tempName.includes(card.ja)) {
                    const isReversed = item.cardName.includes(`${card.ja} (逆位置)`) || item.position === '逆位置';
                    const transform = isReversed ? 'transform: rotate(180deg);' : '';
                    foundImgs.push(`<img src="${window.location.origin}/${card.img}" style="width: 100px; margin: 10px; border-radius: 6px; box-shadow: 0 4px 15px rgba(212,168,83,0.3); ${transform}" crossorigin="anonymous">`);
                    tempName = tempName.replace(card.ja, '');
                }
            });
            cardImagesHTML = foundImgs.join('');
        }

        const decorativeDivider = `
        <div style="text-align: center; margin: 25px 0;">
            <svg width="240" height="16" viewBox="0 0 240 16">
                <line x1="0" y1="8" x2="100" y2="8" stroke="#d4a853" stroke-width="0.5" opacity="0.6"/>
                <path d="M 115 8 L 120 2 L 125 8 L 120 14 Z" fill="#d4a853" opacity="0.8"/>
                <circle cx="120" cy="8" r="1.5" fill="#fff"/>
                <circle cx="108" cy="8" r="2" fill="#d4a853" opacity="0.5"/>
                <circle cx="132" cy="8" r="2" fill="#d4a853" opacity="0.5"/>
                <line x1="140" y1="8" x2="240" y2="8" stroke="#d4a853" stroke-width="0.5" opacity="0.6"/>
            </svg>
        </div>`;
        
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="color: #d4a853; font-size: 16px; margin-bottom: 8px; opacity: 0.8;">✦ ✧ ✦</div>
                <h1 style="font-family: 'Cinzel Decorative', serif; color: #b38b3d; font-size: 28px; margin-bottom: 10px; letter-spacing: 3px;">Angelique Tarot</h1>
                <p style="font-size: 13px; color: #777; margin-bottom: 5px; letter-spacing: 2px;">The Oracle of Archangels</p>
            </div>
            
            ${decorativeDivider}
            
            <div style="margin-bottom: 30px; display: flex; justify-content: space-between; font-size: 12px; color: #666; padding: 0 10px;">
                <span>鑑定日時：${dateStr}</span>
                <span>展開法：${item.position || '鑑定結果'}</span>
            </div>
            
            <div style="margin-bottom: 30px; padding: 25px 20px; background: rgba(253, 252, 247, 0.7); border-radius: 8px; text-align: center;">
                <h2 style="font-size: 18px; color: #b38b3d; margin-top: 0; margin-bottom: 20px; letter-spacing: 1px;">✦ 導かれたカード ✦</h2>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
                    ${cardImagesHTML}
                </div>
                <p style="font-size: 15px; line-height: 1.6; font-weight: bold; color: #555; margin: 0;">${item.cardName.replace(/\n/g, '<br>')}</p>
            </div>
            
            ${decorativeDivider}
            
            <div style="margin-bottom: 40px; padding: 0 10px;">
                <h2 style="font-size: 18px; color: #b38b3d; margin-top: 0; margin-bottom: 25px; text-align: center; letter-spacing: 1px;">✦ 天使からのメッセージ ✦</h2>
                <div style="font-size: 14px; line-height: 2.0; text-align: justify; color: #444; letter-spacing: 0.5px;">
                    ${item.reading}
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 60px; font-size: 12px; color: #999;">
                <p style="margin-bottom: 8px; font-style: italic; color: #d4a853;">May the angels guide your path.</p>
                <p>Angelique Tarot - ${window.location.origin}</p>
            </div>
        `;
        
        // オプション設定
        const opt = {
            margin:       [20, 18, 20, 18],
            filename:     `tarot_reading_${new Date(item.timestamp).getTime()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // html2pdf実行
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(container).toPdf().get('pdf').then(function (pdf) {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    // 幻想的な二重枠をすべてのページに描画
                    pdf.setDrawColor(212, 168, 83); // #d4a853
                    
                    // 外枠
                    pdf.setLineWidth(0.6);
                    pdf.rect(8, 8, 194, 281);
                    
                    // 内枠
                    pdf.setLineWidth(0.2);
                    pdf.rect(10, 10, 190, 277);
                    
                    // 四隅の装飾（ひし形）
                    pdf.setFillColor(212, 168, 83);
                    const drawDiamond = (x, y) => {
                        pdf.lines([[2, -2], [2, 2], [-2, 2], [-2, -2]], x - 2, y + 2, [1, 1], 'F');
                    };
                    drawDiamond(10, 10);
                    drawDiamond(200, 10);
                    drawDiamond(10, 287);
                    drawDiamond(200, 287);
                }
            }).save();
        } else {
            alert('PDF生成ライブラリが読み込まれていません。ページを再読み込みしてください。');
        }
    }

    async submitForm() {
        this.submitBtn.disabled = true;
        this.errorMsg.classList.add('hidden');

        const payload = {
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value,
            nickname: this.nicknameInput ? this.nicknameInput.value.trim() : '',
            birthdate: this.birthdateInput ? this.birthdateInput.value : ''
        };

        try {
            const endpoint = this.isLoginMode ? '/api/login' : '/api/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || '認証に失敗しました。');
            }

            if (!this.isLoginMode) {
                this.isLoginMode = true;
                this.updateFormUI();
                this.errorMsg.textContent = data.message || '登録を受け付けました。ログインしてください。';
                this.errorMsg.classList.remove('hidden');
                this.errorMsg.classList.add('is-success');
                return;
            }

            this.token = data.token;
            this.user = data.user;

            localStorage.setItem('angel_token', this.token);
            localStorage.setItem('angel_user', JSON.stringify(this.user));

            this.updateHeaderBtn();
            this.closeModal();
            if (this.onAuthChange) await this.onAuthChange();
            await this.openMyPage();
        } catch (error) {
            this.errorMsg.textContent = error.message || '認証に失敗しました。';
            this.errorMsg.classList.remove('hidden');
            this.errorMsg.classList.remove('is-success');
        } finally {
            this.submitBtn.disabled = false;
        }
    }

    logout() {
        this.clearSession();
        if (this.onAuthChange) this.onAuthChange();
        
        // ログアウト時に画面をリロードして状態をリセット
        window.location.reload();
    }

    async openBillingPortal() {
        if (!this.token) {
            this.openModal();
            return;
        }

        if (this.billingBtn) {
            this.billingBtn.disabled = true;
            this.billingBtn.textContent = '準備中...';
        }

        try {
            const res = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: this.getAuthHeaders()
            });
            const data = await res.json();
            if (res.status === 401) {
                this.clearSession();
                this.openModal('login');
                return;
            }
            if (!res.ok || !data.url) throw new Error(data.error || 'プラン管理画面を開けませんでした。');
            window.location.href = data.url;
        } catch (error) {
            alert(error.message || 'プラン管理画面を開けませんでした。');
        } finally {
            if (this.billingBtn) {
                this.billingBtn.disabled = false;
                this.billingBtn.textContent = 'プラン管理・解約';
            }
        }
    }

    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    }
}

/* ============================================================
   🔮 フリーミアム管理
   ============================================================ */
class FreemiumManager {
    constructor(authManager) {
        this.auth = authManager;
        this.usage = null;
        this.lastCardName = '';
        this.lastPosition = '';
    }

    async fetchUsage() {
        try {
            const res = await fetch('/api/usage', { headers: this.auth.getAuthHeaders() });
            if (!res.ok) throw new Error('Usage API failed');
            this.usage = await res.json();
        } catch (e) {
            console.warn('Usage fetch failed:', e);
            this.usage = { count: 0, limit: 0, remaining: 0, shared: false, isPremium: false, serviceUnavailable: true };
        }
        this.updateUI();
        return this.usage;
    }

    updateUI() {
        const counter = document.getElementById('usage-counter');
        const remainingEl = document.getElementById('usage-remaining');
        const usageText = document.getElementById('usage-text');
        const shareBonusHint = document.getElementById('share-bonus-hint');
        const limitAdBtn = document.getElementById('limit-ad-btn');

        if (!this.usage || !counter) return;

        if (this.usage.serviceUnavailable) {
            usageText.textContent = '利用状況を確認できません';
            counter.classList.add('is-depleted');
            counter.classList.remove('is-premium');
        } else if (this.usage.isPremium) {
            usageText.innerHTML = '<strong>Premium</strong> ✦';
            counter.classList.add('is-premium');
            counter.classList.remove('is-depleted');
        } else if (this.usage.remaining <= 0) {
            remainingEl.textContent = '0';
            counter.classList.add('is-depleted');
            counter.classList.remove('is-premium');
        } else {
            remainingEl.textContent = this.usage.remaining;
            counter.classList.remove('is-depleted');
            counter.classList.remove('is-premium');
        }

        if (shareBonusHint && this.usage.shared) {
            shareBonusHint.style.display = 'none';
        }
        
        if (limitAdBtn) {
            limitAdBtn.style.display = 'none';
            limitAdBtn.disabled = true;
        }
    }

    canRead() {
        if (!this.usage) return true;
        if (this.usage.isPremium) return true;
        return this.usage.remaining > 0;
    }

    showLimitOverlay() {
        const overlay = document.getElementById('limit-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.startCountdown();
        }
    }

    hideLimitOverlay() {
        const overlay = document.getElementById('limit-overlay');
        if (overlay) overlay.classList.add('hidden');
    }

    startCountdown() {
        const el = document.getElementById('limit-countdown');
        if (!el) return;
        if (this._countdownInterval) clearInterval(this._countdownInterval);
        const tick = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0);
            const diff = tomorrow - now;
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            el.textContent = `${h}:${m}:${s}`;
        };
        tick();
        this._countdownInterval = setInterval(tick, 1000);
    }

    async reportShare(platform) {
        try {
            const res = await fetch('/api/shared', { method: 'POST', headers: this.auth.getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                await this.fetchUsage();
                this.hideLimitOverlay();
                return data;
            }
        } catch (e) { console.error('Share report failed:', e); }
        return null;
    }

    async reportAdWatch() {
        try {
            const res = await fetch('/api/reward-ad', { method: 'POST', headers: this.auth.getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                await this.fetchUsage();
                this.hideLimitOverlay();
                return data;
            } else {
                const err = await res.json();
                alert(err.error || 'エラーが発生しました');
            }
        } catch (e) { console.error('Ad report failed:', e); }
        return null;
    }

    updateAfterReading(usageData) {
        if (usageData) {
            this.usage = { ...this.usage, ...usageData };
            this.updateUI();
        }
    }
}

/* ============================================================
   📤 シェア機能
   ============================================================ */
class ShareManager {
    constructor(freemiumManager) {
        this.fm = freemiumManager;
    }

    getShareText() {
        const card = this.fm.lastCardName || '天使のカード';
        const pos = this.fm.lastPosition || '';
        return `🔮 Angelique Tarotで「${card}」${pos}を引きました！天使のメッセージを受け取りましょう ✦\n`;
    }

    getShareURL() {
        return window.location.href;
    }

    shareToX() {
        const text = encodeURIComponent(this.getShareText());
        const url = encodeURIComponent(this.getShareURL());
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
        this.fm.reportShare('x');
    }

    shareToFB() {
        const url = encodeURIComponent(this.getShareURL());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
        this.fm.reportShare('facebook');
    }

    shareToThreads() {
        const text = encodeURIComponent(this.getShareText());
        const url = encodeURIComponent(this.getShareURL());
        window.open(`https://www.threads.net/intent/post?text=${text}%20${url}`, '_blank', 'width=550,height=420');
        this.fm.reportShare('threads');
    }

    shareToLINE() {
        const text = encodeURIComponent(this.getShareText() + this.getShareURL());
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(this.getShareURL())}&text=${text}`, '_blank');
        this.fm.reportShare('line');
    }

    copyLink() {
        navigator.clipboard.writeText(this.getShareText() + this.getShareURL()).then(() => {
            const btn = document.getElementById('share-copy');
            if (btn) { const orig = btn.innerHTML; btn.innerHTML = '✓ コピー済'; setTimeout(() => btn.innerHTML = orig, 2000); }
            this.fm.reportShare('copy');
        }).catch(() => {});
    }
}

/* ============================================================
   Main
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Contact Modal Logic
    const openContactModal = document.getElementById('open-contact-modal');
    const contactModalOverlay = document.getElementById('contact-modal-overlay');
    const contactModalClose = document.getElementById('contact-modal-close');
    const contactForm = document.getElementById('contact-form');
    const contactError = document.getElementById('contact-error');
    const contactSuccess = document.getElementById('contact-success');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    if (openContactModal && contactModalOverlay) {
        openContactModal.addEventListener('click', (e) => {
            e.preventDefault();
            contactModalOverlay.classList.remove('hidden');
            contactError.classList.add('hidden');
            contactSuccess.classList.add('hidden');
            if (contactForm) contactForm.reset();
        });
    }

    if (contactModalClose && contactModalOverlay) {
        contactModalClose.addEventListener('click', () => {
            contactModalOverlay.classList.add('hidden');
        });
        contactModalOverlay.addEventListener('click', (e) => {
            if (e.target === contactModalOverlay) contactModalOverlay.classList.add('hidden');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            contactError.classList.add('hidden');
            contactSuccess.classList.add('hidden');
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            const originalBtnText = contactSubmitBtn.innerHTML;
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.innerHTML = '送信中...';

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || '送信に失敗しました。');

                contactForm.reset();
                contactSuccess.textContent = 'お問い合わせを送信しました。';
                contactSuccess.classList.remove('hidden');
                
                setTimeout(() => {
                    contactModalOverlay.classList.add('hidden');
                }, 3000);
            } catch (error) {
                contactError.textContent = error.message;
                contactError.classList.remove('hidden');
            } finally {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // 幻想エフェクト初期化
    const particleCanvas = document.getElementById('particle-canvas');
    const particleSystem = particleCanvas ? new ParticleSystem(particleCanvas) : null;
    initFloatingFeathers();
    initSparkles();
    createDivineRays();

    // マネージャー初期化
    let selectedPlan = 'yearly';
    let pendingCheckoutPlan = null;
    const authManager = new AuthManager(async () => {
        await fm.fetchUsage();
        if (fm.usage && fm.usage.isPremium && document.getElementById('premium-modal-overlay')) {
            document.getElementById('premium-modal-overlay').classList.add('hidden');
        }
        if (pendingCheckoutPlan && authManager.token) {
            const plan = pendingCheckoutPlan;
            pendingCheckoutPlan = null;
            setTimeout(() => startCheckout(plan), 0);
        }
    });

    const fm = new FreemiumManager(authManager);
    const shareManager = new ShareManager(fm);
    fm.fetchUsage();

    // DOM要素
    const deckPack        = document.getElementById('deck-pack');
    const deckContainer   = document.getElementById('deck-container');
    const spreadContainer = document.getElementById('spread-container');
    const cardSpread      = document.getElementById('card-spread');
    const revealContainer = document.getElementById('reveal-container');
    const loading         = document.getElementById('loading');
    const resultText      = document.getElementById('result-text');
    const retryBtn        = document.getElementById('retry-btn');
    const magicCircle     = document.getElementById('magic-circle');
    const premiumTeaser   = document.getElementById('premium-teaser');
    const shareSection    = document.getElementById('share-section');
    const selectionProgress = document.getElementById('selection-progress');
    const selectionRemaining = document.getElementById('selection-remaining');
    const revealedCardsContainer = document.getElementById('revealed-cards-container');

    // 占い設定状態
    let selectedSpread = 1; // 1, 3, 5, 7
    let selectedTheme = '総合';
    let selectedAngel = 'default';

    // 進行状態
    let drawnCards = [];
    let chosenCards = []; // 選ばれたカードの配列
    let currentReadingId = null;

    // プレミアムモーダルを開くヘルパー（後続の関数を参照）
    const triggerPremium = () => {
        openPremiumModal();
    };

    const spotlightLockedOption = (button) => {
        button.classList.remove('locked-pulse');
        void button.offsetWidth;
        button.classList.add('locked-pulse');
        setTimeout(() => button.classList.remove('locked-pulse'), 650);
    };

    // 設定UIイベントリスナー
    const spreadOptions = document.querySelectorAll('#spread-options .setting-btn');
    spreadOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            let requiredPremium = false;
            
            if (val === '5' || val === '7' || val === '10' || val === 'hexagram') {
                requiredPremium = true;
            }
            
            if (requiredPremium && (!fm.usage || !fm.usage.isPremium)) {
                spotlightLockedOption(btn);
                triggerPremium();
                return;
            }
            
            spreadOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // selectedSpread に文字列(hexagram) または 数値 をセット
            selectedSpread = (val === 'hexagram') ? 'hexagram' : parseInt(val, 10);
        });
    });

    const angelOptions = document.querySelectorAll('#angel-options .setting-btn');
    if (angelOptions.length > 0) {
        angelOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const angelValue = btn.dataset.value;
                if (angelValue !== 'default' && (!fm.usage || !fm.usage.isPremium)) {
                    spotlightLockedOption(btn);
                    triggerPremium();
                    return;
                }
                angelOptions.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedAngel = angelValue;
                
                const descEl = document.getElementById('angel-description');
                if (descEl) {
                    const descs = {
                        'default': '各天使には得意なサポート分野があります。お悩みに合わせて指名してください。',
                        'michael': '大天使ミカエル：勇気と行動を促す力強いアドバイス。恐れを断ち切り、前へ進みたい時に。',
                        'raphael': '大天使ラファエル：癒しと心のケアを中心とした優しいアドバイス。傷ついた心を癒したい時に。',
                        'gabriel': '大天使ガブリエル：直感と創造性、対人関係のコミュニケーションに関するインスピレーション。',
                        'uriel': '大天使ウリエル：知恵と真実をもたらす論理的でクリアな解決策。現状を冷静に分析したい時に。'
                    };
                    descEl.textContent = descs[angelValue] || descs['default'];
                }
            });
        });
    }

    const themeOptions = document.querySelectorAll('#theme-options .setting-btn');
    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            themeOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTheme = btn.dataset.value;
        });
    });

    /* ========== 1. パック開封 ========== */
    deckPack.addEventListener('click', () => {
        if (!fm.canRead()) { fm.showLimitOverlay(); return; }
        
        playSound('se-open');
        const rect = deckPack.getBoundingClientRect();
        if (particleSystem) particleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
        screenFlash();
        const container = document.getElementById('feathers');
        if (container) {
            const chars = ['🪶','✦','✧','🕊','☆','✵'];
            for (let i = 0; i < 18; i++) {
                const el = document.createElement('span');
                el.className = 'feather';
                el.textContent = chars[Math.floor(Math.random()*chars.length)];
                el.style.left = Math.random()*100+'%';
                el.style.top = Math.random()*100+'%';
                el.style.animationDelay = Math.random()*0.6+'s';
                container.appendChild(el);
            }
        }
        deckPack.classList.add('explode-anim');
        setTimeout(() => { deckContainer.classList.add('hidden'); dealCards(); }, 1000);
    });

    /* ========== 2. カードを配る ========== */
    function dealCards() {
        cardSpread.innerHTML = '';
        chosenCards = [];
        let dealCount = 9;
        if (selectedSpread === 3 || selectedSpread === 5) dealCount = 12;
        if (selectedSpread === 7 || selectedSpread === 'hexagram') dealCount = 14;
        if (selectedSpread === 10) dealCount = 20;
        drawnCards = shuffle(TAROT_DECK).slice(0, dealCount);
        
        const requiredCount = (selectedSpread === 'hexagram') ? 7 : selectedSpread;
        document.getElementById('spread-instruction').textContent = `心に響くカードを${requiredCount}枚選んでください`;
        
        if (requiredCount > 1) {
            selectionProgress.classList.remove('hidden');
            selectionRemaining.textContent = requiredCount - chosenCards.length;
        } else {
            selectionProgress.classList.add('hidden');
        }

        spreadContainer.classList.remove('hidden');
        spreadContainer.classList.add('fade-in-slide');
        
        drawnCards.forEach((card, i) => {
            const div = document.createElement('div');
            div.className = 'spread-card';
            div.style.animationDelay = (i * 0.12) + 's';
            div.classList.add('deal-anim');
            div.dataset.index = i;
            div.innerHTML = `<div class="card-inner"><img src="assets/card-back.png" alt="Card ${i+1}"></div>`;
            div.addEventListener('click', () => selectCard(i, div));
            cardSpread.appendChild(div);
        });
    }

    /* ========== 3. カードを選ぶ ========== */
    function selectCard(index, element) {
        if (element.classList.contains('selected')) return;

        playSound('se-select');
        const rect = element.getBoundingClientRect();
        if (particleSystem) particleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        
        element.classList.add('selected');
        
        const selectedCard = drawnCards[index];
        const isReversed = Math.random() > 0.5;
        
        chosenCards.push({
            ...selectedCard,
            position: isReversed ? '逆位置' : '正位置',
            isReversed: isReversed
        });

        const requiredCount = (selectedSpread === 'hexagram') ? 7 : selectedSpread;
        if (requiredCount > 1) {
            selectionRemaining.textContent = requiredCount - chosenCards.length;
            if (chosenCards.length < requiredCount) return; // まだ選ぶ
        }

        // 必要な枚数が選ばれた
        fm.lastCardName = chosenCards[0].ja; // シェア用に先頭を使用
        fm.lastPosition = chosenCards[0].position === '逆位置' ? '（逆位置）' : '（正位置）';
        
        const allCards = cardSpread.querySelectorAll('.spread-card');
        allCards.forEach(c => {
            if (!c.classList.contains('selected')) c.classList.add('not-selected');
        });

        setTimeout(() => { spreadContainer.classList.add('hidden'); showReveal(); }, 800);
    }

    /* ========== 4. リビール ========== */
    function showReveal() {
        revealedCardsContainer.innerHTML = '';
        const positionLabels3 = ['過去', '現在', '未来'];
        const positionLabels5 = ['現在', '障害', '過去', '未来', '最終結果'];
        const positionLabels7 = ['根源', '過去', '現在', '未来', '周囲', '恐れ/希望', '最終結果'];
        const positionLabelsHexagram = ['過去', '現在', '未来', 'あなたの本心', '相手の本心', '神託 (助言)', '最終結果'];
        const positionLabels10 = ['現状', '障害', '目標', '原因', '過去', '未来', '立場', '環境', '希望/不安', '最終結果'];

        if (selectedSpread === 10) {
            revealedCardsContainer.classList.add('celtic-cross-layout');
        } else if (selectedSpread === 'hexagram') {
            revealedCardsContainer.classList.add('hexagram-layout');
        } else {
            revealedCardsContainer.classList.remove('celtic-cross-layout');
            revealedCardsContainer.classList.remove('hexagram-layout');
        }

        chosenCards.forEach((card, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'revealed-card-wrapper';
            
            const reqCount = (selectedSpread === 'hexagram') ? 7 : selectedSpread;
            if (reqCount > 1) {
                const label = document.createElement('div');
                label.className = 'card-position-label';
                if (selectedSpread === 3) label.textContent = positionLabels3[idx];
                else if (selectedSpread === 5) label.textContent = positionLabels5[idx];
                else if (selectedSpread === 7) label.textContent = positionLabels7[idx];
                else if (selectedSpread === 'hexagram') label.textContent = positionLabelsHexagram[idx];
                else if (selectedSpread === 10) label.textContent = positionLabels10[idx];
                
                // assign position string to card object so it can be sent to API
                card.spreadPositionName = label.textContent;
                wrapper.appendChild(label);
            }

            const cardEl = document.createElement('div');
            cardEl.className = 'card revealed-card';
            cardEl.innerHTML = `
                <div class="card__face card__face--front">
                    <img src="${card.img}" alt="" class="card-art">
                    <div class="card-overlay">
                        <span class="card-number">${card.num}</span>
                        <span class="card-name">${card.ja + (card.isReversed ? '（逆位置）' : '（正位置）')}</span>
                    </div>
                </div>
                <div class="card__face card__face--back">
                    <img src="assets/card-back.png" alt="Card Back" class="card-art">
                </div>
            `;
            wrapper.appendChild(cardEl);
            
            // カードクリックで詳細表示
            cardEl.addEventListener('click', () => {
                showCardDetail(card, idx);
            });

            revealedCardsContainer.appendChild(wrapper);

            // アニメーション適用（順にめくる）
            setTimeout(() => {
                if (card.isReversed) cardEl.classList.add('is-reversed');
                cardEl.classList.add('is-flipped');
                playSound('se-flip');
                screenFlash();
                activateDivineRays();
                const rect = cardEl.getBoundingClientRect();
                if (particleSystem) {
                    particleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
                }
            }, 600 + (idx * 600));
        });

        revealContainer.classList.remove('hidden');
        revealContainer.classList.add('fade-in-slide');
        if (magicCircle) magicCircle.classList.add('active');
        
        // すべてのカードのアニメーションが終わった頃にAPI呼び出し
        setTimeout(() => {
            fetchReading();
            // お気に入りボタンなどのアクションを表示
            const resultActions = document.getElementById('result-actions');
            if (resultActions) resultActions.classList.remove('hidden');
        }, 600 + (chosenCards.length * 600));
    }

    /* ========== 5. API Call ========== */
    async function fetchReading() {
        loading.classList.remove('hidden');
        resultText.classList.remove('visible');
        resultText.innerHTML = '';
        currentReadingId = null;
        const saveReadingBtn = document.getElementById('save-reading-btn');
        if (saveReadingBtn) {
            saveReadingBtn.disabled = false;
            saveReadingBtn.innerHTML = '<span class="star-icon">☆</span> お気に入り';
            saveReadingBtn.classList.remove('active');
        }
        retryBtn.classList.add('hidden');
        if (premiumTeaser) premiumTeaser.classList.add('hidden');
        if (shareSection) shareSection.classList.add('hidden');

        try {
            const worryEl = document.getElementById('reading-worry');
            const targetEl = document.getElementById('reading-target');

            const payload = {
                cards: chosenCards.map(c => ({ cardName: c.ja, position: c.position, spreadPosition: c.spreadPositionName })),
                theme: selectedTheme,
                spread: selectedSpread,
                worry: worryEl ? worryEl.value : '',
                targetPerson: targetEl ? targetEl.value : '',
                angelPersona: selectedAngel
            };

            const response = await fetch('/api/read-tarot', {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                const data = await response.json();
                loading.classList.add('hidden');
                resultText.innerHTML = '本日の無料占いは終了しました。<br>明日またお越しください ✦';
                resultText.classList.add('visible');
                fm.showLimitOverlay();
                return;
            }
            if (response.status === 403) {
                loading.classList.add('hidden');
                resultText.innerHTML = 'この機能はプレミアム専用です。';
                resultText.classList.add('visible');
                openPremiumModal();
                return;
            }

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const message = data.reading || '天使のメッセージを受信できませんでした。';
            currentReadingId = data.readingId || null;

            // 利用状況を更新
            if (data.usage) fm.updateAfterReading(data.usage);

            loading.classList.add('hidden');
            resultText.innerHTML = formatReadingHTML(message);
            resultText.classList.add('visible');
            retryBtn.classList.remove('hidden');
            playSound('se-success');

            // 無料ユーザーにプレミアム誘導を表示
            if (!data.isFull && premiumTeaser) {
                premiumTeaser.classList.remove('hidden');
            }
            if (shareSection) shareSection.classList.remove('hidden');

        } catch (error) {
            console.error('API Error:', error);
            loading.classList.add('hidden');
            resultText.innerHTML = '天使との回線が不安定です。<br>サーバーを起動して再試行してください。';
            resultText.classList.add('visible');
            retryBtn.classList.remove('hidden');
        }
    }

    /* ========== 6. もう一度占う ========== */
    retryBtn.addEventListener('click', async () => {
        await fm.fetchUsage();
        if (!fm.canRead()) { fm.showLimitOverlay(); return; }
        
        revealContainer.classList.add('hidden');
        revealContainer.classList.remove('fade-in-slide');
        resultText.innerHTML = '';
        currentReadingId = null;
        resultText.classList.remove('visible');
        retryBtn.classList.add('hidden');
        loading.classList.add('hidden');
        
        if (premiumTeaser) premiumTeaser.classList.add('hidden');
        if (shareSection) shareSection.classList.add('hidden');
        if (magicCircle) magicCircle.classList.remove('active');
        document.querySelectorAll('.divine-ray').forEach(ray => ray.classList.remove('active'));
        createDivineRays();
        
        // 設定画面に戻す
        deckContainer.classList.remove('hidden');
        deckPack.classList.remove('explode-anim');
    });

    /* ========== モーダル制御 ========== */
    const premiumModalOverlay = document.getElementById('premium-modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const premiumTeaserBtn = document.getElementById('premium-teaser-btn');
    const limitPremiumBtn = document.getElementById('limit-premium-btn');
    const limitShareBtn = document.getElementById('limit-share-btn');
    const limitAdBtn = document.getElementById('limit-ad-btn');
    const modalCtaBtn = document.getElementById('modal-cta-btn');

    function openPremiumModal() {
        if (modalCtaBtn) {
            modalCtaBtn.textContent = localStorage.getItem('angel_token')
                ? '✦ プレミアムプランを購入する ✦'
                : '✦ 無料登録して購入する ✦';
        }
        if (premiumModalOverlay) premiumModalOverlay.classList.remove('hidden');
    }
    function closePremiumModal() { if (premiumModalOverlay) premiumModalOverlay.classList.add('hidden'); }

    function formatStripePrice(price) {
        const currency = price.currency.toUpperCase();
        const currencyOptions = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency,
        }).resolvedOptions();
        const divisor = 10 ** currencyOptions.maximumFractionDigits;
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(price.unitAmount / divisor);
    }

    async function loadStripePrices() {
        const response = await fetch('/api/prices');
        if (!response.ok) throw new Error('price request failed');

        const prices = await response.json();
        for (const plan of ['monthly', 'yearly']) {
            const price = prices[plan];
            const amountEl = document.querySelector(`[data-price-amount="${plan}"]`);
            if (amountEl) {
                const period = price.interval === 'year' ? '年' : '月';
                amountEl.innerHTML = `${formatStripePrice(price)}<small>/${period}</small>`;
            }
        }

        const yearly = prices.yearly;
        const monthlyEquivalent = yearly.unitAmount / (12 * (yearly.intervalCount || 1));
        const perMonthEl = document.querySelector('[data-price-per-month="yearly"]');
        if (perMonthEl) {
            perMonthEl.textContent = `月あたり ${formatStripePrice({ ...yearly, unitAmount: Math.round(monthlyEquivalent) })}`;
        }

        if (modalCtaBtn) modalCtaBtn.disabled = false;
    }

    if (modalCtaBtn) modalCtaBtn.disabled = true;
    loadStripePrices().catch((error) => {
        console.error('Stripe price display error:', error);
        const comingSoon = document.getElementById('modal-coming-soon');
        if (comingSoon) comingSoon.textContent = '料金情報を取得できないため、決済を開始できません。';
    });

    if (modalClose) modalClose.addEventListener('click', closePremiumModal);
    if (premiumModalOverlay) premiumModalOverlay.addEventListener('click', (e) => { if (e.target === premiumModalOverlay) closePremiumModal(); });
    if (premiumTeaserBtn) premiumTeaserBtn.addEventListener('click', openPremiumModal);
    if (limitPremiumBtn) limitPremiumBtn.addEventListener('click', () => { fm.hideLimitOverlay(); openPremiumModal(); });

    /* ========== 広告視聴ボタン ========== */
    // プラン選択
    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach(card => {
        card.addEventListener('click', () => {
            priceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            card.classList.remove('plan-picked');
            void card.offsetWidth;
            card.classList.add('plan-picked');
            selectedPlan = card.dataset.plan;
        });
    });

    // Stripe Checkout呼び出し
    async function startCheckout(plan) {
        if (!authManager.token) {
            pendingCheckoutPlan = plan;
            closePremiumModal();
            authManager.openModal('register');
            return;
        }

        modalCtaBtn.disabled = true;
        modalCtaBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;display:inline-block;border-width:2px;margin-right:8px;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></span> 準備中...';

        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ planId: plan })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
            alert('決済画面への移動に失敗しました。');
        } finally {
            modalCtaBtn.disabled = false;
            modalCtaBtn.innerHTML = '✦ プレミアムプランを購入する ✦';
        }
    }

    if (modalCtaBtn) {
        modalCtaBtn.addEventListener('click', () => startCheckout(selectedPlan));
    }

    // 決済成功時の処理
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        setTimeout(() => {
            screenFlash();
            alert('✦ プレミアムプランへのアップグレードが完了しました ✦\n天使の完全な導きをお楽しみください。');
            // URLからクエリパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
            if (particleSystem) particleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
        }, 1000);
    }

    /* ========== シェアボタン ========== */
    document.getElementById('share-x')?.addEventListener('click', () => shareManager.shareToX());
    document.getElementById('share-fb')?.addEventListener('click', () => shareManager.shareToFB());
    document.getElementById('share-threads')?.addEventListener('click', () => shareManager.shareToThreads());
    document.getElementById('share-line')?.addEventListener('click', () => shareManager.shareToLINE());
    document.getElementById('share-copy')?.addEventListener('click', () => shareManager.copyLink());

    if (limitShareBtn) {
        limitShareBtn.addEventListener('click', () => {
            shareManager.shareToX();
        });
    }

    /* ========== カード詳細表示 ========== */
    const cardDetailOverlay = document.getElementById('card-detail-overlay');
    const cardDetailClose = document.getElementById('card-detail-close');
    const detailImg = document.getElementById('detail-card-img');
    const detailName = document.getElementById('detail-card-name');
    const detailPos = document.getElementById('detail-card-position');
    const detailDesc = document.getElementById('detail-card-desc');

    function showCardDetail(card, idx) {
        if (!cardDetailOverlay) return;
        
        detailImg.src = card.img;
        detailName.textContent = card.ja + (card.isReversed ? ' (逆位置)' : ' (正位置)');
        detailPos.textContent = card.spreadPositionName ? `役割: ${card.spreadPositionName}` : '';
        
        // カードごとの簡易解説（キーワード）
        const keywords = {
            "0": "自由、純粋、新たな旅立ち", "I": "創造、才能、可能性", "II": "直感、神秘、知恵",
            "III": "豊穣、母性、愛", "IV": "権威、安定、責任", "V": "伝統、教え、導き",
            "VI": "選択、調和、絆", "VII": "前進、勝利、意志", "VIII": "勇気、忍耐、内なる力",
            "IX": "内省、探求、真理", "X": "転換点、幸運、宿命", "XI": "公正、均衡、決断",
            "XII": "視点の変化、献身、停止", "XIII": "終焉、再生、変化", "XIV": "節度、調和、癒やし",
            "XV": "束縛、誘惑、執着", "XVI": "崩壊、衝撃、解放", "XVII": "希望、インスピレーション",
            "XVIII": "不安、直感、無意識", "XIX": "成功、活力、祝福", "XX": "復活、覚醒、決断", "XXI": "完成、統合、達成"
        };
        
        const cardMeaning = keywords[card.num] || "天使があなたに特別な気づきを与えています。";
        detailDesc.textContent = cardMeaning + (card.isReversed ? " 逆位置は「過剰」や「不足」への警告かもしれません。自分を見つめ直すチャンスです。" : " あなたの進む道を光が照らしています。");
        
        cardDetailOverlay.classList.remove('hidden');
    }

    if (cardDetailClose) {
        cardDetailClose.addEventListener('click', () => cardDetailOverlay.classList.add('hidden'));
    }
    if (cardDetailOverlay) {
        cardDetailOverlay.addEventListener('click', (e) => {
            if (e.target === cardDetailOverlay) cardDetailOverlay.classList.add('hidden');
        });
    }

    /* ========== お気に入り保存 ========== */
    const saveReadingBtn = document.getElementById('save-reading-btn');
    if (saveReadingBtn) {
        saveReadingBtn.addEventListener('click', async () => {
            if (!authManager.token) {
                authManager.openModal();
                return;
            }
            if (!currentReadingId) {
                alert('保存対象の鑑定結果が見つかりません。もう一度占ってからお試しください。');
                return;
            }
            
            saveReadingBtn.disabled = true;
            saveReadingBtn.innerHTML = '保存中...';
            
            try {
                const res = await fetch('/api/history/favorite', {
                    method: 'POST',
                    headers: authManager.getAuthHeaders(),
                    body: JSON.stringify({ id: currentReadingId, isFavorite: true })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || '保存に失敗しました。');

                saveReadingBtn.innerHTML = '<span class="star-icon">★</span> 保存しました';
                saveReadingBtn.classList.add('active');
                playSound('se-success');
            } catch (error) {
                alert(error.message || '保存に失敗しました。');
                saveReadingBtn.disabled = false;
                saveReadingBtn.innerHTML = '<span class="star-icon">☆</span> お気に入り';
            }
        });
    }

    /* ========== 今日の守護天使メッセージ ========== */
    const dailyOverlay = document.getElementById('daily-message-overlay');
    const dailyCloseBtn = document.getElementById('daily-message-close');
    const dailyName = document.getElementById('daily-angel-name');
    const dailyText = document.getElementById('daily-text');
    const dailyDateEl = document.getElementById('daily-date');

    function showDailyMessage() {
        if (!dailyOverlay) return;

        // サブスク限定チェック
        if (!fm.usage || !fm.usage.isPremium) return;

        // 1日1回チェック
        const lastShown = localStorage.getItem('daily_angel_date');
        const todayStr = new Date().toLocaleDateString();
        if (lastShown === todayStr) return;

        const angels = [
            { id: "michael", name: "Archangel Michael", msg: "勇気を持って一歩踏み出しましょう。私があなたの背中を押しています。何も恐れる必要はありません。" },
            { id: "gabriel", name: "Archangel Gabriel", msg: "あなたの内なる真実を表現してください。クリエイティブな活動が、あなたの魂を輝かせる鍵となります。" },
            { id: "raphael", name: "Archangel Raphael", msg: "心身を癒やす時間を持ってください。自分自身を慈しむことで、新たなエネルギーが満ちてきます。" },
            { id: "uriel", name: "Archangel Uriel", msg: "あなたの知恵とインスピレーションを信じてください。解決の糸口は、すでにあなたの中にあります。" }
        ];

        const selected = angels[Math.floor(Math.random() * angels.length)];
        
        dailyName.textContent = selected.name;
        dailyText.textContent = selected.msg;
        dailyDateEl.textContent = todayStr;

        const dailyImgEl = document.getElementById('daily-angel-img');
        if (dailyImgEl) {
            dailyImgEl.src = `assets/archangel_${selected.id}.png`;
        }
        
        setTimeout(() => {
            dailyOverlay.classList.remove('hidden');
            playSound('se-success'); // 聖なる音
        }, 1500);

        localStorage.setItem('daily_angel_date', todayStr);
    }

    if (dailyCloseBtn) {
        dailyCloseBtn.addEventListener('click', () => {
            dailyOverlay.classList.add('hidden');
        });
    }

    /* ========== 鑑定書PDF保存 ========== */
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const dateStr = new Date().toLocaleDateString('ja-JP') + ' ' + new Date().toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'});
            
            const cardNameStr = chosenCards.length > 0 
                ? chosenCards.map(c => {
                    const posText = c.position === '逆位置' ? ' (逆位置)' : '';
                    return c.ja + posText;
                  }).join(' / ')
                : 'カードが選択されていません';

            let posStr = '鑑定結果';
            if (selectedSpread === 'hexagram') posStr = 'ヘキサグラム (相性)';
            else if (selectedSpread > 1) posStr = selectedSpread + '枚引き';
            else posStr = '1枚引き';

            const item = {
                timestamp: new Date().toISOString(),
                position: posStr,
                cardName: cardNameStr,
                reading: document.getElementById('result-text').innerHTML,
                cards: chosenCards
            };
            
            authManager.exportPDF(item, dateStr);
        });
    }

    // 起動時にチェック (権限取得後に実行)
    fm.fetchUsage().then(() => {
        showDailyMessage();
    });
});
