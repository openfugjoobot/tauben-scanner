import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Button } from '../../../components/atoms/Button';
import { spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme';

interface EmptyPigeonListProps {
  onAddPigeon: () => void;
}

export const EmptyPigeonList: React.FC<EmptyPigeonListProps> = ({ onAddPigeon }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.title}>
        Keine Tauben gefunden
      </Text>
      <Text variant="body" style={styles.message}>
        Es wurden keine Tauben gefunden. Füge eine neue Taube hinzu, um zu beginnen.
      </Text>
      <Button
        onPress={onAddPigeon}
        variant="primary"
        style={styles.button}
      >
        Taube hinzufügen
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    minWidth: 200,
  },
});
