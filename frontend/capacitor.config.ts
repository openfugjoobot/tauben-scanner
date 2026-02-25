import { CapacitorConfig } from '@capacitor/cli';

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
    }
  },
  plugins: {
    Camera: {
      permissionPrompt: true,
      saveToGallery: true
    }
  }
};

export default config;
