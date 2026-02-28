import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { useIsOnline } from '../../stores/app';
import { useTheme } from '../../theme';

export const OfflineBanner: React.FC = () => {
  const isOnline = useIsOnline();
  const theme = useTheme();

  if (isOnline) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.error }]}>
      <Icon name="wifi-off" size={16} color={theme.colors.onError} />
      <Text variant="caption" style={[styles.text, { color: theme.colors.onError }]}>
        Keine Internetverbindung
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  text: {
    fontWeight: '600',
  },
});
