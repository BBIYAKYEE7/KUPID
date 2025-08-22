// ?¸ì…˜ ?€?´ë¨¸ ê´€ë¦?
class SessionTimer {
    constructor() {
        this.sessionTimeout = 60 * 60 * 1000; // 60ë¶„ìœ¼ë¡??°ìž¥
        this.warningTime = 10 * 60 * 1000; // 10ë¶???ê²½ê³ ë¡??°ìž¥
        this.startTime = Date.now();
        this.timer = null;
        this.countdownTimer = null;
        
        this.init();
    }
    
    init() {
        this.updateTimer();
        this.startTimer();
        this.bindEvents();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        const elapsed = Date.now() - this.startTime;
        const remaining = this.sessionTimeout - elapsed;
        
        if (remaining <= 0) {
            this.showSessionExpired();
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // ?€?´ë¨¸ ?ìŠ¤???…ë°?´íŠ¸
        const timerElement = document.getElementById('session-timer');
        if (timerElement) {
            timerElement.textContent = `?¸ì…˜: ${timeString}`;
        }
        
        // ?„ë¡œê·¸ë ˆ??ë°??…ë°?´íŠ¸
        const progressElement = document.getElementById('session-progress-bar');
        if (progressElement) {
            const progress = (remaining / this.sessionTimeout) * 100;
            progressElement.style.width = `${progress}%`;
            
            // ê²½ê³  ?íƒœ???°ë¥¸ ?‰ìƒ ë³€ê²?
            progressElement.className = 'session-progress-fill';
            timerElement.className = 'session-timer';
            
            if (remaining <= this.warningTime) {
                progressElement.classList.add('warning');
                timerElement.classList.add('warning');
            }
            
            if (remaining <= 60000) { // 1ë¶??´í•˜
                progressElement.classList.add('danger');
                timerElement.classList.add('danger');
            }
        }
        
        // ê²½ê³  ëª¨ë‹¬ ?œì‹œ
        if (remaining <= this.warningTime && remaining > this.warningTime - 1000) {
            this.showWarningModal();
        }
    }
    
    showWarningModal() {
        const modal = document.getElementById('session-warning-modal');
        const countdownElement = document.getElementById('countdown');
        
        if (modal && !modal.classList.contains('visible')) {
            modal.classList.remove('hidden');
            modal.classList.add('visible');
            
            // ì¹´ìš´?¸ë‹¤???œìž‘
            let countdown = 600; // 10ë¶?
            this.countdownTimer = setInterval(() => {
                const minutes = Math.floor(countdown / 60);
                const seconds = countdown % 60;
                countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                if (countdown <= 0) {
                    this.hideWarningModal();
                    this.showSessionExpired();
                }
                countdown--;
            }, 1000);
        }
    }
    
    hideWarningModal() {
        const modal = document.getElementById('session-warning-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
        }
        
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }
    
    showSessionExpired() {
        this.stopTimer();
        
        // ?¸ì…˜ ë§Œë£Œ ?Œë¦¼
        if (window.electronAPI) {
            window.electronAPI.resetSessionTimer();
        }
        
        // ëª¨ë‹¬ ?œì‹œ
        const modal = document.getElementById('session-warning-modal');
        const modalContent = modal.querySelector('.modal-content');
        const modalHeader = modal.querySelector('.modal-header h3');
        const modalBody = modal.querySelector('.modal-body p');
        const countdownElement = document.getElementById('countdown');
        const extendBtn = document.getElementById('extend-session-btn');
        
        modalHeader.textContent = '?¸ì…˜ ë§Œë£Œ';
        modalBody.textContent = '?¸ì…˜??ë§Œë£Œ?˜ì—ˆ?µë‹ˆ?? ê³ ë ¤?€?™êµ ?¬í„¸ë¡??¤ì‹œ ?´ë™?©ë‹ˆ??';
        countdownElement.textContent = 'ë§Œë£Œ??;
        extendBtn.textContent = '?¬í„¸ë¡??´ë™';
        
        modal.classList.remove('hidden');
        modal.classList.add('visible');
    }
    
    resetTimer() {
        this.startTime = Date.now();
        this.hideWarningModal();
        
        // ?€?´ë¨¸ ?íƒœ ì´ˆê¸°??
        const timerElement = document.getElementById('session-timer');
        const progressElement = document.getElementById('session-progress-bar');
        
        if (timerElement) {
            timerElement.className = 'session-timer';
        }
        if (progressElement) {
            progressElement.className = 'session-progress-fill';
        }
        
        // Electron APIë¥??µí•´ ë©”ì¸ ?„ë¡œ?¸ìŠ¤ ?€?´ë¨¸???¬ì„¤??
        if (window.electronAPI) {
            window.electronAPI.resetSessionTimer();
        }
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }
    
    bindEvents() {
        // ?ˆë¡œê³ ì¹¨ ë²„íŠ¼
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const webview = document.getElementById('portal-webview');
                if (webview) {
                    webview.reload();
                }
            });
        }
        
        // ?ˆìœ¼ë¡?ë²„íŠ¼
        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                const webview = document.getElementById('portal-webview');
                if (webview) {
                    webview.loadURL('https://portal.korea.ac.kr/front/Main.kpd');
                }
            });
        }
        
        // ?¸ì…˜ ?°ìž¥ ë²„íŠ¼
        const extendBtn = document.getElementById('extend-session-btn');
        if (extendBtn) {
            extendBtn.addEventListener('click', () => {
                this.resetTimer();
                this.hideWarningModal();
            });
        }
        
        // ëª¨ë‹¬ ?«ê¸° ë²„íŠ¼
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideWarningModal();
            });
        }
        
        // ?¹ë·° ?´ë²¤??
        const webview = document.getElementById('portal-webview');
        if (webview) {
            webview.addEventListener('did-start-loading', () => {
                // ?˜ì´ì§€ ë¡œë”© ?œìž‘ ???€?´ë¨¸ ?¬ì„¤??
                this.resetTimer();
            });
            
            webview.addEventListener('did-finish-load', () => {
                // ?˜ì´ì§€ ë¡œë”© ?„ë£Œ ???€?´ë¨¸ ?¬ì„¤??
                this.resetTimer();
            });
            
            webview.addEventListener('did-navigate', () => {
                // ?¤ë¹„ê²Œì´?????€?´ë¨¸ ?¬ì„¤??
                this.resetTimer();
            });
        }
        
        // ?¬ìš©???œë™ ê°ì?
        document.addEventListener('mousedown', () => this.resetTimer());
        document.addEventListener('mousemove', () => this.resetTimer());
        document.addEventListener('keypress', () => this.resetTimer());
        document.addEventListener('scroll', () => this.resetTimer());
        document.addEventListener('touchstart', () => this.resetTimer());
        document.addEventListener('click', () => this.resetTimer());
        
        // ?¹ë·° ?´ë? ?œë™??ê°ì?
        const webviewElement = document.getElementById('portal-webview');
        if (webviewElement) {
            webviewElement.addEventListener('dom-ready', () => {
                webviewElement.addEventListener('mousedown', () => this.resetTimer());
                webviewElement.addEventListener('mousemove', () => this.resetTimer());
                webviewElement.addEventListener('keypress', () => this.resetTimer());
                webviewElement.addEventListener('scroll', () => this.resetTimer());
                webviewElement.addEventListener('click', () => this.resetTimer());
            });
        }
    }
}

