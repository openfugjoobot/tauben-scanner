import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../../../components/atoms/Input';
import { PhotoUploader } from './PhotoUploader';
import { LocationPicker } from './LocationPicker';
import { PigeonFormData } from '../hooks/usePigeonForm';
import { useTheme } from '../../../theme';

interface PigeonFormProps {
  formData: PigeonFormData;
  errors: Partial<Record<keyof PigeonFormData, string>>;
  onFieldChange: <K extends keyof PigeonFormData>(field: K, value: PigeonFormData[K]) => void;
}

export const PigeonForm: React.FC<PigeonFormProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]} contentContainerStyle={styles.content}>
      <PhotoUploader
        photo={formData.photo}
        onPhotoSelected={(uri) => onFieldChange('photo', uri)}
        error={errors.photo}
      />
      
      <Input
        label="Name"
        placeholder="Geben Sie den Namen der Taube ein"
        value={formData.name}
        onChangeText={(text) => onFieldChange('name', text)}
        error={errors.name}
        autoCapitalize="words"
      />
      
      <Input
        label="Beschreibung"
        placeholder="Kurze Beschreibung der Taube (Farbe, Merkmale)"
        value={formData.description}
        onChangeText={(text) => onFieldChange('description', text)}
        error={errors.description}
        autoCapitalize="sentences"
      />
      
      
      <LocationPicker
        location={formData.location}
        onLocationSelected={(lat, lng) => onFieldChange('location', { lat, lng })}
        error={errors.location}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
