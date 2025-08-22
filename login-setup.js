// 로그???�정 ?�이지 로직
class LoginSetup {
    constructor() {
        this.form = document.getElementById('login-setup-form');
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.validateForm();

    }
    
    bindEvents() {
        // ???�출 ?�벤??
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // ?�력 ?�드 변�????�효??검??
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateForm();
            });
        });
        
        // 체크박스 변�????�효??검??
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validateForm();
            });
        });
    }
    
    validateForm() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const autoLogin = document.getElementById('auto-login').checked;
        const rememberCredentials = document.getElementById('remember-credentials').checked;
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        // 기본 ?�효??검??
        const isValid = username.length > 0 && password.length > 0;
        
        // ?�동 로그?�이 체크?�어 ?�으�?로그???�보 ?�?�도 체크?�어????
        const autoLoginValid = !autoLogin || (autoLogin && rememberCredentials);
        
        submitBtn.disabled = !isValid || !autoLoginValid;
        
        // ?�러 메시지 ?�시
        this.showValidationMessages(username, password, autoLogin, rememberCredentials);
    }
    
    showValidationMessages(username, password, autoLogin, rememberCredentials) {
        // 기존 ?�러 메시지 ?�거
        this.clearValidationMessages();
        
        // ?�이??검�?
        if (username.length === 0) {
            this.showFieldError('username', '?�이?��? ?�력?�주?�요.');
        }
        
        // 비�?번호 검�?
        if (password.length === 0) {
            this.showFieldError('password', '비�?번호�??�력?�주?�요.');
        } else if (password.length < 6) {
            this.showFieldError('password', '비�?번호??6???�상?�어???�니??');
        }
        
        // ?�동 로그???�정 검�?
        if (autoLogin && !rememberCredentials) {
            this.showFieldError('auto-login', '?�동 로그?�을 ?�용?�려�?로그???�보 ?�?�을 ?�성?�해???�니??');
        }
    }
    
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#f44336';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#f44336';
    }
    
    clearValidationMessages() {
        // 기존 ?�러 메시지 ?�거
        const errorMessages = document.querySelectorAll('.field-error');
        errorMessages.forEach(msg => msg.remove());
        
        // ?�력 ?�드 ?�두�??�상 초기??
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="password"]');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
        });
    }
    
    async handleSubmit() {
        const formData = new FormData(this.form);
        
        const config = {
            username: formData.get('username').trim(),
            password: formData.get('password'),
            autoLogin: formData.get('autoLogin') === 'on',
            rememberCredentials: formData.get('rememberCredentials') === 'on'
        };
        
        // 로딩 ?�태 ?�시
        this.setLoadingState(true);
        
        try {

                const success = await window.electronAPI.saveLoginConfig(config);
                
                if (success) {
                    // ?�공 메시지 ?�시
                    this.showSuccessMessage();
                    

                        }
                    }, 1500);
                } else {
                    this.showErrorMessage('?�정 ?�?�에 ?�패?�습?�다. ?�시 ?�도?�주?�요.');
                }
            } else {

            }
        } catch (error) {
            console.error('?�정 ?�???�류:', error);
            this.showErrorMessage('?�류가 발생?�습?�다: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    }
    

    setLoadingState(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const container = document.querySelector('.setup-container');
        
        if (loading) {
            submitBtn.textContent = '?�정 ?�??�?..';
            container.classList.add('loading');
        } else {
            submitBtn.textContent = '?�정 ?�료 �??�작';
            container.classList.remove('loading');
        }
    }
    
    showSuccessMessage() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.textContent = '???�정 ?�료!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        // ?�공 메시지 ?�시
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4CAF50;">
                <h3>???�정???�료?�었?�니??</h3>
                <p>고려?�?�교 ?�털�??�동?�니??..</p>
            </div>
        `;
        
        this.form.appendChild(successDiv);
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="background: #ffebee; border: 1px solid #f44336; border-radius: 8px; padding: 16px; margin-top: 16px; color: #f44336;">
                <strong>?�류:</strong> ${message}
            </div>
        `;
        
        // 기존 ?�러 메시지 ?�거
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        this.form.appendChild(errorDiv);
    }
}

// ?�이지 로드 ??초기??
document.addEventListener('DOMContentLoaded', () => {
    new LoginSetup();
});

