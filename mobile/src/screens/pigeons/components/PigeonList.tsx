import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ListRenderItem } from 'react-native';
import { PigeonCard } from '../../../components/molecules/PigeonCard';
import { spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme';
import { Pigeon } from '../../../services/api/apiClient.types';

interface PigeonListProps {
  pigeons: Pigeon[];
  onPigeonPress: (id: string) => void;
  onEndReached: () => void;
  isLoadingMore: boolean;
}

export const PigeonList: React.FC<PigeonListProps> = ({
  pigeons,
  onPigeonPress,
  onEndReached,
  isLoadingMore,
}) => {
  const theme = useTheme();

  const renderItem: ListRenderItem<Pigeon> = ({ item }) => (
    <PigeonCard
      pigeon={item}
      onPress={() => onPigeonPress(item.id)}
      style={styles.card}
    />
  );

  return (
    <FlatList
      data={pigeons}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  loaderContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
