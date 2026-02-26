import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { Text } from '../../../components/atoms/Text';
import { ScanButton } from '../../../components/molecules/ScanButton';
import { useTheme } from '../../../theme';
// @ts-ignore
import { spacing } from '../../../theme/spacing';

interface QuickActionsProps {
  onScanPress: () => void;
  onAddPigeonPress: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onScanPress,
  onAddPigeonPress,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Schnellaktionen
      </Text>
      
      <View style={styles.actionsRow}>
        <View style={styles.actionItem}>
          <ScanButton onPress={onScanPress} />
          <Text variant="caption" style={styles.actionLabel}>
            Scannen
          </Text>
        </View>
        
        <View style={styles.actionItem}>
          <Button
            variant="secondary"
            size="large"
            icon="plus"
            onPress={onAddPigeonPress}
            style={styles.addButton}
          />
          <Text variant="caption" style={styles.actionLabel}>
            Hinzufügen
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionLabel: {
    marginTop: 8,
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
});
