const { contextBridge, ipcRenderer } = require('electron');

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
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src: url('file://${__dirname}/fonts/Pretendard-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      
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
  
  // Pretendard 폰트 주입
  injectPretendardFont: () => injectPretendardFont(),
  
  // 업데이트 관련 API
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // 사용자 활동 감지
  onUserActivity: (callback) => {
    // 마우스 클릭, 키보드 입력, 스크롤 등의 사용자 활동 감지
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        callback();
      }, { passive: true });
    });
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
window.electronAPI.onUserActivity(() => {
  ipcRenderer.invoke('reset-session-timer');
});
