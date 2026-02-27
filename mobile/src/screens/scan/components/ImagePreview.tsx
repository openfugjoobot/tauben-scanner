import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ImagePreviewProps {
  photo: { uri: string; base64: string };
  onRetake: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  photo,
  onRetake,
  onConfirm,
  isProcessing,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="cover" />
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.retakeButton]} 
          onPress={onRetake}
          disabled={isProcessing}
        >
          <Text style={styles.retakeText}>Wiederholen</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton]} 
          onPress={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmText}>Analysieren</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  retakeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  retakeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
