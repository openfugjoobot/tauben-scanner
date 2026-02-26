import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useScanStore } from '../../stores/ScanStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CameraPreviewProps {
  photoUri: string;
  onRetake: () => void;
  onUsePhoto: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  photoUri,
  onRetake,
  onUsePhoto,
}) => {
  const { setPhoto, scan } = useScanStore();

  const handleRetake = useCallback(() => {
    useScanStore.getState().clearPhoto();
    onRetake();
  }, [onRetake]);

  const handleUsePhoto = useCallback(() => {
    setPhoto(photoUri);
    onUsePhoto();
  }, [photoUri, onUsePhoto, setPhoto]);

  const getFileSize = useCallback(async () => {
    // Returns file info in MB
    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const sizeInMB = blob.size / (1024 * 1024);
      return `${sizeInMB.toFixed(2)} MB`;
    } catch {
      return 'Größe unbekannt';
    }
  }, [photoUri]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vorschau</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
          <Text style={styles.badgeText}>Bild aufgenommen</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Möchtest du mit diesem Foto fortfahren?
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={handleRetake}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh"
            size={24}
            color="#FF3B30"
            style={styles.buttonIcon}
          />
          <Text style={styles.retakeButtonText}>Neu aufnehmen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.usePhotoButton}
          onPress={handleUsePhoto}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark"
            size={24}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.usePhotoButtonText}>Foto verwenden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F9ED',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#34C759',
    marginLeft: 4,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: SCREEN_WIDTH - 32,
    height: (SCREEN_WIDTH - 32) * (9 / 16),
    backgroundColor: '#1C1C1E',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  infoText: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  usePhotoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
  },
  usePhotoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});

export default CameraPreview;
