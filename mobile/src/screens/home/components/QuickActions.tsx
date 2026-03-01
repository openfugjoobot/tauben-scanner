import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { ScanButton } from '../../../components/molecules/ScanButton';
import { useTheme, spacing } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
          <TouchableOpacity 
            onPress={onAddPigeonPress}
            style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="plus" size={36} color={theme.colors.onSecondary} />
          </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
