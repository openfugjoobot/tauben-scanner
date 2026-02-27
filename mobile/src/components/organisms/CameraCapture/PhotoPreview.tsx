import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../../theme';

interface PhotoPreviewProps {
  photo: { uri: string; base64: string };
  onRetake: () => void;
  onConfirm: () => void;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  onRetake,
  onConfirm,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
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
