# Seoul Tetris - Vercel 배포 가이드

## 🚀 Vercel로 배포하기

### 방법 1: Vercel CLI 사용 (추천)

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   ```

2. **Vercel 로그인**
   ```bash
   vercel login
   ```

3. **프로젝트 배포**
   ```bash
   vercel
   ```
   - 첫 배포 시 몇 가지 질문에 답하세요
   - 기본 설정을 사용하면 됩니다

4. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

### 방법 2: Vercel Dashboard 사용

1. **GitHub 연동**
   - 프로젝트를 GitHub 저장소에 푸시
   - [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
   - "New Project" 클릭

2. **저장소 연결**
   - GitHub 저장소 선택
   - Import 클릭

3. **프로젝트 설정**
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (자동)
   - Output Directory: `.next` (자동)

4. **배포**
   - "Deploy" 버튼 클릭
   - 몇 분 후 배포 완료!

## 📋 배포 전 체크리스트

✅ 모든 파일이 커밋되었는지 확인
```bash
git status
```

✅ package.json의 dependencies 확인
```bash
npm install
```

✅ 로컬에서 프로덕션 빌드 테스트 (선택사항)
```bash
npm run build
npm run start
```

## 🌐 배포 후

배포가 완료되면 Vercel이 다음을 제공합니다:
- **프로덕션 URL**: `https://your-project.vercel.app`
- **프리뷰 URL**: 각 커밋마다 자동 생성
- **자동 SSL**: HTTPS 자동 적용
- **CDN**: 전 세계 엣지 네트워크에 배포

## 🔧 환경 변수 설정 (필요시)

Vercel Dashboard에서:
1. 프로젝트 선택
2. Settings → Environment Variables
3. 필요한 환경 변수 추가

## 📱 도메인 연결 (선택사항)

1. Vercel Dashboard → 프로젝트 → Settings → Domains
2. 커스텀 도메인 입력
3. DNS 설정 안내에 따라 진행

## 🔄 자동 배포

GitHub와 연동한 경우:
- `main` 브랜치에 푸시하면 자동으로 프로덕션 배포
- 다른 브랜치는 프리뷰 배포로 생성
- Pull Request마다 프리뷰 URL 자동 생성

## 🐛 문제 해결

### 빌드 실패 시
- Vercel Dashboard의 Deployment Logs 확인
- 로컬에서 `npm run build` 실행해보기
- `node_modules` 삭제 후 `npm install` 재실행

### 경로 문제
- 로컬 빌드에서 한글 경로 문제가 발생할 수 있습니다
- Vercel 서버에서는 이 문제가 없으니 걱정하지 마세요

## 📊 성능 최적화

Vercel은 자동으로 다음을 제공합니다:
- ✅ 이미지 최적화
- ✅ 자동 코드 스플리팅
- ✅ 서버사이드 렌더링 (SSR)
- ✅ 정적 사이트 생성 (SSG)
- ✅ Edge Functions

## 🎮 게임 최적화 팁

1. **Canvas 렌더링**: 브라우저 최적화를 위해 requestAnimationFrame 사용
2. **로컬 스토리지**: 리더보드 데이터는 브라우저에 저장됨
3. **반응형**: 모바일/데스크톱 자동 대응

---

배포 완료 후 URL을 공유하고 친구들과 경쟁해보세요! 🏆
