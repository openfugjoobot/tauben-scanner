#!/bin/bash
set -e

echo "🚀 Building Tauben Scanner APK..."

cd /app/tauben-scanner/frontend

echo "📦 Installing dependencies..."
npm ci

echo "🔧 Building frontend..."
npm run build

echo "📱 Setting up Android SDK..."
mkdir -p android
echo "sdk.dir=/opt/android-sdk" > android/local.properties

echo "🔄 Syncing Capacitor..."
npx cap sync android

echo "🏗️ Building Debug APK..."
cd android
./gradlew assembleDebug --no-daemon

echo "✅ Build complete!"
echo "📍 APK location: /app/tauben-scanner/frontend/android/app/build/outputs/apk/debug/app-debug.apk"
ls -lh ./app/build/outputs/apk/debug/app-debug.apk

# Copy to output
cp ./app/build/outputs/apk/debug/app-debug.apk /output/tauben-scanner-debug.apk
echo "📤 APK copied to /output/tauben-scanner-debug.apk"
