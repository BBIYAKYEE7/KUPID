# KUPID - Korea University Portal to Information Depository

고려대학교 포털 자동 로그인 및 세션 관리 Electron 애플리케이션

## 주요 기능

- 🔐 **자동 로그인**: 고려대학교 포털 자동 로그인
- ⏰ **세션 관리**: 자동 세션 타임아웃 및 경고
- 🎨 **Pretendard 폰트**: 모든 페이지에 고려대학교 브랜드 폰트 적용
- 🔄 **자동 업데이트**: GitHub Releases를 통한 자동 업데이트
- 🖥️ **크로스 플랫폼**: macOS, Windows, Linux 지원

## 설치 및 실행

### 개발 환경
```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm start
```

### 배포용 빌드
```bash
# macOS용 빌드
npm run build

# Windows용 빌드
npm run build:win

# Linux용 빌드
npm run build:linux
```

## 자동 업데이트 설정

### 1. GitHub Personal Access Token 생성
1. GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 필요한 권한 선택:
   - `repo` (전체 저장소 접근)
   - `workflow` (GitHub Actions 실행)
4. 토큰 생성 후 복사

### 2. 환경 변수 설정
```bash
# .env 파일 생성 (프로젝트 루트에)
echo "GH_TOKEN=your_github_personal_access_token_here" > .env
```

### 3. GitHub Releases 설정
1. GitHub 저장소에서 "Releases" 탭으로 이동
2. "Create a new release" 클릭
3. 태그 버전 입력 (예: v1.0.0)
4. 릴리즈 노트 작성
5. "Publish release" 클릭

### 4. 자동 업데이트 빌드
```bash
# GitHub에 자동 업데이트 파일 업로드
npm run publish
```

## 프로젝트 구조

```
KUPID/
├── main.js              # Electron 메인 프로세스
├── renderer.js          # 렌더러 프로세스
├── preload.js           # 프리로드 스크립트
├── config.js            # 설정 관리
├── index.html           # 메인 UI
├── styles.css           # 스타일시트
├── fonts/               # Pretendard 폰트
├── images/              # 로고 및 이미지
└── dist/                # 빌드 출력
```

## 기술 스택

- **Electron**: 크로스 플랫폼 데스크톱 앱
- **electron-updater**: 자동 업데이트
- **node-notifier**: 데스크톱 알림
- **Pretendard**: 고려대학교 브랜드 폰트

## 라이선스

MIT License

## 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 지원

문제가 발생하거나 기능 요청이 있으시면 GitHub Issues를 통해 알려주세요.
