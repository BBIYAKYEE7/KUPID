// ?�션 ?�?�머 관�?
class SessionTimer {
    constructor() {
        this.sessionTimeout = 60 * 60 * 1000; // 60분으�??�장
        this.warningTime = 10 * 60 * 1000; // 10�???경고�??�장
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
        
        // ?�?�머 ?�스???�데?�트
        const timerElement = document.getElementById('session-timer');
        if (timerElement) {
            timerElement.textContent = `?�션: ${timeString}`;
        }
        
        // ?�로그레??�??�데?�트
        const progressElement = document.getElementById('session-progress-bar');
        if (progressElement) {
            const progress = (remaining / this.sessionTimeout) * 100;
            progressElement.style.width = `${progress}%`;
            
            // 경고 ?�태???�른 ?�상 변�?
            progressElement.className = 'session-progress-fill';
            timerElement.className = 'session-timer';
            
            if (remaining <= this.warningTime) {
                progressElement.classList.add('warning');
                timerElement.classList.add('warning');
            }
            
            if (remaining <= 60000) { // 1�??�하
                progressElement.classList.add('danger');
                timerElement.classList.add('danger');
            }
        }
        
        // 경고 모달 ?�시
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
            
            // 카운?�다???�작
            let countdown = 600; // 10�?
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
        
        // ?�션 만료 ?�림
        if (window.electronAPI) {
            window.electronAPI.resetSessionTimer();
        }
        
        // 모달 ?�시
        const modal = document.getElementById('session-warning-modal');
        const modalContent = modal.querySelector('.modal-content');
        const modalHeader = modal.querySelector('.modal-header h3');
        const modalBody = modal.querySelector('.modal-body p');
        const countdownElement = document.getElementById('countdown');
        const extendBtn = document.getElementById('extend-session-btn');
        
        modalHeader.textContent = '?�션 만료';
        modalBody.textContent = '?�션??만료?�었?�니?? 고려?�?�교 ?�털�??�시 ?�동?�니??';
        countdownElement.textContent = '만료??;
        extendBtn.textContent = '?�털�??�동';
        
        modal.classList.remove('hidden');
        modal.classList.add('visible');
    }
    
    resetTimer() {
        this.startTime = Date.now();
        this.hideWarningModal();
        
        // ?�?�머 ?�태 초기??
        const timerElement = document.getElementById('session-timer');
        const progressElement = document.getElementById('session-progress-bar');
        
        if (timerElement) {
            timerElement.className = 'session-timer';
        }
        if (progressElement) {
            progressElement.className = 'session-progress-fill';
        }
        
        // Electron API�??�해 메인 ?�로?�스 ?�?�머???�설??
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
        // ?�로고침 버튼
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const webview = document.getElementById('portal-webview');
                if (webview) {
                    webview.reload();
                }
            });
        }
        
        // ?�으�?버튼
        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                const webview = document.getElementById('portal-webview');
                if (webview) {
                    webview.loadURL('https://portal.korea.ac.kr/front/Main.kpd');
                }
            });
        }
        
        // ?�션 ?�장 버튼
        const extendBtn = document.getElementById('extend-session-btn');
        if (extendBtn) {
            extendBtn.addEventListener('click', () => {
                this.resetTimer();
                this.hideWarningModal();
            });
        }
        
        // 모달 ?�기 버튼
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideWarningModal();
            });
        }
        
        // ?�뷰 ?�벤??
        const webview = document.getElementById('portal-webview');
        if (webview) {
            webview.addEventListener('did-start-loading', () => {
                // ?�이지 로딩 ?�작 ???�?�머 ?�설??
                this.resetTimer();
            });
            
            webview.addEventListener('did-finish-load', () => {
                // ?�이지 로딩 ?�료 ???�?�머 ?�설??
                this.resetTimer();
            });
            
            webview.addEventListener('did-navigate', () => {
                // ?�비게이?????�?�머 ?�설??
                this.resetTimer();
            });
        }
        
        // ?�용???�동 감�?
        document.addEventListener('mousedown', () => this.resetTimer());
        document.addEventListener('mousemove', () => this.resetTimer());
        document.addEventListener('keypress', () => this.resetTimer());
        document.addEventListener('scroll', () => this.resetTimer());
        document.addEventListener('touchstart', () => this.resetTimer());
        document.addEventListener('click', () => this.resetTimer());
        
        // ?�뷰 ?��? ?�동??감�?
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

