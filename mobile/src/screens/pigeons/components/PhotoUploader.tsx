import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { useTheme } from '../../../theme';

interface PhotoUploaderProps {
  photo: string | null;
  onPhotoSelected: (uri: string) => void;
  error?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photo,
  onPhotoSelected,
  error,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    Alert.alert(
      'Foto hinzufügen',
      'Möchten Sie ein neues Foto aufnehmen oder eines aus der Galerie auswählen?',
      [
        {
          text: 'Kamera',
          onPress: takePhoto,
        },
        {
          text: 'Galerie',
          onPress: pickImage,
        },
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
      ]
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Berechtigung abgelehnt', 'Wir benötigen Kamerazugriff für diese Funktion.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="caption" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
        Foto
      </Text>
      
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.uploader,
          {
            borderColor: error ? theme.colors.error : theme.colors.outline,
            backgroundColor: theme.colors.surfaceVariant,
          },
        ]}
      >
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="camera" size={32} color={theme.colors.onSurfaceVariant} />
            <Text variant="body" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Foto hinzufügen
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text variant="caption" style={{ marginTop: 4, color: theme.colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  uploader: {
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
