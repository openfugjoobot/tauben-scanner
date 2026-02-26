/**
 * T8a: Pigeon List - PigeonCard Component
 * Displays a single pigeon item in the list
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Pigeon } from '../../types';

// ==================== Props ====================

interface PigeonCardProps {
  pigeon: Pigeon;
  onPress?: (pigeon: Pigeon) => void;
}

// ==================== Helper Functions ====================

/**
 * Format date to German locale
 */
const formatLastSeen = (dateString?: string): string => {
  if (!dateString) return 'Nie';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unbekannt';
  
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// ==================== Component ====================

export const PigeonCard: React.FC<PigeonCardProps> = ({ pigeon, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    onPress?.(pigeon);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isDark && styles.containerDark]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {pigeon.photo_url ? (
          <Image source={{ uri: pigeon.photo_url }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.placeholder, isDark && styles.placeholderDark]}>
            <MaterialCommunityIcons
              name="pigeon"
              size={28}
              color={isDark ? '#666' : '#BDC3C7'}
            />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>
          {pigeon.name}
        </Text>
        
        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color={isDark ? '#888' : '#95A5A6'}
          />
          <Text style={[styles.lastSeen, isDark && styles.lastSeenDark]}>
            {' '}
            {formatLastSeen(pigeon.first_seen)}
          </Text>
        </View>
      </View>

      {/* Arrow */}
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={isDark ? '#666' : '#BDC3C7'}
      />
    </TouchableOpacity>
  );
};

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  thumbnailContainer: {
    marginRight: 12,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7FA',
  },
  placeholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderDark: {
    backgroundColor: '#2C2C2E',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  nameDark: {
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSeen: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  lastSeenDark: {
    color: '#888',
  },
});

export default PigeonCard;
