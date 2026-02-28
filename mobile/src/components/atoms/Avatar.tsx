import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '?',
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 64;
      case 'xlarge': return 96;
      default: return 48;
    }
  };

  const sizeValue = getSize();
  const initials = name.charAt(0).toUpperCase();

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[
          styles.avatar,
          { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2, backgroundColor: theme.colors.surface },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: theme.colors.primary,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: sizeValue * 0.4, color: theme.colors.onPrimary }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    // backgroundColor now comes from theme
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
});
