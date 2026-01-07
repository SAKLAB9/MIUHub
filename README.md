# MIUHub - Legal Pages

MIUHub의 개인정보 처리방침과 이용약관을 제공하는 웹 서버입니다.

## Railway 배포 방법

### 방법 1: GitHub 연동 (권장)

1. 이 폴더를 Git 저장소로 초기화:
```bash
cd /Users/kimsungah/Desktop/MIUHub
git init
git add .
git commit -m "Initial commit"
```

2. GitHub에 새 저장소를 만들고 푸시:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. Railway 대시보드에서:
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 저장소 선택
   - 자동으로 배포됩니다!

### 방법 2: Railway CLI 사용

```bash
cd /Users/kimsungah/Desktop/MIUHub
npm install -g @railway/cli
railway login
railway init
railway up
```

### 방법 3: 직접 업로드

1. Railway 대시보드에서 "New Project" → "Empty Project"
2. "Deploy" 탭에서 이 폴더를 압축해서 업로드

## 로컬 실행

```bash
npm install
npm start
```

서버는 포트 3000에서 실행됩니다.

## 엔드포인트

- `/` 또는 `/privacy-policy.html` - 개인정보 처리방침
- `/terms-of-service.html` - 이용약관




