import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from "../../../theme";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>{title}</Text>
      <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    paddingHorizontal: 4,
    opacity: 0.6,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  content: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e0e0e0',
  },
});
