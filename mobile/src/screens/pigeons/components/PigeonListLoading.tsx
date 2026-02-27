import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { spacing } from '../../../theme/spacing';

export const PigeonListLoading: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSkeleton}>
        <Skeleton height={50} style={styles.searchBar} />
      </View>
      <ScrollView contentContainerStyle={styles.listContent}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={styles.cardSkeleton}>
            <Skeleton height={100} borderRadius={8} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSkeleton: {
    padding: spacing.md,
    backgroundColor: '#fff',
  },
  searchBar: {
    borderRadius: 8,
  },
  listContent: {
    padding: spacing.md,
  },
  cardSkeleton: {
    marginBottom: spacing.md,
  },
});