// ?ë™ ë¡œê·¸??ê´€ë¦??´ëž˜??
class AutoLoginManager {
    constructor() {
        this.config = null;
        this.loginSuccess = false; // ë¡œê·¸???±ê³µ ?íƒœ ì¶”ì 
        this.init();
    }
    
    async init() {
        if (window.electronAPI) {
            this.config = await window.electronAPI.getLoginConfig();
            this.bindEvents();
            

                }, 500);
            } else {
                // ?ë™ ë¡œê·¸?¸ì´ ?œì„±?”ë˜???ˆìœ¼ë©??¤í–‰
                if (this.config.autoLogin && this.config.username && this.config.password) {
                    this.performAutoLogin();
                }
            }
        }
    }
    
    bindEvents() {
        // ë¡œê·¸???¤ì • ë²„íŠ¼
        const loginSettingsBtn = document.getElementById('login-settings-btn');
        if (loginSettingsBtn) {
            loginSettingsBtn.addEventListener('click', () => {
                console.log('ë¡œê·¸???¤ì • ë²„íŠ¼ ?´ë¦­??);

            });
        }
        
        // ?…ë°?´íŠ¸ ë²„íŠ¼
        const updateBtn = document.getElementById('update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                console.log('?…ë°?´íŠ¸ ë²„íŠ¼ ?´ë¦­??);
                this.checkForUpdates();
            });
        }
        

        }
    }
    
    hideLoginSettingsModal() {

        }
    }
    
    async saveLoginSettings() {

    }
    
    async performAutoLogin() {
        // ?´ë? ë¡œê·¸???±ê³µ??ê²½ìš° ì¤‘ë‹¨ (?? Login.kpd ?˜ì´ì§€?ì„œ??ë¦¬ì…‹)
        if (this.loginSuccess) {
            // ?„ìž¬ ?˜ì´ì§€ê°€ ë¡œê·¸???˜ì´ì§€?¸ì? ?•ì¸
            const webview = document.getElementById('portal-webview');
            if (webview) {
                const currentURL = webview.getURL();
                if (currentURL.includes('Login.kpd')) {
                    console.log('ë¡œê·¸?????¬ê°ì§€, ?íƒœ ë¦¬ì…‹ ???ë™ ë¡œê·¸???¬ì‹œ??);
                    this.loginSuccess = false; // ?íƒœ ë¦¬ì…‹
                } else {
                    console.log('?´ë? ë¡œê·¸???±ê³µ ?íƒœ, ?ë™ ë¡œê·¸??ì¤‘ë‹¨');
                    return;
                }
            } else {
                console.log('?´ë? ë¡œê·¸???±ê³µ ?íƒœ, ?ë™ ë¡œê·¸??ì¤‘ë‹¨');
                return;
            }
        }
        
        if (!this.config || !this.config.username || !this.config.password) {
            return;
        }
        
        console.log('?Œë”?¬ì—???ë™ ë¡œê·¸???œë„:', this.config.username);
        
        // ? ì‹œ ?€ê¸????ë™ ë¡œê·¸???¤í–‰
        setTimeout(async () => {
            // ?¤ì‹œ ??ë²??±ê³µ ?íƒœ ?•ì¸
            if (this.loginSuccess) {
                console.log('ë¡œê·¸???±ê³µ ?íƒœ ?•ì¸?? ?ë™ ë¡œê·¸??ì¤‘ë‹¨');
                return;
            }
            
            if (window.electronAPI) {
                const result = await window.electronAPI.triggerAutoLogin();
                
                if (result && result.success) {
                    console.log('?ë™ ë¡œê·¸???±ê³µ:', result.message);
                    this.loginSuccess = true; // ?±ê³µ ?íƒœ ?€??
                    return;
                } else {
                    console.error('?ë™ ë¡œê·¸???¤íŒ¨:', result ? result.message : '?????†ëŠ” ?¤ë¥˜');
                    // ?¤íŒ¨ ????ë²ˆë§Œ ???œë„ (?±ê³µ?˜ì? ?Šì? ê²½ìš°?ë§Œ)
                    if (!this.loginSuccess) {
                        setTimeout(() => {
                            this.performAutoLogin();
                        }, 2000); // 2ì´????¬ì‹œ??
                    }
                }
            }
        }, 1000);
    }
    
    // ?…ë°?´íŠ¸ ê´€??ë©”ì„œ?œë“¤
    async checkForUpdates() {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.checkForUpdates();
                if (result && result.success && result.result) {
                    console.log('?…ë°?´íŠ¸ ë°œê²¬:', result.result);
                    
                    // ?¬ìš©?ì—ê²??…ë°?´íŠ¸ ?Œë¦¼
                    const shouldDownload = confirm(
                        `?ˆë¡œ??ë²„ì „??ë°œê²¬?˜ì—ˆ?µë‹ˆ??\n\n` +
                        `?„ìž¬ ë²„ì „: ${result.result.version}\n` +
                        `??ë²„ì „: ${result.result.version}\n\n` +
                        `?…ë°?´íŠ¸ë¥??¤ìš´ë¡œë“œ?˜ì‹œê² ìŠµ?ˆê¹Œ?`
                    );
                    
                    if (shouldDownload) {
                        this.downloadUpdate(result.result);
                    }
                } else if (result && result.success && !result.result) {
                    console.log('?…ë°?´íŠ¸ê°€ ?†ìŠµ?ˆë‹¤.');
                    alert('?´ë? ìµœì‹  ë²„ì „?…ë‹ˆ??');
                } else {
                    console.error('?…ë°?´íŠ¸ ?•ì¸ ?¤íŒ¨:', result ? result.error : '?????†ëŠ” ?¤ë¥˜');
                    alert('?…ë°?´íŠ¸ ?•ì¸???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
                }
            } catch (error) {
                console.error('?…ë°?´íŠ¸ ?•ì¸ ì¤??¤ë¥˜:', error);
                alert('?…ë°?´íŠ¸ ?•ì¸ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
            }
        }
    }
    
    async downloadUpdate(updateInfo) {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.downloadUpdate(updateInfo);
                if (result && result.success) {
                    console.log('?…ë°?´íŠ¸ ?¤ìš´ë¡œë“œ ?„ë£Œ:', result.filePath);
                    
                    const shouldInstall = confirm(
                        '?…ë°?´íŠ¸ê°€ ?¤ìš´ë¡œë“œ?˜ì—ˆ?µë‹ˆ??\n\n' +
                        'ì§€ê¸??¤ì¹˜?˜ì‹œê² ìŠµ?ˆê¹Œ?'
                    );
                    
                    if (shouldInstall) {
                        this.installUpdate(result.filePath);
                    }
                } else {
                    console.error('?…ë°?´íŠ¸ ?¤ìš´ë¡œë“œ ?¤íŒ¨:', result ? result.error : '?????†ëŠ” ?¤ë¥˜');
                    alert('?…ë°?´íŠ¸ ?¤ìš´ë¡œë“œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
                }
            } catch (error) {
                console.error('?…ë°?´íŠ¸ ?¤ìš´ë¡œë“œ ì¤??¤ë¥˜:', error);
                alert('?…ë°?´íŠ¸ ?¤ìš´ë¡œë“œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
            }
        }
    }
    
    async installUpdate(filePath) {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.installUpdate(filePath);
                if (result && result.success) {
                    console.log('?…ë°?´íŠ¸ ?¤ì¹˜ ?œìž‘');
                } else {
                    console.error('?…ë°?´íŠ¸ ?¤ì¹˜ ?¤íŒ¨:', result ? result.error : '?????†ëŠ” ?¤ë¥˜');
                    alert('?…ë°?´íŠ¸ ?¤ì¹˜???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
                }
            } catch (error) {
                console.error('?…ë°?´íŠ¸ ?¤ì¹˜ ì¤??¤ë¥˜:', error);
                alert('?…ë°?´íŠ¸ ?¤ì¹˜ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
            }
        }
    }
    
    showUpdateButton() {
        const updateBtn = document.getElementById('update-btn');
        if (updateBtn) {
            updateBtn.style.display = 'inline-block';
        }
    }
    
    hideUpdateButton() {
        const updateBtn = document.getElementById('update-btn');
        if (updateBtn) {
            updateBtn.style.display = 'none';
        }
    }
}

