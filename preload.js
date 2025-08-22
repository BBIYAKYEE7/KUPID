const { contextBridge, ipcRenderer } = require('electron');

<<<<<<< HEAD
// Pretendard 폰트 CSS 주입 함수 (개선된 버전)
function injectPretendardFont() {
  try {
    console.log('Pretendard 폰트 주입 시작...');
    
    // 기존 스타일 제거
    const existingStyles = document.querySelectorAll('#pretendard-font-injection, #pretendard-force-style');
    existingStyles.forEach(style => style.remove());
    
    // 1. 기본 폰트 CSS (시스템 폰트 우선 사용)
    const style = document.createElement('style');
    style.id = 'pretendard-font-injection';
    style.textContent = `
      /* 시스템에 설치된 Pretendard 폰트 사용 */
      @font-face {
        font-family: 'Pretendard';
        src: local('Pretendard'), local('Pretendard-Regular'), local('Pretendard Regular');
=======
// Pretendard 폰트 CSS 주입 함수
function injectPretendardFont() {
  try {
    // 이미 주입된 스타일이 있는지 확인
    const existingStyle = document.getElementById('pretendard-font-injection');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Pretendard 폰트 CSS 생성
    const style = document.createElement('style');
    style.id = 'pretendard-font-injection';
    style.textContent = `
      @font-face {
        font-family: 'Pretendard';
        src: url('file://${__dirname}/fonts/Pretendard-Regular.woff2') format('woff2');
>>>>>>> 8e93c851d65919acebde4a7b2bff5c0f63871997
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
<<<<<<< HEAD
        src: local('Pretendard-Bold'), local('Pretendard Bold'), local('PretendardBold');
=======
        src: url('file://${__dirname}/fonts/Pretendard-Bold.woff2') format('woff2');
>>>>>>> 8e93c851d65919acebde4a7b2bff5c0f63871997
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
<<<<<<< HEAD
    `;
    document.head.appendChild(style);
    
    // 2. 강제 적용 스타일 (최고 우선순위)
    const forceStyle = document.createElement('style');
    forceStyle.id = 'pretendard-force-style';
    forceStyle.textContent = `
      /* 최고 우선순위로 모든 요소에 폰트 적용 */
      html, html * {
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
      
      /* 바탕체 관련 클래스 강제 제거 */
      .batang, .batang *, [class*="batang"], [class*="Batang"], .gulim, .gulim *, [class*="gulim"], [class*="Gulim"] {
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
      
      /* 인라인 스타일 무시 */
      [style*="font-family"], [style*="fontFamily"] {
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
      
      /* CSS 변수 재정의 */
      :root {
        --font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(forceStyle);
    
    // 3. 모든 기존 요소에 직접 스타일 적용
    function applyFontToAllElements() {
      try {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
          if (element.style) {
            element.style.setProperty('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 'important');
          }
        });
      } catch (error) {
        console.error('요소별 폰트 적용 오류:', error);
      }
    }
    
    // 즉시 적용
    applyFontToAllElements();
    
    // 4. MutationObserver로 동적 요소 처리
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldReapply = true;
        }
      });
      
      if (shouldReapply) {
        setTimeout(applyFontToAllElements, 100);
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
    
    // 5. 주기적으로 재적용 (더 안정적인 방법)
    const intervalId = setInterval(() => {
      applyFontToAllElements();
    }, 2000);
    
    // 10초 후 인터벌 중단
    setTimeout(() => {
      clearInterval(intervalId);
      console.log('Pretendard 폰트 주기적 적용 완료');
    }, 10000);
=======
      
      /* 모든 요소에 Pretendard 폰트 적용 */
      * {
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
      
      /* 특정 요소들에 대한 추가 적용 */
      body, html, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, select, label, li, td, th {
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
      
      /* 클래스별 적용 */
      .title, .header, .content, .text, .label, .button, .input, .form {
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // 모든 기존 요소에 직접 스타일 적용
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      element.style.setProperty('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 'important');
    });
    
    // 동적으로 추가되는 요소들을 위한 MutationObserver 설정
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.tagName) {
                node.style.setProperty('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 'important');
              }
              const childElements = node.querySelectorAll ? node.querySelectorAll('*') : [];
              childElements.forEach(element => {
                element.style.setProperty('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 'important');
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
>>>>>>> 8e93c851d65919acebde4a7b2bff5c0f63871997
    
    console.log('Pretendard 폰트가 모든 페이지에 주입되었습니다.');
  } catch (error) {
    console.error('Pretendard 폰트 주입 중 오류:', error);
  }
}

// 렌더러 프로세스에서 사용할 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 세션 타이머 재설정
  resetSessionTimer: () => ipcRenderer.invoke('reset-session-timer'),
  
  // 세션 정보 가져오기
  getSessionInfo: () => ipcRenderer.invoke('get-session-info'),
  
  // 자동 로그인 관련 API
  getLoginConfig: () => ipcRenderer.invoke('get-login-config'),
  saveLoginConfig: (config) => ipcRenderer.invoke('save-login-config', config),
  clearLoginConfig: () => ipcRenderer.invoke('clear-login-config'),
  performAutoLogin: (credentials) => ipcRenderer.invoke('perform-auto-login', credentials),
  triggerAutoLogin: () => ipcRenderer.invoke('trigger-auto-login'),
  startPortal: () => ipcRenderer.invoke('start-portal'),
<<<<<<< HEAD
  openLoginSetup: () => ipcRenderer.invoke('open-login-setup'),
=======
>>>>>>> 8e93c851d65919acebde4a7b2bff5c0f63871997
  
  // Pretendard 폰트 주입
  injectPretendardFont: () => injectPretendardFont(),
  
  // 업데이트 관련 API
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // 사용자 활동 감지
  onUserActivity: (callback) => {
<<<<<<< HEAD
    try {
      // 마우스 클릭, 키보드 입력, 스크롤 등의 사용자 활동 감지
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        document.addEventListener(event, () => {
          if (callback && typeof callback === 'function') {
            callback();
          }
        }, { passive: true });
      });
    } catch (error) {
      console.error('사용자 활동 감지 설정 오류:', error);
    }
=======
    // 마우스 클릭, 키보드 입력, 스크롤 등의 사용자 활동 감지
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        callback();
      }, { passive: true });
    });
>>>>>>> 8e93c851d65919acebde4a7b2bff5c0f63871997
  }
});

// 페이지 로드 시 세션 타이머 재설정 및 폰트 주입
window.addEventListener('load', () => {
  ipcRenderer.invoke('reset-session-timer');
  injectPretendardFont();
});

// DOMContentLoaded 시에도 폰트 주입
document.addEventListener('DOMContentLoaded', () => {
  injectPretendardFont();
});

// 사용자 활동 시 세션 타이머 재설정
<<<<<<< HEAD
if (window.electronAPI && window.electronAPI.onUserActivity) {
  window.electronAPI.onUserActivity(() => {
    ipcRenderer.invoke('reset-session-timer');
  });
}
=======
window.electronAPI.onUserActivity(() => {
  ipcRenderer.invoke('reset-session-timer');
});
>>>>>>> 8e93c851d65919acebde4a7b2bff5c0f63871997