// ?�동 로그??관�??�래??
class AutoLoginManager {
    constructor() {
        this.config = null;
        this.loginSuccess = false; // 로그???�공 ?�태 추적
        this.init();
    }
    
    async init() {
        if (window.electronAPI) {
            this.config = await window.electronAPI.getLoginConfig();
            this.bindEvents();
            

                }, 500);
            } else {
                // ?�동 로그?�이 ?�성?�되???�으�??�행
                if (this.config.autoLogin && this.config.username && this.config.password) {
                    this.performAutoLogin();
                }
            }
        }
    }
    
    bindEvents() {
        // 로그???�정 버튼
        const loginSettingsBtn = document.getElementById('login-settings-btn');
        if (loginSettingsBtn) {
            loginSettingsBtn.addEventListener('click', () => {
                console.log('로그???�정 버튼 ?�릭??);

            });
        }
        
        // ?�데?�트 버튼
        const updateBtn = document.getElementById('update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                console.log('?�데?�트 버튼 ?�릭??);
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
        // ?��? 로그???�공??경우 중단 (?? Login.kpd ?�이지?�서??리셋)
        if (this.loginSuccess) {
            // ?�재 ?�이지가 로그???�이지?��? ?�인
            const webview = document.getElementById('portal-webview');
            if (webview) {
                const currentURL = webview.getURL();
                if (currentURL.includes('Login.kpd')) {
                    console.log('로그?????�감지, ?�태 리셋 ???�동 로그???�시??);
                    this.loginSuccess = false; // ?�태 리셋
                } else {
                    console.log('?��? 로그???�공 ?�태, ?�동 로그??중단');
                    return;
                }
            } else {
                console.log('?��? 로그???�공 ?�태, ?�동 로그??중단');
                return;
            }
        }
        
        if (!this.config || !this.config.username || !this.config.password) {
            return;
        }
        
        console.log('?�더?�에???�동 로그???�도:', this.config.username);
        
        // ?�시 ?��????�동 로그???�행
        setTimeout(async () => {
            // ?�시 ??�??�공 ?�태 ?�인
            if (this.loginSuccess) {
                console.log('로그???�공 ?�태 ?�인?? ?�동 로그??중단');
                return;
            }
            
            if (window.electronAPI) {
                const result = await window.electronAPI.triggerAutoLogin();
                
                if (result && result.success) {
                    console.log('?�동 로그???�공:', result.message);
                    this.loginSuccess = true; // ?�공 ?�태 ?�??
                    return;
                } else {
                    console.error('?�동 로그???�패:', result ? result.message : '?????�는 ?�류');
                    // ?�패 ????번만 ???�도 (?�공?��? ?��? 경우?�만)
                    if (!this.loginSuccess) {
                        setTimeout(() => {
                            this.performAutoLogin();
                        }, 2000); // 2�????�시??
                    }
                }
            }
        }, 1000);
    }
    
    // ?�데?�트 관??메서?�들
    async checkForUpdates() {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.checkForUpdates();
                if (result && result.success && result.result) {
                    console.log('?�데?�트 발견:', result.result);
                    
                    // ?�용?�에�??�데?�트 ?�림
                    const shouldDownload = confirm(
                        `?�로??버전??발견?�었?�니??\n\n` +
                        `?�재 버전: ${result.result.version}\n` +
                        `??버전: ${result.result.version}\n\n` +
                        `?�데?�트�??�운로드?�시겠습?�까?`
                    );
                    
                    if (shouldDownload) {
                        this.downloadUpdate(result.result);
                    }
                } else if (result && result.success && !result.result) {
                    console.log('?�데?�트가 ?�습?�다.');
                    alert('?��? 최신 버전?�니??');
                } else {
                    console.error('?�데?�트 ?�인 ?�패:', result ? result.error : '?????�는 ?�류');
                    alert('?�데?�트 ?�인???�패?�습?�다.');
                }
            } catch (error) {
                console.error('?�데?�트 ?�인 �??�류:', error);
                alert('?�데?�트 ?�인 �??�류가 발생?�습?�다.');
            }
        }
    }
    
    async downloadUpdate(updateInfo) {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.downloadUpdate(updateInfo);
                if (result && result.success) {
                    console.log('?�데?�트 ?�운로드 ?�료:', result.filePath);
                    
                    const shouldInstall = confirm(
                        '?�데?�트가 ?�운로드?�었?�니??\n\n' +
                        '지�??�치?�시겠습?�까?'
                    );
                    
                    if (shouldInstall) {
                        this.installUpdate(result.filePath);
                    }
                } else {
                    console.error('?�데?�트 ?�운로드 ?�패:', result ? result.error : '?????�는 ?�류');
                    alert('?�데?�트 ?�운로드???�패?�습?�다.');
                }
            } catch (error) {
                console.error('?�데?�트 ?�운로드 �??�류:', error);
                alert('?�데?�트 ?�운로드 �??�류가 발생?�습?�다.');
            }
        }
    }
    
    async installUpdate(filePath) {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.installUpdate(filePath);
                if (result && result.success) {
                    console.log('?�데?�트 ?�치 ?�작');
                } else {
                    console.error('?�데?�트 ?�치 ?�패:', result ? result.error : '?????�는 ?�류');
                    alert('?�데?�트 ?�치???�패?�습?�다.');
                }
            } catch (error) {
                console.error('?�데?�트 ?�치 �??�류:', error);
                alert('?�데?�트 ?�치 �??�류가 발생?�습?�다.');
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

// ??초기??
document.addEventListener('DOMContentLoaded', () => {
    // ?�션 ?�?�머 ?�작
    const sessionTimer = new SessionTimer();
    
    // ?�동 로그??매니?� ?�작
    const autoLoginManager = new AutoLoginManager();
    
    // AutoLoginManager 초기???�료 ??로그???�정 ?�인
    setTimeout(async () => {
        // ?�정??로드???�까지 ?��?
        if (autoLoginManager.config) {
            console.log('?�정 로드??', autoLoginManager.config);
            

        }
    }, 1000); // 1�??��?
    
    // Electron API가 ?�용 가?�한 경우
    if (window.electronAPI) {
        // ?�션 ?�보 가?�오�?
        window.electronAPI.getSessionInfo().then(info => {
            if (info) {
                sessionTimer.sessionTimeout = info.timeout;
                sessionTimer.warningTime = info.warningTime;
            }
        });
        
        // ?�용???�동 ???�?�머 ?�설??
        window.electronAPI.onUserActivity(() => {
            sessionTimer.resetTimer();
        });
    }
    
            // ?�뷰 ?�정
        const webview = document.getElementById('portal-webview');
        if (webview) {
          // ?�뷰 ?�정
          webview.setAttribute('webpreferences', 'contextIsolation=yes, nodeIntegration=no');
          
                    // 로딩 ?�디케?�터
          webview.addEventListener('did-start-loading', () => {
            console.log('?�뷰 로딩 ?�작');
            // 로딩 ?�작 ??처리
          });
        
        webview.addEventListener('did-finish-load', () => {
            // 로딩 ?�료 ???�동 로그???�도 (로그???�공?��? ?��? 경우?�만)
            if (autoLoginManager.config && autoLoginManager.config.autoLogin && !autoLoginManager.loginSuccess) {
                autoLoginManager.performAutoLogin();
            }
        });
        
        webview.addEventListener('did-fail-load', (event) => {
            console.error('?�뷰 로딩 ?�패:', event);
        });
    }
});

// ??종료 ???�리
window.addEventListener('beforeunload', () => {
    // ?�?�머 ?�리
    if (window.sessionTimer) {
        window.sessionTimer.stopTimer();
    }
});

