import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SettingsSection } from './SettingsSection';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from '../../../theme';
import { spacing } from '../../../theme/spacing';

interface ScanSettingsProps {
  matchThreshold: number;
  onThresholdChange: (value: number) => void;
}

export const ScanSettings: React.FC<ScanSettingsProps> = ({
  matchThreshold,
  onThresholdChange,
}) => {
  const theme = useTheme();

  return (
    <SettingsSection 
      title="Scan-Einstellungen" 
      icon="camera-outline"
    >
      <View style={styles.item}>
        <View style={styles.header}>
          <Text variant="bodyLarge">Übereinstimmungsschwelle</Text>
          <Text 
            variant="labelLarge" 
            style={{ color: theme.colors.primary }}
          >
            {matchThreshold.toFixed(0)}%
          </Text>
        </View>
        
        <Text 
          variant="bodyMedium" 
          style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.sm }}
        >
          Erhöht die Empfindlichkeit der Bilderkennung
        </Text>

        <View style={styles.sliderContainer}>
          <MaterialCommunityIcons
            name="magnify-minus"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
          
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={matchThreshold}
            onSlidingComplete={onThresholdChange}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.secondaryContainer}
            thumbTintColor={theme.colors.primary}
          />
          
          <MaterialCommunityIcons
            name="magnify-plus"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
        
        <View style={styles.labels}>
          <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>
            0%
          </Text>
          <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>
            50%
          </Text>
          <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>
            100%
          </Text>
        </View>
      </View>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: spacing.sm,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
});
