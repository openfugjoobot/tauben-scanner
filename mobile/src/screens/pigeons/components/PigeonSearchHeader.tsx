import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar } from '../../../components/molecules/SearchBar';
import { Button } from '../../../components/atoms/Button';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from '../../../theme';
import { spacing } from '../../../theme/spacing';

interface PigeonSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddPress: () => void;
  resultCount: number;
}

export const PigeonSearchHeader: React.FC<PigeonSearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddPress,
  resultCount,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Tauben suchen..."
            value={searchQuery}
            onSearch={onSearchChange}
            debounceMs={300}
          />
        </View>
        
        <Button
          variant="primary"
          size="medium"
          icon="plus"
          onPress={onAddPress}
          style={styles.addButton}
        />
      </View>
      
      {searchQuery.length > 0 && (
        <Text variant="caption" color={theme.colors.onSurfaceVariant} style={styles.resultText}>
          {resultCount} {resultCount === 1 ? 'Ergebnis' : 'Ergebnisse'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  addButton: {
    minWidth: 48,
  },
  resultText: {
    marginTop: spacing.xs,
  },
});
