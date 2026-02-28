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
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      {result.match ? (
        <>
          <Text style={styles.title}>Taube erkannt!</Text>
          <Text style={styles.confidence}>Genauigkeit: {(result.confidence * 100).toFixed(1)}%</Text>
          {result.pigeon && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => result.pigeon?.id && onViewPigeon(result.pigeon.id)}
            >
              <Text style={styles.buttonText}>Details ansehen</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={styles.title}>Kein Treffer</Text>
          <Text style={styles.subtitle}>Diese Taube konnte nicht in der Datenbank gefunden werden.</Text>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={onScanAgain}
      >
        <Text style={styles.secondaryButtonText}>Erneut scannen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={onGoHome}
      >
        <Text style={styles.linkText}>Zurück zum Dashboard</Text>
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
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  confidence: {
    fontSize: 16,
    marginBottom: 32,
    color: "#2196F3",
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#2196F3",
  },
  secondaryButton: {
        borderWidth: 1,
    borderColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 12,
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
});
