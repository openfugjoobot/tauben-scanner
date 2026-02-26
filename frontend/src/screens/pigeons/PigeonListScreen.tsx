import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getPigeons } from '../../services/api';
import type { Pigeon } from '../../types';

export const PigeonListScreen: React.FC = () => {
  const [pigeons, setPigeons] = useState<Pigeon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPigeons();
  }, []);

  const loadPigeons = async () => {
    try {
      setLoading(true);
      const data = await getPigeons();
      setPigeons(data);
    } catch (err) {
      setError('Fehler beim Laden der Tauben');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Pigeon }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>ID: {item.id}</Text>
      {item.confidence && (
        <Text style={styles.confidence}>Konfidenz: {item.confidence}%</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alle Tauben</Text>
      <FlatList
        data={pigeons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Keine Tauben gefunden</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 16 },
  list: { padding: 16 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 18, fontWeight: '600' },
  detail: { fontSize: 14, color: '#666', marginTop: 4 },
  confidence: { fontSize: 14, color: '#4CAF50', marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 32, color: '#999' },
});