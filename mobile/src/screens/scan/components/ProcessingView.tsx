import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from "../../../theme";

interface ProcessingViewProps {
  status?: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ status }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.text}>{status || 'Bild wird analysiert...'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
  },
});
