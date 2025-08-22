const https = require('https');
const { app, dialog, shell } = require('electron');
const path = require('path');

class AutoUpdater {
  constructor() {
    this.currentVersion = app.getVersion();
    this.repoOwner = 'BBIYAKYEE7';
    this.repoName = 'KUPID';
    this.githubApiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/releases/latest`;
    this.releaseUrl = 'https://github.com/BBIYAKYEE7/KUPID/releases/latest';
  }

  // GitHub API에서 최신 릴리즈 정보 가져오기
  async checkForUpdates() {
    try {
      console.log('업데이트 확인 중...');
      console.log('현재 버전:', this.currentVersion);
      
      const releaseInfo = await this.fetchLatestRelease();
      
      if (!releaseInfo) {
        console.log('릴리즈 정보를 가져올 수 없습니다.');
        return null;
      }

      console.log('최신 릴리즈 정보:', releaseInfo);
      
      const latestVersion = releaseInfo.tag_name.replace('v', '');
      const isNewer = this.compareVersions(latestVersion, this.currentVersion);
      
      if (isNewer) {
        console.log('새로운 버전이 발견되었습니다:', latestVersion);
        return {
          version: latestVersion,
          releaseNotes: releaseInfo.body,
          downloadUrl: releaseInfo.html_url,
          assets: releaseInfo.assets
        };
      } else {
        console.log('최신 버전입니다.');
        return null;
      }
    } catch (error) {
      console.error('업데이트 확인 중 오류:', error);
      return null;
    }
  }

  // GitHub API 호출
  fetchLatestRelease() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${this.repoOwner}/${this.repoName}/releases/latest`,
        method: 'GET',
        headers: {
          'User-Agent': 'KUPID-AutoUpdater/1.0.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const releaseInfo = JSON.parse(data);
              resolve(releaseInfo);
            } else {
              console.error('GitHub API 오류:', res.statusCode, data);
              reject(new Error(`GitHub API 오류: ${res.statusCode}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  // 버전 비교 함수
  compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1 = v1Parts[i] || 0;
      const v2 = v2Parts[i] || 0;
      
      if (v1 > v2) return true;
      if (v1 < v2) return false;
    }
    
    return false; // 동일한 버전
  }

  // 업데이트 다이얼로그 표시
  async showUpdateDialog(updateInfo) {
    const options = {
      type: 'info',
      title: '새로운 버전이 있습니다!',
      message: `KUPID v${updateInfo.version}이(가) 출시되었습니다.`,
      detail: `현재 버전: v${this.currentVersion}\n최신 버전: v${updateInfo.version}\n\n${updateInfo.releaseNotes || '새로운 기능과 개선사항이 포함되었습니다.'}`,
      buttons: ['자동 업데이트', '수동 다운로드', '나중에', '업데이트 확인 안함'],
      defaultId: 0,
      cancelId: 2,
      icon: path.join(__dirname, 'images', 'korea.png')
    };

    const result = await dialog.showMessageBox(options);
    
    switch (result.response) {
      case 0: // 자동 업데이트
        await this.downloadUpdate(updateInfo);
        break;
      case 1: // 수동 다운로드
        this.manualDownload(updateInfo);
        break;
      case 2: // 나중에
        // 아무것도 하지 않음
        break;
      case 3: // 업데이트 확인 안함
        this.disableUpdateCheck();
        break;
    }
  }
  
  // 수동 다운로드 (브라우저에서)
  manualDownload(updateInfo) {
    console.log('수동 다운로드 시작...');
    
    // Windows용 인스톨러 찾기
    const windowsInstaller = updateInfo.assets.find(asset => 
      asset.name.includes('Setup') && asset.name.endsWith('.exe')
    );
    
    const downloadUrl = windowsInstaller ? windowsInstaller.browser_download_url : updateInfo.downloadUrl;
    
    // 브라우저에서 다운로드 페이지 열기
    shell.openExternal(downloadUrl);
    
    // 사용자에게 알림
    dialog.showMessageBox({
      type: 'info',
      title: '다운로드 시작',
      message: '브라우저에서 다운로드가 시작됩니다.',
      detail: '다운로드가 완료되면 설치 파일을 실행하여 업데이트를 완료하세요.',
      buttons: ['확인']
    });
  }

  // 업데이트 다운로드
  async downloadUpdate(updateInfo) {
    console.log('업데이트 다운로드 시작...');
    
    try {
      // Windows용 인스톨러 찾기
      const windowsInstaller = updateInfo.assets.find(asset => 
        asset.name.includes('Setup') && asset.name.endsWith('.exe')
      );
      
      if (!windowsInstaller) {
        throw new Error('Windows 인스톨러를 찾을 수 없습니다.');
      }
      
      const downloadUrl = windowsInstaller.browser_download_url;
      const fileName = windowsInstaller.name;
      
      // 다운로드 진행률 표시
      await this.showDownloadProgress(downloadUrl, fileName);
      
    } catch (error) {
      console.error('업데이트 다운로드 오류:', error);
      
      // 오류 발생 시 브라우저에서 다운로드
      const downloadUrl = updateInfo.downloadUrl;
      shell.openExternal(downloadUrl);
      
      dialog.showMessageBox({
        type: 'warning',
        title: '자동 다운로드 실패',
        message: '자동 다운로드에 실패했습니다.',
        detail: '브라우저에서 다운로드 페이지가 열립니다. 수동으로 다운로드 후 설치해주세요.',
        buttons: ['확인']
      });
    }
  }
  
  // 다운로드 진행률 표시 및 자동 설치
  async showDownloadProgress(downloadUrl, fileName) {
    const https = require('https');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    const downloadPath = path.join(os.tmpdir(), fileName);
    
    return new Promise((resolve, reject) => {
      // 다운로드 진행률 다이얼로그 표시
      const progressDialog = dialog.showMessageBox({
        type: 'info',
        title: '업데이트 다운로드 중',
        message: '새로운 버전을 다운로드하고 있습니다...',
        detail: '잠시만 기다려주세요.',
        buttons: [],
        cancelId: -1
      });
      
      const file = fs.createWriteStream(downloadPath);
      let downloadedBytes = 0;
      let totalBytes = 0;
      
      const request = https.get(downloadUrl, (response) => {
        totalBytes = parseInt(response.headers['content-length'], 10);
        
        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const progress = Math.round((downloadedBytes / totalBytes) * 100);
          
          // 진행률 업데이트 (다이얼로그는 업데이트할 수 없으므로 콘솔에 표시)
          console.log(`다운로드 진행률: ${progress}%`);
        });
        
        response.pipe(file);
        
        file.on('finish', async () => {
          file.close();
          console.log('다운로드 완료:', downloadPath);
          
          // 다운로드 완료 후 자동 설치
          await this.installUpdate(downloadPath);
          resolve();
        });
        
        file.on('error', (error) => {
          fs.unlink(downloadPath, () => {}); // 파일 삭제
          reject(error);
        });
      });
      
      request.on('error', (error) => {
        fs.unlink(downloadPath, () => {}); // 파일 삭제
        reject(error);
      });
    });
  }
  
  // 업데이트 자동 설치
  async installUpdate(installerPath) {
    try {
      console.log('업데이트 설치 시작:', installerPath);
      
      // 설치 전 사용자에게 알림
      const result = await dialog.showMessageBox({
        type: 'question',
        title: '업데이트 설치',
        message: '다운로드가 완료되었습니다.',
        detail: '지금 업데이트를 설치하시겠습니까? 설치 중에는 앱이 종료됩니다.',
        buttons: ['지금 설치', '나중에'],
        defaultId: 0,
        cancelId: 1
      });
      
      if (result.response === 0) {
        // 설치 실행
        const { exec } = require('child_process');
        
        // Windows에서 설치 파일 실행
        exec(`"${installerPath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error('설치 실행 오류:', error);
            dialog.showErrorBox('설치 오류', '업데이트 설치 중 오류가 발생했습니다.');
            return;
          }
          
          console.log('설치 파일 실행 완료');
          
          // 앱 종료 (설치 프로그램이 자동으로 처리)
          setTimeout(() => {
            app.quit();
          }, 2000);
        });
      } else {
        // 나중에 설치 선택 시 임시 파일 정리
        const fs = require('fs');
        fs.unlink(installerPath, (err) => {
          if (err) console.error('임시 파일 삭제 오류:', err);
        });
        
        dialog.showMessageBox({
          type: 'info',
          title: '설치 연기',
          message: '설치가 연기되었습니다.',
          detail: '언제든지 업데이트 버튼을 눌러 다시 설치할 수 있습니다.',
          buttons: ['확인']
        });
      }
      
    } catch (error) {
      console.error('업데이트 설치 오류:', error);
      dialog.showErrorBox('설치 오류', '업데이트 설치 중 오류가 발생했습니다.');
    }
  }

  // 업데이트 확인 비활성화
  disableUpdateCheck() {
    // 설정에 업데이트 확인 비활성화 플래그 저장
    try {
      const config = require('./config');
      const currentConfig = config.loadConfig();
      currentConfig.disableUpdateCheck = true;
      config.saveConfig(currentConfig);
      
      dialog.showMessageBox({
        type: 'info',
        title: '업데이트 확인 비활성화',
        message: '자동 업데이트 확인이 비활성화되었습니다.',
        detail: '설정에서 언제든지 다시 활성화할 수 있습니다.',
        buttons: ['확인']
      });
    } catch (error) {
      console.error('업데이트 확인 비활성화 중 오류:', error);
    }
  }

  // 업데이트 확인 활성화
  enableUpdateCheck() {
    try {
      const config = require('./config');
      const currentConfig = config.loadConfig();
      currentConfig.disableUpdateCheck = false;
      config.saveConfig(currentConfig);
      
      dialog.showMessageBox({
        type: 'info',
        title: '업데이트 확인 활성화',
        message: '자동 업데이트 확인이 활성화되었습니다.',
        detail: '앱을 재시작하면 업데이트 확인이 시작됩니다.',
        buttons: ['확인']
      });
    } catch (error) {
      console.error('업데이트 확인 활성화 중 오류:', error);
    }
  }

  // 수동 업데이트 확인
  async checkForUpdatesManually() {
    const updateInfo = await this.checkForUpdates();
    
    if (updateInfo) {
      await this.showUpdateDialog(updateInfo);
    } else {
      dialog.showMessageBox({
        type: 'info',
        title: '업데이트 확인',
        message: '최신 버전입니다!',
        detail: `현재 버전 v${this.currentVersion}이(가) 최신 버전입니다.`,
        buttons: ['확인']
      });
    }
  }

  // 자동 업데이트 확인 시작
  startAutoUpdateCheck() {
    // 설정에서 업데이트 확인 비활성화 여부 확인
    try {
      const config = require('./config');
      const currentConfig = config.loadConfig();
      
      if (currentConfig && currentConfig.disableUpdateCheck) {
        console.log('자동 업데이트 확인이 비활성화되어 있습니다.');
        return;
      }
    } catch (error) {
      console.error('설정 로드 중 오류:', error);
    }

    // 30초 후 첫 번째 업데이트 확인
    setTimeout(async () => {
      const updateInfo = await this.checkForUpdates();
      if (updateInfo) {
        // 자동 업데이트가 활성화되어 있으면 자동으로 업데이트
        if (this.isAutoUpdateEnabled()) {
          console.log('자동 업데이트가 활성화되어 있습니다. 자동으로 업데이트를 시작합니다.');
          await this.downloadUpdate(updateInfo);
        } else {
          await this.showUpdateDialog(updateInfo);
        }
      }
    }, 30000);

    // 이후 24시간마다 업데이트 확인
    setInterval(async () => {
      const updateInfo = await this.checkForUpdates();
      if (updateInfo) {
        // 자동 업데이트가 활성화되어 있으면 자동으로 업데이트
        if (this.isAutoUpdateEnabled()) {
          console.log('자동 업데이트가 활성화되어 있습니다. 자동으로 업데이트를 시작합니다.');
          await this.downloadUpdate(updateInfo);
        } else {
          await this.showUpdateDialog(updateInfo);
        }
      }
    }, 24 * 60 * 60 * 1000); // 24시간
  }
  
  // 자동 업데이트 활성화 여부 확인
  isAutoUpdateEnabled() {
    try {
      const config = require('./config');
      const currentConfig = config.loadConfig();
      return currentConfig && currentConfig.autoUpdate === true;
    } catch (error) {
      console.error('자동 업데이트 설정 확인 중 오류:', error);
      return false;
    }
  }
  
  // 자동 업데이트 활성화
  enableAutoUpdate() {
    try {
      const config = require('./config');
      const currentConfig = config.loadConfig();
      currentConfig.autoUpdate = true;
      config.saveConfig(currentConfig);
      
      dialog.showMessageBox({
        type: 'info',
        title: '자동 업데이트 활성화',
        message: '자동 업데이트가 활성화되었습니다.',
        detail: '새로운 버전이 발견되면 자동으로 다운로드하고 설치됩니다.',
        buttons: ['확인']
      });
    } catch (error) {
      console.error('자동 업데이트 활성화 중 오류:', error);
    }
  }
  
  // 자동 업데이트 비활성화
  disableAutoUpdate() {
    try {
      const config = require('./config');
      const currentConfig = config.loadConfig();
      currentConfig.autoUpdate = false;
      config.saveConfig(currentConfig);
      
      dialog.showMessageBox({
        type: 'info',
        title: '자동 업데이트 비활성화',
        message: '자동 업데이트가 비활성화되었습니다.',
        detail: '새로운 버전이 발견되면 알림만 표시됩니다.',
        buttons: ['확인']
      });
    } catch (error) {
      console.error('자동 업데이트 비활성화 중 오류:', error);
    }
  }
}

module.exports = AutoUpdater;
