import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 'medium',
  elevation = 'small',
}) => {
  const theme = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return 8;
      case 'large': return 24;
      default: return 16;
    }
  };

  const getElevation = () => {
    switch (elevation) {
      case 'none': return 0;
      case 'small': return 2;
      case 'large': return 8;
      default: return 4;
    }
  };

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          padding: getPadding(),
          borderRadius: 12,
          shadowColor: theme.colors.onSurface,
          shadowOffset: { width: 0, height: (getElevation() as number) > 0 ? 2 : 0 },
          shadowOpacity: (getElevation() as number) > 0 ? 0.1 : 0,
          shadowRadius: getElevation() as number,
          elevation: getElevation() as number,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
