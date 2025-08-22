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

    
    console.log('Pretendard ?°íŠ¸ê°€ ëª¨ë“  ?˜ì´ì§€??ì£¼ì…?˜ì—ˆ?µë‹ˆ??');
  } catch (error) {
    console.error('Pretendard ?°íŠ¸ ì£¼ì… ì¤??¤ë¥˜:', error);
  }
}

// ?Œë”???„ë¡œ?¸ìŠ¤?ì„œ ?¬ìš©??API ?¸ì¶œ
contextBridge.exposeInMainWorld('electronAPI', {
  // ?¸ì…˜ ?€?´ë¨¸ ?¬ì„¤??
  resetSessionTimer: () => ipcRenderer.invoke('reset-session-timer'),
  
  // ?¸ì…˜ ?•ë³´ ê°€?¸ì˜¤ê¸?
  getSessionInfo: () => ipcRenderer.invoke('get-session-info'),
  
  // ?ë™ ë¡œê·¸??ê´€??API
  getLoginConfig: () => ipcRenderer.invoke('get-login-config'),
  saveLoginConfig: (config) => ipcRenderer.invoke('save-login-config', config),
  clearLoginConfig: () => ipcRenderer.invoke('clear-login-config'),
  performAutoLogin: (credentials) => ipcRenderer.invoke('perform-auto-login', credentials),
  triggerAutoLogin: () => ipcRenderer.invoke('trigger-auto-login'),
  startPortal: () => ipcRenderer.invoke('start-portal'),

  
  // Pretendard ?°íŠ¸ ì£¼ì…
  injectPretendardFont: () => injectPretendardFont(),
  
  // ?…ë°?´íŠ¸ ê´€??API
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // ?¬ìš©???œë™ ê°ì?
  onUserActivity: (callback) => {

  }
});

// ?˜ì´ì§€ ë¡œë“œ ???¸ì…˜ ?€?´ë¨¸ ?¬ì„¤??ë°??°íŠ¸ ì£¼ì…
window.addEventListener('load', () => {
  ipcRenderer.invoke('reset-session-timer');
  injectPretendardFont();
});

// DOMContentLoaded ?œì—???°íŠ¸ ì£¼ì…
document.addEventListener('DOMContentLoaded', () => {
  injectPretendardFont();
});

// ?¬ìš©???œë™ ???¸ì…˜ ?€?´ë¨¸ ?¬ì„¤??


