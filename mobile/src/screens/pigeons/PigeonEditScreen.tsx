import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const PigeonEditScreen: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
