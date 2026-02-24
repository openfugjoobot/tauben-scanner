#!/bin/bash
#
# Lokales APK Build Skript für Tauben Scanner
# 
# Voraussetzungen:
# - Node.js 20+ installiert
# - Java 17+ installiert (apt install openjdk-17-jdk)
# - Android SDK installiert
#
# Quick Setup Android SDK (falls nicht vorhanden):
#   export ANDROID_SDK_ROOT=$HOME/android-sdk
#   mkdir -p $ANDROID_SDK_ROOT/cmdline-tools
#   cd /tmp && wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
#   unzip commandlinetools-linux-11076708_latest.zip
#   mv cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest
#   export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools"
#   yes | sdkmanager --licenses
#   sdkmanager "platforms;android-34" "build-tools;34.0.0"
#

set -e

echo "🚀 Tauben Scanner APK Build"
echo "============================"

# Prüfe Voraussetzungen
echo "📋 Prüfe Voraussetzungen..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js nicht installiert. Installiere mit:"
    echo "   sudo apt install nodejs npm"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java nicht installiert. Installiere mit:"
    echo "   sudo apt install openjdk-17-jdk"
    exit 1
fi

if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "⚠️  ANDROID_HOME nicht gesetzt. Setze temporär..."
    if [ -d "$HOME/android-sdk" ]; then
        export ANDROID_SDK_ROOT=$HOME/android-sdk
        export ANDROID_HOME=$ANDROID_SDK_ROOT
        export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools"
    else
        echo "❌ Android SDK nicht gefunden unter $HOME/android-sdk"
        echo ""
        echo "Setup Android SDK:"
        echo "  1. cd /tmp"
        echo "  2. wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
        echo "  3. unzip commandlinetools-linux-11076708_latest.zip"
        echo "  4. mkdir -p ~/android-sdk/cmdline-tools"
        echo "  5. mv cmdline-tools ~/android-sdk/cmdline-tools/latest"
        echo "  6. export ANDROID_HOME=~/android-sdk"
        echo "  7. yes | sdkmanager --licenses"
        echo "  8. sdkmanager 'platforms;android-34' 'build-tools;34.0.0'"
        exit 1
    fi
fi

echo "✅ Node.js: $(node --version)"
echo "✅ Java: $(java -version 2>&1 | head -1)"
echo "✅ Android SDK: $ANDROID_HOME"

# Wechsle ins Frontend Verzeichnis
cd "$SCRIPT_DIR/../frontend" || cd "$(dirname "$0")/../frontend")
FRONTEND_DIR=$(pwd)
echo ""
echo "📁 Arbeitsverzeichnis: $FRONTEND_DIR"

# Installiere Dependencies
echo ""
echo "📦 Installiere Dependencies..."
npm ci

# Baue Frontend
echo ""
echo "🔨 Baue Frontend..."
npm run build

# Konfiguriere Android
echo ""
echo "📱 Konfiguriere Android..."
cd "$FRONTEND_DIR/android"

# Erstelle local.properties
if [ ! -f local.properties ]; then
    echo "Erstelle local.properties..."
    echo "sdk.dir=$ANDROID_HOME" > local.properties
fi

# Mache gradlew ausführbar
chmod +x gradlew

# Sync Capacitor
echo ""
echo "🔄 Sync Capacitor..."
cd "$FRONTEND_DIR"
npx cap sync android

# Baue APK
echo ""
echo "🏗️  Baue Debug APK..."
cd "$FRONTEND_DIR/android"
./gradlew assembleDebug --no-daemon

# Ergebnis
APK_PATH="$FRONTEND_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "============================"
if [ -f "$APK_PATH" ]; then
    echo "✅ Build erfolgreich!"
    echo ""
    echo "📱 APK Location:"
    echo "   $APK_PATH"
    echo ""
    ls -lh "$APK_PATH"
    echo ""
    echo "Installation auf Gerät:"
    echo "   adb install -r $APK_PATH"
    echo ""
    echo "Kopiere APK:"
    echo "   cp $APK_PATH ~/tauben-scanner.apk"
else
    echo "❌ Build fehlgeschlagen oder APK nicht gefunden"
    echo "   Gesucht unter: $APK_PATH"
    exit 1
fi
