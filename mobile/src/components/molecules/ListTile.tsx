import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../atoms/Text';
import { useTheme } from '../../theme';

interface ListTileProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}

export const ListTile: React.FC<ListTileProps> = ({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
}) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {leading && <View style={styles.leading}>{leading}</View>}
      
      <View style={styles.content}>
        <Text variant="bodyLarge" numberOfLines={1} style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodyMedium" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.touchable, { backgroundColor: theme.colors.surface }]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  touchable: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leading: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  trailing: {
    marginLeft: 16,
  },
});