// ??ì´ˆê¸°??
document.addEventListener('DOMContentLoaded', () => {
    // ?¸ì…˜ ?€?´ë¨¸ ?œìž‘
    const sessionTimer = new SessionTimer();
    
    // ?ë™ ë¡œê·¸??ë§¤ë‹ˆ?€ ?œìž‘
    const autoLoginManager = new AutoLoginManager();
    
    // AutoLoginManager ì´ˆê¸°???„ë£Œ ??ë¡œê·¸???¤ì • ?•ì¸
    setTimeout(async () => {
        // ?¤ì •??ë¡œë“œ???Œê¹Œì§€ ?€ê¸?
        if (autoLoginManager.config) {
            console.log('?¤ì • ë¡œë“œ??', autoLoginManager.config);
            

        }
    }, 1000); // 1ì´??€ê¸?
    
    // Electron APIê°€ ?¬ìš© ê°€?¥í•œ ê²½ìš°
    if (window.electronAPI) {
        // ?¸ì…˜ ?•ë³´ ê°€?¸ì˜¤ê¸?
        window.electronAPI.getSessionInfo().then(info => {
            if (info) {
                sessionTimer.sessionTimeout = info.timeout;
                sessionTimer.warningTime = info.warningTime;
            }
        });
        
        // ?¬ìš©???œë™ ???€?´ë¨¸ ?¬ì„¤??
        window.electronAPI.onUserActivity(() => {
            sessionTimer.resetTimer();
        });
    }
    
            // ?¹ë·° ?¤ì •
        const webview = document.getElementById('portal-webview');
        if (webview) {
          // ?¹ë·° ?¤ì •
          webview.setAttribute('webpreferences', 'contextIsolation=yes, nodeIntegration=no');
          
                    // ë¡œë”© ?¸ë””ì¼€?´í„°
          webview.addEventListener('did-start-loading', () => {
            console.log('?¹ë·° ë¡œë”© ?œìž‘');
            // ë¡œë”© ?œìž‘ ??ì²˜ë¦¬
          });
        
        webview.addEventListener('did-finish-load', () => {
            // ë¡œë”© ?„ë£Œ ???ë™ ë¡œê·¸???œë„ (ë¡œê·¸???±ê³µ?˜ì? ?Šì? ê²½ìš°?ë§Œ)
            if (autoLoginManager.config && autoLoginManager.config.autoLogin && !autoLoginManager.loginSuccess) {
                autoLoginManager.performAutoLogin();
            }
        });
        
        webview.addEventListener('did-fail-load', (event) => {
            console.error('?¹ë·° ë¡œë”© ?¤íŒ¨:', event);
        });
    }
});

// ??ì¢…ë£Œ ???•ë¦¬
window.addEventListener('beforeunload', () => {
    // ?€?´ë¨¸ ?•ë¦¬
    if (window.sessionTimer) {
        window.sessionTimer.stopTimer();
    }
});

