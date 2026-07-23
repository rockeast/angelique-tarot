import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Environment variables are missing.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createAdminAccount() {
    const email = 'admin@angelique-tarot.com';
    const password = 'AdminPassword2026!';
    const nickname = '運営管理者';

    console.log(`Creating admin account for ${email}...`);

    // 1. ユーザー作成 (Admin API)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true // 自動的にメール認証済みにする
    });

    if (authError) {
        console.error('Error creating user:', authError.message);
        // すでに存在する場合など
        if (!authError.message.includes('already exists')) {
            process.exit(1);
        }
    }

    const userId = authData?.user?.id;

    if (userId) {
        // 2. profilesテーブルにプレミアム権限を付与して保存
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                nickname: nickname,
                is_premium: true // 管理者としてプレミアム権限を最初から付与
            });

        if (profileError) {
            console.error('Error updating profile:', profileError.message);
        } else {
            console.log('✅ Admin account successfully created and granted premium access!');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }
    } else {
        // すでに存在する場合、プレミアムフラグだけ立て直す処理
        console.log('User might already exist. Attempting to fetch user and update premium status...');
        // (省略: 今回は新規作成前提とする)
    }
}

createAdminAccount();
