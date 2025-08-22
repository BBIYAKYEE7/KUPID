// ë¡œê·¸???¤ì • ?˜ì´ì§€ ë¡œì§
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
        // ???œì¶œ ?´ë²¤??
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // ?…ë ¥ ?„ë“œ ë³€ê²???? íš¨??ê²€??
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateForm();
            });
        });
        
        // ì²´í¬ë°•ìŠ¤ ë³€ê²???? íš¨??ê²€??
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
        
        // ê¸°ë³¸ ? íš¨??ê²€??
        const isValid = username.length > 0 && password.length > 0;
        
        // ?ë™ ë¡œê·¸?¸ì´ ì²´í¬?˜ì–´ ?ˆìœ¼ë©?ë¡œê·¸???•ë³´ ?€?¥ë„ ì²´í¬?˜ì–´????
        const autoLoginValid = !autoLogin || (autoLogin && rememberCredentials);
        
        submitBtn.disabled = !isValid || !autoLoginValid;
        
        // ?ëŸ¬ ë©”ì‹œì§€ ?œì‹œ
        this.showValidationMessages(username, password, autoLogin, rememberCredentials);
    }
    
    showValidationMessages(username, password, autoLogin, rememberCredentials) {
        // ê¸°ì¡´ ?ëŸ¬ ë©”ì‹œì§€ ?œê±°
        this.clearValidationMessages();
        
        // ?„ì´??ê²€ì¦?
        if (username.length === 0) {
            this.showFieldError('username', '?„ì´?”ë? ?…ë ¥?´ì£¼?¸ìš”.');
        }
        
        // ë¹„ë?ë²ˆí˜¸ ê²€ì¦?
        if (password.length === 0) {
            this.showFieldError('password', 'ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.');
        } else if (password.length < 6) {
            this.showFieldError('password', 'ë¹„ë?ë²ˆí˜¸??6???´ìƒ?´ì–´???©ë‹ˆ??');
        }
        
        // ?ë™ ë¡œê·¸???¤ì • ê²€ì¦?
        if (autoLogin && !rememberCredentials) {
            this.showFieldError('auto-login', '?ë™ ë¡œê·¸?¸ì„ ?¬ìš©?˜ë ¤ë©?ë¡œê·¸???•ë³´ ?€?¥ì„ ?œì„±?”í•´???©ë‹ˆ??');
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
        // ê¸°ì¡´ ?ëŸ¬ ë©”ì‹œì§€ ?œê±°
        const errorMessages = document.querySelectorAll('.field-error');
        errorMessages.forEach(msg => msg.remove());
        
        // ?…ë ¥ ?„ë“œ ?Œë‘ë¦??‰ìƒ ì´ˆê¸°??
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
        
        // ë¡œë”© ?íƒœ ?œì‹œ
        this.setLoadingState(true);
        
        try {

                const success = await window.electronAPI.saveLoginConfig(config);
                
                if (success) {
                    // ?±ê³µ ë©”ì‹œì§€ ?œì‹œ
                    this.showSuccessMessage();
                    

                        }
                    }, 1500);
                } else {
                    this.showErrorMessage('?¤ì • ?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤. ?¤ì‹œ ?œë„?´ì£¼?¸ìš”.');
                }
            } else {

            }
        } catch (error) {
            console.error('?¤ì • ?€???¤ë¥˜:', error);
            this.showErrorMessage('?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    }
    

    setLoadingState(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const container = document.querySelector('.setup-container');
        
        if (loading) {
            submitBtn.textContent = '?¤ì • ?€??ì¤?..';
            container.classList.add('loading');
        } else {
            submitBtn.textContent = '?¤ì • ?„ë£Œ ë°??œì‘';
            container.classList.remove('loading');
        }
    }
    
    showSuccessMessage() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.textContent = '???¤ì • ?„ë£Œ!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        // ?±ê³µ ë©”ì‹œì§€ ?œì‹œ
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4CAF50;">
                <h3>???¤ì •???„ë£Œ?˜ì—ˆ?µë‹ˆ??</h3>
                <p>ê³ ë ¤?€?™êµ ?¬í„¸ë¡??´ë™?©ë‹ˆ??..</p>
            </div>
        `;
        
        this.form.appendChild(successDiv);
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="background: #ffebee; border: 1px solid #f44336; border-radius: 8px; padding: 16px; margin-top: 16px; color: #f44336;">
                <strong>?¤ë¥˜:</strong> ${message}
            </div>
        `;
        
        // ê¸°ì¡´ ?ëŸ¬ ë©”ì‹œì§€ ?œê±°
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        this.form.appendChild(errorDiv);
    }
}

// ?˜ì´ì§€ ë¡œë“œ ??ì´ˆê¸°??
document.addEventListener('DOMContentLoaded', () => {
    new LoginSetup();
});

