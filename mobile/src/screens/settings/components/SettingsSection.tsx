import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from '../../../theme';
import { spacing } from '../../../theme/spacing';

interface SettingsSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  children,
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text 
        variant="labelMedium" 
        style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
      >
        {title}
      </Text>
      <Surface style={[styles.content, { backgroundColor: theme.colors.surface }]} elevation={0}>
        {children}
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  content: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});
