import { useColorScheme } from 'react-native';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { lightColors, darkColors, ThemeColors } from './colors';
import { spacing, borderRadius, shadows } from './spacing';
import { typography, fontVariants } from './typography';
import { paperLightTheme, paperDarkTheme } from './paperTheme';

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './paperTheme';
export * from './icons';

export const useAppTheme = () => {
  const scheme = useColorScheme();
  const colors: ThemeColors = scheme === 'dark' ? darkColors : lightColors;
  const paperTheme = scheme === 'dark' ? paperDarkTheme : paperLightTheme;

  return {
    colors,
    spacing,
    borderRadius,
    shadows,
    typography,
    fontVariants,
    paperTheme,
    isDark: scheme === 'dark',
  };
};

/**
 * Hook to access the current theme within components.
 * Returns the merged theme.
 */
export const useTheme = () => {
  const theme = usePaperTheme();
  return theme;
};
