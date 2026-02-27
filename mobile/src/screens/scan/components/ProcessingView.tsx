import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ProcessingViewProps {
  status?: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ status }) => {
  return (
    <View style={styles.container}>
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
