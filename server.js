const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(__dirname));

// Supabase 설정
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qgtwkhkmdsaypnsnrpbf.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service Role Key 필요

let supabaseAdmin = null;
if (SUPABASE_SERVICE_KEY) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// privacy-policy.html
app.get('/privacy-policy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// privacy-policy (확장자 없이)
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// terms-of-service.html
app.get('/terms-of-service.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms-of-service.html'));
});

// terms-of-service (확장자 없이)
app.get('/terms-of-service', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms-of-service.html'));
});

// reset-password.html
app.get('/reset-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reset-password.html'));
});

// reset-password (확장자 없이)
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'reset-password.html'));
});

// 비밀번호 재설정 API (Supabase Admin API 사용)
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ error: '이메일과 새 비밀번호를 입력해주세요.' });
        }
        
        // 새 비밀번호 정책 검증
        if (newPassword.length < 8) {
            return res.status(400).json({ error: '비밀번호는 최소 8자 이상이어야 합니다.' });
        }
        
        if (!/(?=.*[A-Z])/.test(newPassword)) {
            return res.status(400).json({ error: '비밀번호는 대문자를 포함해야 합니다.' });
        }
        
        if (!/(?=.*[a-z])/.test(newPassword)) {
            return res.status(400).json({ error: '비밀번호는 소문자를 포함해야 합니다.' });
        }
        
        if (!/(?=.*[0-9])/.test(newPassword)) {
            return res.status(400).json({ error: '비밀번호는 숫자를 포함해야 합니다.' });
        }
        
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword)) {
            return res.status(400).json({ error: '비밀번호는 특수문자를 포함해야 합니다.' });
        }
        
        if (!supabaseAdmin) {
            return res.status(500).json({ error: 'Supabase가 설정되지 않았습니다. SUPABASE_SERVICE_KEY 환경 변수를 확인해주세요.' });
        }
        
        // 이메일로 사용자 찾기
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
            console.error('사용자 목록 조회 실패:', listError);
            return res.status(500).json({ error: '사용자를 찾는 중 오류가 발생했습니다.' });
        }
        
        const user = users.users.find(u => u.email === email);
        
        if (!user) {
            return res.status(404).json({ error: '해당 이메일의 사용자를 찾을 수 없습니다.' });
        }
        
        // Supabase Admin API로 비밀번호 업데이트
        const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );
        
        if (updateError) {
            console.error('비밀번호 업데이트 실패:', updateError);
            return res.status(500).json({ error: '비밀번호 변경에 실패했습니다.' });
        }
        
        res.json({
            success: true,
            message: '비밀번호가 변경되었습니다.'
        });
        
    } catch (error) {
        console.error('비밀번호 재설정 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// 루트 경로는 privacy-policy로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});




