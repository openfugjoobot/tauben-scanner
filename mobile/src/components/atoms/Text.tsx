import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  center?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color,
  center,
  style,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 };
      case 'h2':
        return { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 };
      case 'h3':
        return { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 };
      case 'body':
        return { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 };
      case 'caption':
        return { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 };
      case 'button':
        return { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 };
      default:
        return { fontSize: 16, fontWeight: '400' as const };
    }
  };

  return (
    <RNText
      style={[
        styles.base,
        getVariantStyle(),
        { color: color || theme.colors.onSurface },
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Inter-Regular',
  },
  center: {
    textAlign: 'center',
  },
});
