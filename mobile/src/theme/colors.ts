export const palette = {
  primary: '#4A90D9',
  primaryDark: '#6BB5FF',
  secondary: '#7B68EE',
  error: '#EF4444',
  errorDark: '#F87171',
  success: '#22C55E',
  successDark: '#4ADE80',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const lightColors = {
  primary: palette.primary,
  onPrimary: palette.white,
  secondary: palette.secondary,
  onSecondary: palette.white,
  background: '#FFFFFF',
  surface: '#F5F7FA',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  error: palette.error,
  onError: palette.white,
  success: palette.success,
  onSuccess: palette.white,
  outline: palette.gray[300],
};

export const darkColors = {
  primary: palette.primaryDark,
  onPrimary: palette.black,
  secondary: palette.secondary,
  onSecondary: palette.black,
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  error: palette.errorDark,
  onError: palette.black,
  success: palette.successDark,
  onSuccess: palette.black,
  outline: palette.gray[700],
};

export type ThemeColors = typeof lightColors;
