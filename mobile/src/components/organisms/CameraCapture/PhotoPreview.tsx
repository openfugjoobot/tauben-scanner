import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../../theme';

interface PhotoPreviewProps {
  photo: { uri: string; base64: string };
  onRetake: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  onRetake,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Cancel Button oben rechts */}
      {onCancel && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color="white"
          />
        </TouchableOpacity>
      )}

      <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="contain" />
      
      <View style={styles.controls}>
        <Button
          variant="outline"
          onPress={onRetake}
          style={styles.button}
        >
          Wiederholen
        </Button>
        <Button
          variant="primary"
          onPress={onConfirm}
          style={styles.button}
        >
          Bestätigen
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  preview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingBottom: 48,
  },
  button: {
    flex: 0.48,
  },
});
