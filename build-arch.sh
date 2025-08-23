#!/bin/bash

# KUPID 아키텍처별 빌드 스크립트
# 사용법: ./build-arch.sh [platform] [architecture]

echo "🚀 KUPID 아키텍처별 빌드 시작..."

# 플랫폼과 아키텍처 확인
PLATFORM=${1:-"all"}
ARCH=${2:-"all"}

echo "📦 플랫폼: $PLATFORM, 아키텍처: $ARCH"

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📥 의존성 설치 중..."
    npm install
fi

# 빌드 함수
build_platform() {
    local platform=$1
    local arch=$2
    
    case $platform in
        "win")
            case $arch in
                "x64") npm run build:win-x64 ;;
                "x86") npm run build:win-x86 ;;
                "arm64") npm run build:win-arm64 ;;
                "all") 
                    npm run build:win-x64
                    npm run build:win-arm64
                    ;;
                *) echo "❌ 지원하지 않는 Windows 아키텍처: $arch" ;;
            esac
            ;;
        "mac")
            case $arch in
                "x64") npm run build:mac-x64 ;;
                "arm64") npm run build:mac-arm64 ;;
                "universal") npm run build:mac-universal ;;
                "all")
                    npm run build:mac-x64
                    npm run build:mac-arm64
                    npm run build:mac-universal
                    ;;
                *) echo "❌ 지원하지 않는 macOS 아키텍처: $arch" ;;
            esac
            ;;
        "linux")
            case $arch in
                "x64") npm run build:linux-x64 ;;
                "arm64") npm run build:linux-arm64 ;;
                "armv7l") npm run build:linux-armv7l ;;
                "all")
                    npm run build:linux-x64
                    npm run build:linux-arm64
                    ;;
                *) echo "❌ 지원하지 않는 Linux 아키텍처: $arch" ;;
            esac
            ;;
        "all")
            echo "🌍 모든 플랫폼 및 아키텍처 빌드 중..."
            npm run build:all-arch
            ;;
        *)
            echo "❌ 지원하지 않는 플랫폼: $platform"
            echo "사용법: ./build-arch.sh [win|mac|linux|all] [x64|arm64|universal|all]"
            exit 1
            ;;
    esac
}

# 빌드 실행
build_platform $PLATFORM $ARCH

echo "✅ 빌드 완료! 결과물은 dist/ 폴더를 확인하세요."
