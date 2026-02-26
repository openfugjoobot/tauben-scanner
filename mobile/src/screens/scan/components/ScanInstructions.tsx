import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ScanInstructions: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Richten Sie die Taube im Rahmen aus</Text>
      <Text style={styles.subtext}>Achten Sie auf gute Beleuchtung</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
