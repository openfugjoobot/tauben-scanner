import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from "../../../theme";

interface ErrorViewProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry, onCancel }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.error }]}>Fehler aufgetreten</Text>
      <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>{error}</Text>
      
      <TouchableOpacity 
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]} 
        onPress={onRetry}
      >
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Erneut versuchen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
        <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Abbrechen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
