import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { useTheme } from '../../theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        size={64}
        color={theme.colors.onSurfaceDisabled}
        style={styles.icon}
      />
      <Text variant="h3" center style={styles.title}>
        {title}
      </Text>
      
      {message && (
        <Text variant="body" center color={theme.colors.onSurfaceVariant} style={styles.message}>
          {message}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    minWidth: 200,
  },
});
