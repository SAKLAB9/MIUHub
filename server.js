const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static(__dirname));

// privacy-policy.html
app.get('/privacy-policy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// terms-of-service.html
app.get('/terms-of-service.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms-of-service.html'));
});

// 루트 경로는 privacy-policy로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

