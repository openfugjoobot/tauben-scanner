import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Suchen',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <MaterialCommunityIcons
        name="magnify"
        size={24}
        color={theme.colors.onSurfaceVariant}
        style={styles.leadingIcon}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.onSurface }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        blurOnSubmit={false}
        returnKeyType="search"
      />
      
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} style={styles.trailingIcon}>
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  leadingIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    padding: 0,
  },
  trailingIcon: {
    marginLeft: 8,
    padding: 4,
  },
});
