import './App.css';

const RELEASE_URL = 'https://github.com/BBIYAKYEE7/KUPID/releases/latest';

async function fetchLatestWindowsAssetUrl() {
  try {
    const res = await fetch('https://api.github.com/repos/BBIYAKYEE7/KUPID/releases/latest', { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('Failed to fetch releases');
    const data = await res.json();
    const asset = (data.assets || []).find(a => /setup|\.exe$/i.test(a.name));
    return asset ? asset.browser_download_url : RELEASE_URL;
  } catch (e) {
    return RELEASE_URL;
  }
}

function detectOS() {
  const ua = navigator.userAgent;
  if (/Windows NT/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'mac';
  if (/Linux/i.test(ua)) return 'linux';
  return 'unknown';
}

function App() {
  const os = detectOS();
  const primaryText = os === 'mac' ? 'macOS용 다운로드' : os === 'windows' ? 'Windows용 다운로드' : os === 'linux' ? 'Linux용 다운로드' : '최신 버전 보기';
  async function handleWindowsClick(e) {
    e.preventDefault();
    const url = await fetchLatestWindowsAssetUrl();
    window.location.href = url;
  }
  async function handlePrimaryClick(e) {
    e.preventDefault();
    if (os === 'windows') {
      const url = await fetchLatestWindowsAssetUrl();
      window.location.href = url;
    } else {
      alert('준비중입니다. Windows 버전은 바로 설치 가능합니다.');
    }
  }

  return (
    <div>
      <header className="header" role="banner">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="KUPID 홈">
            <img className="brand-logo-wide" src="/images/kulogo(r).png" alt="고려대로고" width="125" height="36"/>
          </a>
          <nav className="nav" aria-label="주요">
            <a href="#features">기능</a>
            <a href="#download">다운로드</a>
            <a href="#faq">FAQ</a>
            <a href="https://github.com/BBIYAKYEE7/KUPID" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </div>
      </header>

      <main id="top" className="main" role="main">
        <section className="container hero" aria-labelledby="hero-title">
          <div>
            <h1 id="hero-title">고려대학교 포털 KUPID</h1>
            <p className="subtitle">빠르고 간편한 자동 로그인과 세션 관리</p>
            <div className="cta">
              <a className="btn btn-primary" href="#" onClick={handlePrimaryClick} aria-describedby="primary-desc">{primaryText}</a>
              <p id="primary-desc" className="vh">접속한 운영체제를 자동으로 감지하여 올바른 설치 파일을 안내합니다.</p>
              <a className="btn btn-ghost" href="#features">자세히 보기</a>
            </div>
          </div>
          <div>
            <img className="hero-image hero-image--wide" src="/images/emblem4.png" alt="고려대학교 엠블럼" />
          </div>
        </section>

        <section id="features" className="section container" aria-labelledby="feature-title">
          <h2 id="feature-title">주요 기능</h2>
          <ul className="features">
            <li>
              <h3>자동 로그인</h3>
              <p>포털 계정을 기억하고 보안 기준에 맞춰 로그인 과정을 자동화합니다.</p>
            </li>
            <li>
              <h3>세션 관리</h3>
              <p>세션 만료 전 알림과 자동 갱신으로 안정적인 사용성을 제공합니다.</p>
            </li>
            <li>
              <h3>자동 업데이트</h3>
              <p>GitHub Releases를 통해 최신 버전을 손쉽게 유지합니다.</p>
            </li>
            <li>
              <h3>크로스 플랫폼</h3>
              <p>macOS, Windows, Linux에서 동일한 경험을 제공할 예정입니다. 현재는 Windows 버전만 제공됩니다.</p>
            </li>
          </ul>
        </section>

        <section id="download" className="section section-alt" aria-labelledby="download-title">
          <div className="container">
            <h2 id="download-title">다운로드</h2>
            <p className="muted">아래에서 운영체제에 맞는 설치 파일을 선택하세요.</p>
            <div className="download">
              <a className="card disabled" href="#" aria-label="macOS 준비중">
                <div className="card-body">
                  <span className="os">macOS</span>
                  <span className="hint">준비중</span>
                </div>
              </a>
              <a className="card" href="#" onClick={handleWindowsClick} aria-label="Windows용 다운로드">
                <div className="card-body">
                  <span className="os">Windows</span>
                  <span className="hint">Setup .exe / Portable</span>
                </div>
              </a>
              <a className="card disabled" href="#" aria-label="Linux 준비중">
                <div className="card-body">
                  <span className="os">Linux</span>
                  <span className="hint">준비중</span>
                </div>
              </a>
            </div>
            <p className="tiny">최신 릴리즈는 GitHub에서 제공됩니다. 다운로드가 시작되지 않으면 릴리즈 페이지에서 수동으로 선택하세요.</p>
          </div>
        </section>

        <section id="faq" className="section container" aria-labelledby="faq-title">
          <h2 id="faq-title">자주 묻는 질문</h2>
          <details>
            <summary>실행 시 보안 경고가 나와요.</summary>
            <p>운영체제 보안 정책에 따라 확인 창이 나타날 수 있습니다. 개발자 서명과 출처를 확인한 뒤 진행하세요.</p>
          </details>
          <details>
            <summary>자동 업데이트는 어떻게 작동하나요?</summary>
            <p>앱은 주기적으로 GitHub Releases를 확인하여 새 버전을 안내합니다. 설정에서 자동/수동을 선택할 수 있습니다.</p>
          </details>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-inner">
            <img className="footer-badge" src="/images/kuni120-2.png" alt="고려대학교 아이콘" width="24" height="24" />
            <h3 className="footer-brand">BBIYAKYEE7</h3>
            <p className="footer-sub">2025 © Copyright by BBIYAKYEE7, All rights reserved.</p>
            <p className="footer-sub">Made and serviced with React.js</p>
            <div className="footer-ctas">
              <a className="btn-footer" href="mailto:bbiyakyee7@gmail.com" aria-label="Email">✉️ 이메일</a>
              <a className="btn-footer" href="https://github.com/BBIYAKYEE7" target="_blank" rel="noopener noreferrer" aria-label="GitHub">🐙 GitHub</a>
              <a className="btn-footer" href="https://instagram.com/bbiyakyee7" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷 Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
