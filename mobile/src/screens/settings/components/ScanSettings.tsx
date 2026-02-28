import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from '../../../theme';

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
    <SettingsSection title="Scan-Einstellungen">
      <SettingsItem label="Übereinstimmungsschwellenwert">
        <View style={styles.container}>
          <Text variant="caption" style={[styles.valueText, { color: theme.colors.onSurfaceVariant }]}>
            {matchThreshold.toFixed(0)}% Übereinstimmung erforderlich
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={matchThreshold}
            onSlidingComplete={onThresholdChange}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.outline}
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.labels}>
            <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>0%</Text>
            <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>50%</Text>
            <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>100%</Text>
          </View>
        </View>
      </SettingsItem>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  valueText: {
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
});
