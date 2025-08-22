const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.configPath = path.join(__dirname, 'config.json');
    }

    // 설정 저장
    saveConfig(config) {
        try {
            const configData = {
                username: config.username || '',
                password: config.password || '',
                autoLogin: config.autoLogin || false,
                rememberCredentials: config.rememberCredentials || false
            };
            
            fs.writeFileSync(this.configPath, JSON.stringify(configData, null, 2));
            console.log('설정이 저장되었습니다.');
            return true;
        } catch (error) {
            console.error('설정 저장 실패:', error);
            return false;
        }
    }

    // 설정 로드
    loadConfig() {
        try {
            if (!fs.existsSync(this.configPath)) {
                return {
                    username: '',
                    password: '',
                    autoLogin: false,
                    rememberCredentials: false
                };
            }

            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            console.log('설정이 로드되었습니다.');
            return config;
        } catch (error) {
            console.error('설정 로드 실패:', error);
            return {
                username: '',
                password: '',
                autoLogin: false,
                rememberCredentials: false
            };
        }
    }

    // 설정 삭제
    clearConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                fs.unlinkSync(this.configPath);
                console.log('설정이 삭제되었습니다.');
            }
            return true;
        } catch (error) {
            console.error('설정 삭제 실패:', error);
            return false;
        }
    }
}

module.exports = new ConfigManager();
