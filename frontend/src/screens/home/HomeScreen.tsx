import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const stats = {
    totalPigeons: 42,
    sightingsToday: 7,
    lastScan: '2 Stunden',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="home" size={48} color="#4A90D9" />
        <Text style={styles.title}>Willkommen bei Tauben Scanner</Text>
        <Text style={styles.subtitle}>KI-gestützte Taubenerkennung</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="pigeon" size={32} color="#4A90D9" />
          <Text style={styles.statNumber}>{stats.totalPigeons}</Text>
          <Text style={styles.statLabel}>Registrierte Tauben</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="camera" size={32} color="#4A90D9" />
          <Text style={styles.statNumber}>{stats.sightingsToday}</Text>
          <Text style={styles.statLabel}>Sichtungen heute</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="clock-outline" size={32} color="#4A90D9" />
          <Text style={styles.statNumber}>{stats.lastScan}</Text>
          <Text style={styles.statLabel}>Letzter Scan</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Schnellzugriff</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ScanTab')}
        >
          <MaterialCommunityIcons name="camera-iris" size={24} color="white" />
          <Text style={styles.actionButtonText}>Neue Sichtung scannen</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('PigeonsTab')}
        >
          <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#4A90D9" />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Alle Tauben anzeigen
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  actionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4A90D9',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#4A90D9',
  },
});
