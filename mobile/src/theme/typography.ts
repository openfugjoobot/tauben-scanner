import { TextStyle } from 'react-native';

export const typography = {
  fontFamily: {
    regular: 'System', // Adjust if custom fonts are added later
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 12,
    small: 10,
  },
  lineHeight: {
    h1: 40,
    h2: 32,
    h3: 28,
    body: 24,
    caption: 16,
  },
};

export const fontVariants: Record<string, TextStyle> = {
  h1: {
    fontSize: typography.fontSize.h1,
    lineHeight: typography.lineHeight.h1,
    fontWeight: '700',
  },
  h2: {
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    fontWeight: '700',
  },
  h3: {
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    fontWeight: '600',
  },
  body: {
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    fontWeight: '400',
  },
  caption: {
    fontSize: typography.fontSize.caption,
    lineHeight: typography.lineHeight.caption,
    fontWeight: '400',
  },
};

export type Typography = typeof typography;
