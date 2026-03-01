import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useCreatePigeon } from '../../../hooks/queries';

export interface PigeonFormData {
  name: string;
  description: string;
  photo: string | null;
  location: { lat: number; lng: number } | null;
}

const initialFormData: PigeonFormData = {
  name: '',
  description: '',
  photo: null,
  location: null,
};

export const usePigeonForm = (initialData?: Partial<PigeonFormData>) => {
  const navigation = useNavigation();
  const createMutation = useCreatePigeon();

  const [formData, setFormData] = useState<PigeonFormData>({
    ...initialFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PigeonFormData, string>>>({});

  const updateField = useCallback(<K extends keyof PigeonFormData>(
    field: K,
    value: PigeonFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof PigeonFormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const convertPhotoToBase64 = async (photoUri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (error) {
      console.error('Fehler beim Konvertieren:', error);
      throw new Error('Bild konnte nicht verarbeitet werden');
    }
  };

  const submit = useCallback(async () => {
    if (!validate()) return false;

    try {
      let photoBase64: string | undefined;

      if (formData.photo) {
        photoBase64 = await convertPhotoToBase64(formData.photo);
      }

      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        photo: photoBase64,
        location: formData.location || undefined,
      });

      navigation.goBack();
      return true;
    } catch (error) {
      return false;
    }
  }, [formData, validate, createMutation, navigation, convertPhotoToBase64]);

  return {
    formData,
    errors,
    isSubmitting: createMutation.isPending,
    updateField,
    submit,
    setErrors,
  };
};
