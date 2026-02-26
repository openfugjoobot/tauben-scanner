import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { useTheme } from '../../theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Fehler aufgetreten',
  message = 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
  onRetry,
  icon = 'alert-circle-outline',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        size={64}
        color={theme.colors.error}
        style={styles.icon}
      />
      <Text variant="h3" center style={styles.title}>
        {title}
      </Text>
      <Text variant="body" center color={theme.colors.onSurfaceVariant} style={styles.message}>
        {message}
      </Text>
      
      {onRetry && (
        <Button variant="primary" onPress={onRetry} style={styles.button}>
          Erneut versuchen
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
