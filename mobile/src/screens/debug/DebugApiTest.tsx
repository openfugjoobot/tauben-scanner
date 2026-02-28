import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Button } from 'react-native';
import { Text } from 'react-native-paper';
import { apiClient } from '../../services/api';
import { usePigeons } from '../../hooks/queries';
import { useSettingsStore } from '../../stores/settings';
import { clearStorage, createMmkvStorage, StorageKeys } from '../../stores/storage';

export const DebugApiTest = () => {
  const [manualTest, setManualTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { apiUrl } = useSettingsStore();
  const { data, isLoading, isError, error: queryError, refetch } = usePigeons({ limit: 5 });

  const testManual = async () => {
    setLoading(true);
    setError(null);
    setManualTest(null);
    
    try {
      const result = await apiClient.get('/pigeons?page=1&limit=5');
      console.log('Manual test success:', result);
      setManualTest(result);
    } catch (err: any) {
      console.error('Manual test failed:', err);
      setError(err?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    const storage = createMmkvStorage();
    await storage.clear();
    console.log('Storage cleared!');
    alert('Storage cleared - Restart app!');
  };

  const resetSettings = () => {
    useSettingsStore.getState().resetSettings();
    alert('Settings reset to default');
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>🔧 Debug API Test</Text>
      
      <Text style={styles.section}>API URL:</Text>
      <Text variant="bodyLarge" style={styles.value}>{apiUrl}</Text>

      <Text style={styles.section}>React Query Hook:</Text>
      <Text>isLoading: {String(isLoading)}</Text>
      <Text>isError: {String(isError)}</Text>
      <Text>error: {queryError ? JSON.stringify(queryError, null, 2) : 'none'}</Text>
      <Text>data: {data ? JSON.stringify(data, null, 2).slice(0, 500) + '...' : 'null'}</Text>

      <Text style={styles.section}>Manual API Test:</Text>
      <Button title={loading ? "Testing..." : "Test API Call"} onPress={testManual} disabled={loading} />
      
      {manualTest && (
        <View style={styles.resultBox}>
          <Text style={{ color: 'green' }}>✅ Success!</Text>
          <Text>{JSON.stringify(manualTest, null, 2).slice(0, 1000)}</Text>
        </View>
      )}

      {error && (
        <View style={[styles.resultBox, { borderColor: 'red' }]}>
          <Text style={{ color: 'red' }}>❌ Error: {error}</Text>
        </View>
      )}

      <Text style={styles.section}>Storage Actions:</Text>
      <View style={styles.buttonGap}>
        <Button title="Clear Storage" onPress={clearCache} color="red" />
      </View>
      <View style={styles.buttonGap}>
        <Button title="Reset Settings" onPress={resetSettings} />
      </View>
      <View style={styles.buttonGap}>
        <Button title="Refetch Query" onPress={() => refetch()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  resultBox: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  buttonGap: {
    marginVertical: 5,
  },
});
