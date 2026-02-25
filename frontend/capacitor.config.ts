import type { CapacitorConfig } from '@capacitor/cli';

// Determine build type from environment variable
const isDebugBuild = process.env.NODE_ENV !== 'production' && process.env.BUILD_TYPE !== 'release';

const config: CapacitorConfig = {
  appId: 'com.taubenscanner.app',
  appName: 'Tauben Scanner',
  webDir: 'dist',
  server: {
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreKeyPassword: undefined,
      signingType: 'apksigner',
    },
    // Debug only in development, disabled in release
    webContentsDebuggingEnabled: isDebugBuild
  },
  plugins: {
    Camera: {
      permissionPrompt: true,
      saveToGallery: true
    },
    Geolocation: {
      permissionPrompt: true
    }
  }
};

export default config;
