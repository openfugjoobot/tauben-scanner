import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms/Text';

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
  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.outerContainer}>
      <Container 
        style={styles.container} 
        onPress={onPress} 
        disabled={!onPress}
      >
        <View style={styles.row}>
          <Text variant="body" style={styles.label}>{label}</Text>
          {value && <Text variant="caption" style={styles.value}>{value}</Text>}
        </View>
        {children && <View style={styles.children}>{children}</View>}
      </Container>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#333',
    fontWeight: '500',
  },
  value: {
    color: '#666',
  },
  children: {
    marginTop: 8,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: -4,
  },
});
