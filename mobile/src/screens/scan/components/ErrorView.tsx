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
      <Text style={styles.title}>Fehler aufgetreten</Text>
      <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>{error}</Text>
      
      <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
        <Text style={styles.buttonText}>Erneut versuchen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
        <Text style={styles.secondaryButtonText}>Abbrechen</Text>
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
    color: '#D32F2F',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2196F3',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});
