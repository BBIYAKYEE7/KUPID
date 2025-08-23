@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM KUPID 아키텍처별 빌드 스크립트 (Windows)
REM 사용법: build-arch.bat [platform] [architecture]

echo 🚀 KUPID 아키텍처별 빌드 시작...

REM 플랫폼과 아키텍처 확인
set PLATFORM=%1
set ARCH=%2

if "%PLATFORM%"=="" set PLATFORM=all
if "%ARCH%"=="" set ARCH=all

echo 📦 플랫폼: %PLATFORM%, 아키텍처: %ARCH%

REM 의존성 설치 확인
if not exist "node_modules" (
    echo 📥 의존성 설치 중...
    npm install
)

REM 빌드 실행
if "%PLATFORM%"=="win" (
    if "%ARCH%"=="x64" (
        npm run build:win-x64
    ) else if "%ARCH%"=="x86" (
        npm run build:win-x86
    ) else if "%ARCH%"=="arm64" (
        npm run build:win-arm64
    ) else if "%ARCH%"=="all" (
        npm run build:win-x64
        npm run build:win-arm64
    ) else (
        echo ❌ 지원하지 않는 Windows 아키텍처: %ARCH%
    )
) else if "%PLATFORM%"=="mac" (
    if "%ARCH%"=="x64" (
        npm run build:mac-x64
    ) else if "%ARCH%"=="arm64" (
        npm run build:mac-arm64
    ) else if "%ARCH%"=="universal" (
        npm run build:mac-universal
    ) else if "%ARCH%"=="all" (
        npm run build:mac-x64
        npm run build:mac-arm64
        npm run build:mac-universal
    ) else (
        echo ❌ 지원하지 않는 macOS 아키텍처: %ARCH%
    )
) else if "%PLATFORM%"=="linux" (
    if "%ARCH%"=="x64" (
        npm run build:linux-x64
    ) else if "%ARCH%"=="arm64" (
        npm run build:linux-arm64
    ) else if "%ARCH%"=="armv7l" (
        npm run build:linux-armv7l
    ) else if "%ARCH%"=="all" (
        npm run build:linux-x64
        npm run build:linux-arm64
    ) else (
        echo ❌ 지원하지 않는 Linux 아키텍처: %ARCH%
    )
) else if "%PLATFORM%"=="all" (
    echo 🌍 모든 플랫폼 및 아키텍처 빌드 중...
    npm run build:all-arch
) else (
    echo ❌ 지원하지 않는 플랫폼: %PLATFORM%
    echo 사용법: build-arch.bat [win^|mac^|linux^|all] [x64^|arm64^|universal^|all]
    exit /b 1
)

echo ✅ 빌드 완료! 결과물은 dist/ 폴더를 확인하세요.
pause
