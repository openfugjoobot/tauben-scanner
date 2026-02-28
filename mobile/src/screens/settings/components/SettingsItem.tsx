import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from "../../../theme";

interface SettingsItemProps {
  label: string;
  value?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  error?: string;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ 
  label, 
  value, 
  onPress, 
  children,
  error 
}) => {
  const theme = useTheme();
  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={[styles.outerContainer, { borderBottomColor: theme.colors.outline }]}>
      <Container 
        style={[styles.container, { backgroundColor: theme.colors.surface }]} 
        onPress={onPress} 
        disabled={!onPress}
      >
        <View style={styles.row}>
          <Text variant="body" style={[styles.label, { color: theme.colors.onSurface }]}>{label}</Text>
          {value && <Text variant="caption" style={[styles.value, { color: theme.colors.onSurfaceVariant }]}>{value}</Text>}
        </View>
        {children && <View style={styles.children}>{children}</View>}
      </Container>
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderBottomWidth: 1,
  },
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  value: {
  },
  children: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: -4,
  },
});
