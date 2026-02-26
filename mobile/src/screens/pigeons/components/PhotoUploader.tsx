import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
    // In a real app, this would open the image picker
    console.log('Open image picker');
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
