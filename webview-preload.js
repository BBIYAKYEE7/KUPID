// 웹뷰 전용 preload 스크립트
(function() {
  'use strict';
  
  // Pretendard 폰트 주입 함수 (더 강력한 버전)
  function injectPretendardFont() {
    try {
      console.log('웹뷰 preload에서 Pretendard 폰트 주입 시작...');
      
      // 기존 스타일 제거
      const existingStyles = document.querySelectorAll('#pretendard-font-injection, #pretendard-force-style');
      existingStyles.forEach(style => style.remove());
      
      // 1. 기본 폰트 정의
      const fontStyle = document.createElement('style');
      fontStyle.id = 'pretendard-font-injection';
      fontStyle.textContent = `
        @font-face {
          font-family: 'Pretendard';
          src: local('Pretendard'), local('Pretendard-Regular'), local('Pretendard Regular');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Pretendard';
          src: local('Pretendard-Bold'), local('Pretendard Bold'), local('PretendardBold');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(fontStyle);
      
      // 2. 강제 적용 스타일 (더 강력한 버전)
      const forceStyle = document.createElement('style');
      forceStyle.id = 'pretendard-force-style';
      forceStyle.textContent = `
        /* 모든 요소에 Pretendard 폰트 강제 적용 */
        html, body, * {
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
        
        /* 모든 텍스트 요소 강제 적용 */
        *, *::before, *::after {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        }
      `;
      document.head.appendChild(forceStyle);
      
      // 3. 모든 요소에 직접 스타일 적용
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
      
      // 주기적으로 재적용 (3초마다)
      const intervalId = setInterval(applyFontToAllElements, 3000);
      
      // 20초 후 중단
      setTimeout(() => {
        clearInterval(intervalId);
        console.log('웹뷰 preload 폰트 주기적 적용 완료');
      }, 20000);
      
      console.log('웹뷰 preload에서 Pretendard 폰트 주입 완료');
    } catch (error) {
      console.error('웹뷰 preload 폰트 주입 오류:', error);
    }
  }
  
  // 페이지 로드 시 폰트 주입
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPretendardFont);
  } else {
    injectPretendardFont();
  }
  
  // 추가로 window load 이벤트에서도 주입
  window.addEventListener('load', injectPretendardFont);
  
  // MutationObserver로 동적 콘텐츠 처리
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldReapply = true;
      }
    });
    
    if (shouldReapply) {
      setTimeout(injectPretendardFont, 100);
    }
  });
  
  // body가 준비되면 observer 시작
  if (document.body) {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    });
  }
})();
