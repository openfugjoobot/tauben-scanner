import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.onSurface;

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={iconColor}
      onPress={onPress}
      style={style}
    />
  );
};
