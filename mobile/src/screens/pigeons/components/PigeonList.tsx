import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator
} from 'react-native';
import { spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme';
import { Pigeon } from '../../../services/api/apiClient.types';
import { ListTile } from '../../../components/molecules/ListTile';
import { Avatar } from '../../../components/atoms/Avatar';
import { Text } from '../../../components/atoms/Text';

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

  const renderItem = ({ item }: { item: Pigeon }) => {
    const subtitle = item.description 
      ? `${item.description.substring(0, 40)}${item.description.length > 40 ? '...' : ''}`
      : `${item.sightingsCount} Sichtung${item.sightingsCount !== 1 ? 'en' : ''}`;
    
    return (
      <ListTile
        leading={
          <Avatar 
            source={item.photoUrl} 
            name={item.name} 
            size="medium" 
          />
        }
        title={item.name}
        subtitle={subtitle}
        trailing={
          item.sightingsCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]} >
              <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
                {item.sightingsCount}
              </Text>
            </View>
          ) : null
        }
        onPress={() => onPigeonPress(item.id)}
      />
    );
  };

  return (
    <FlatList
      data={pigeons}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
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
    paddingBottom: spacing.xl + 80, // Platz für FAB
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: spacing.md,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  loaderContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
