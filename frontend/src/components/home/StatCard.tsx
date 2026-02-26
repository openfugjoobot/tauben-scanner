import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  value: string | number;
  label: string;
  color?: string;
  style?: ViewStyle;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color = '#4A90D9',
  style,
  isLoading = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <Text style={[styles.value, { color: isLoading ? '#95A5A6' : '#2C3E50' }]}>
        {isLoading ? '…' : value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
});
