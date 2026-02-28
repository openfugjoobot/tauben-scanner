import React from "react";
import { useTheme } from "../../../theme";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { Pigeon } from "../../../services/api/apiClient.types";

interface MatchResult {
  match: boolean;
  pigeon: Pigeon | null;
  confidence: number;
  message: string;
  isNewPigeon: boolean;
}

interface MatchResultViewProps {
  result: MatchResult;
  onViewPigeon: (id: string) => void;
  onScanAgain: () => void;
  onGoHome: () => void;
}

export const MatchResultView: React.FC<MatchResultViewProps> = ({
  result,
  onViewPigeon,
  onScanAgain,
  onGoHome,
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {result.match ? (
        <>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Taube erkannt!</Text>
          <Text style={[styles.confidence, { color: theme.colors.primary }]}>Genauigkeit: {(result.confidence * 100).toFixed(1)}%</Text>
          {result.pigeon && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => result.pigeon?.id && onViewPigeon(result.pigeon.id)}
            >
              <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Details ansehen</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Kein Treffer</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Diese Taube konnte nicht in der Datenbank gefunden werden.</Text>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.primary }]}
        onPress={onScanAgain}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Erneut scannen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={onGoHome}
      >
        <Text style={[styles.linkText, { color: theme.colors.onSurfaceVariant }]}>Zurück zum Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  confidence: {
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 12,
  },
  linkText: {
    fontSize: 14,
  },
});
