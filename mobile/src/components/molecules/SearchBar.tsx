import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from '../atoms/Icon';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Suchen...',
  onSearch,
  debounceMs = 300,
  value: controlledValue,
}) => {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = useCallback((text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(text);
    }, debounceMs);

    setDebounceTimer(timer);
  }, [onSearch, debounceMs, controlledValue, debounceTimer]);

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onSearch('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Icon name="magnify" size={20} color={theme.colors.onSurfaceVariant} />
      <TextInput
        style={[styles.input, { color: theme.colors.onSurface }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        value={value}
        onChangeText={handleChange}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Icon
          name="close-circle"
          size={20}
          color={theme.colors.onSurfaceVariant}
          onPress={handleClear}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    padding: 0,
  },
});
