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
          <Text variant="body2" style={styles.valueText}>
            {(matchThreshold * 100).toFixed(0)}% Vertrauen erforderlich
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={matchThreshold}
            onSlidingComplete={onThresholdChange}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={theme.colors.primary}
          />
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
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
