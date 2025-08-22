const { contextBridge, ipcRenderer } = require('electron');


        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';

        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }

    
    console.log('Pretendard ?�트가 모든 ?�이지??주입?�었?�니??');
  } catch (error) {
    console.error('Pretendard ?�트 주입 �??�류:', error);
  }
}

// ?�더???�로?�스?�서 ?�용??API ?�출
contextBridge.exposeInMainWorld('electronAPI', {
  // ?�션 ?�?�머 ?�설??
  resetSessionTimer: () => ipcRenderer.invoke('reset-session-timer'),
  
  // ?�션 ?�보 가?�오�?
  getSessionInfo: () => ipcRenderer.invoke('get-session-info'),
  
  // ?�동 로그??관??API
  getLoginConfig: () => ipcRenderer.invoke('get-login-config'),
  saveLoginConfig: (config) => ipcRenderer.invoke('save-login-config', config),
  clearLoginConfig: () => ipcRenderer.invoke('clear-login-config'),
  performAutoLogin: (credentials) => ipcRenderer.invoke('perform-auto-login', credentials),
  triggerAutoLogin: () => ipcRenderer.invoke('trigger-auto-login'),
  startPortal: () => ipcRenderer.invoke('start-portal'),

  
  // Pretendard ?�트 주입
  injectPretendardFont: () => injectPretendardFont(),
  
  // ?�데?�트 관??API
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // ?�용???�동 감�?
  onUserActivity: (callback) => {

  }
});

// ?�이지 로드 ???�션 ?�?�머 ?�설??�??�트 주입
window.addEventListener('load', () => {
  ipcRenderer.invoke('reset-session-timer');
  injectPretendardFont();
});

// DOMContentLoaded ?�에???�트 주입
document.addEventListener('DOMContentLoaded', () => {
  injectPretendardFont();
});

// ?�용???�동 ???�션 ?�?�머 ?�설??


