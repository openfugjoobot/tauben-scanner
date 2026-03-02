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

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

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
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const convertPhotoToBase64 = async (photoUri: string): Promise<string | undefined> => {
    try {
      console.log('[usePigeonForm] Converting photo:', photoUri);

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(photoUri);
      if (!fileInfo.exists) {
        console.error('[usePigeonForm] Photo file does not exist');
        return undefined;
      }

      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('[usePigeonForm] Photo converted, size:', base64.length);
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('[usePigeonForm] Failed to convert photo:', error);
      return undefined;
    }
  };

  const submit = useCallback(async () => {
    console.log('[usePigeonForm] Submit called');

    if (!validate()) {
      console.log('[usePigeonForm] Validation failed');
      setSubmitStatus('error');
      setSubmitError('Bitte korrigieren Sie die markierten Felder.');
      return false;
    }

    setSubmitStatus('loading');
    setSubmitError(null);

    try {
      let photoBase64: string | undefined;

      if (formData.photo) {
        console.log('[usePigeonForm] Processing photo...');
        photoBase64 = await convertPhotoToBase64(formData.photo);
        console.log('[usePigeonForm] Photo processed:', photoBase64 ? 'success' : 'failed (gracefully skipped)');
        // If photo conversion fails, we continue without the photo (graceful degradation)
      }

      console.log('[usePigeonForm] Creating pigeon...');
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        photo: photoBase64,
        location: formData.location || undefined,
      });

      console.log('[usePigeonForm] Pigeon created successfully');
      setSubmitStatus('success');
      navigation.goBack();
      return true;
    } catch (error) {
      console.error('[usePigeonForm] Submit error:', error);
      setSubmitStatus('error');
      const message = error instanceof Error ? error.message : 'Speichern fehlgeschlagen. Bitte versuche es erneut.';
      setSubmitError(message);
      setErrors((prev) => ({ ...prev, name: 'Speichern fehlgeschlagen. Bitte versuche es erneut.' }));
      return false;
    }
  }, [formData, validate, createMutation, navigation]);

  return {
    formData,
    errors,
    isSubmitting: createMutation.isPending,
    submitStatus,
    submitError,
    updateField,
    submit,
    setErrors,
    resetSubmitStatus: () => {
      setSubmitStatus('idle');
      setSubmitError(null);
    },
  };
};
