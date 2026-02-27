import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../atoms/Skeleton';
import { Card } from '../atoms/Card';

interface LoadingStateProps {
  count?: number;
  type?: 'list' | 'card' | 'detail';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  count = 3,
  type = 'list',
}) => {
  if (type === 'card') {
    return (
      <View style={styles.container}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} padding="medium" style={styles.card}>
            <View style={styles.cardContent}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <View style={styles.cardText}>
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
              </View>
            </View>
          </Card>
        ))}
      </View>
    );
  }

  if (type === 'detail') {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={200} />
        <View style={styles.detailContent}>
          <Skeleton width="70%" height={28} />
          <Skeleton width="50%" height={18} style={{ marginTop: 12 }} />
          <Skeleton width="100%" height={100} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  // Default list
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.listItem}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={styles.listText}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} style={{ marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
  },
  detailContent: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listText: {
    flex: 1,
    marginLeft: 12,
  },
});
