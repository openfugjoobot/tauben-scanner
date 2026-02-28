import { MD3LightTheme, MD3DarkTheme, configureFonts, MD3Theme } from 'react-native-paper';

export interface AppTheme extends MD3Theme {
  colors: MD3Theme['colors'] & {
    success: string;
    warning: string;
    info: string;
  };
}

import { lightColors, darkColors, palette, semanticColors } from './colors';
import { typography } from './typography';

const fontConfig = {
  displayLarge: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 57,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 45,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 22,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

declare module 'react-native-paper' {
  export interface MD3Colors {
    success: string;
    warning: string;
    info: string;
  }
}

export const paperLightTheme: AppTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    onPrimary: lightColors.onPrimary,
    secondary: lightColors.secondary,
    onSecondary: lightColors.onSecondary,
    background: lightColors.background,
    surface: lightColors.surface,
    onSurface: lightColors.text,
    onSurfaceVariant: lightColors.textSecondary,
    error: lightColors.error,
    onError: lightColors.onError,
    outline: lightColors.outline,
    success: semanticColors.success,
    warning: semanticColors.warning,
    info: semanticColors.info,
  },
};

export const paperDarkTheme: AppTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    background: darkColors.background,
    surface: darkColors.surface,
    onError: darkColors.onError,
    outline: darkColors.outline,
    error: semanticColors.error,
    success: semanticColors.success,
    warning: semanticColors.warning,
    info: semanticColors.info,
  },
};
