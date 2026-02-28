import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCreatePigeon } from '../../../hooks/queries';

export interface PigeonFormData {
  name: string;
  ringNumber: string;
  photo: string | null;
  location: { lat: number; lng: number } | null;
}

const initialFormData: PigeonFormData = {
  name: '',
  ringNumber: '',
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

  const updateField = useCallback(<K extends keyof PigeonFormData>(field: K, value: PigeonFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
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

  const submit = useCallback(async () => {
    if (!validate()) return false;
    
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        ringNumber: formData.ringNumber || undefined,
        photo: formData.photo || undefined,
        location: formData.location || undefined,
      });
      
      navigation.goBack();
      return true;
    } catch (error) {
      return false;
    }
  }, [formData, validate, createMutation, navigation]);

  return {
    formData,
    errors,
    isSubmitting: createMutation.isPending,
    updateField,
    submit,
    setErrors,
  };
};
