import { useCallback } from 'react';
import { useAddPigeon } from '../contexts/AddPigeonContext';
import { registerPigeon } from '../services/api';
import { validatePigeonForm } from '../validation/pigeonSchema';
import type { PigeonFormData } from '../validation/pigeonSchema';

export interface UseAddPigeonReturn {
  step: number;
  formData: Partial<PigeonFormData>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  canProceed: boolean;
  
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPhoto: (photo: string) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: { lat: number; lng: number; name?: string } | null) => void;
  setIsPublic: (isPublic: boolean) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
  validateStep: (step: number) => { valid: boolean; errors: Record<string, string> };
}

export const useAddPigeonForm = (): UseAddPigeonReturn => {
  const {
    step,
    formData,
    isSubmitting,
    isSuccess,
    error,
    goToStep,
    nextStep: contextNextStep,
    prevStep,
    setPhoto,
    setName,
    setDescription,
    setLocation,
    setIsPublic,
    setIsSubmitting,
    setIsSuccess,
    setError,
    reset,
  } = useAddPigeon();

  const validateStep = useCallback((stepIndex: number): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    switch (stepIndex) {
      case 0:
        if (!formData.photo || formData.photo.length === 0) {
          errors.photo = 'Bitte mache ein Foto der Taube';
        }
        if (!formData.name || formData.name.trim().length < 2) {
          errors.name = 'Name muss mindestens 2 Zeichen haben';
        }
        break;
      case 1:
        break;
      case 2:
        const result = validatePigeonForm(formData);
        if (!result.success && result.errors) {
          return { valid: false, errors: result.errors };
        }
        break;
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }, [formData]);

  const canProceed = validateStep(step).valid;

  const nextStep = useCallback(() => {
    const { valid } = validateStep(step);
    if (valid) {
      contextNextStep();
    }
  }, [step, validateStep, contextNextStep]);

  const submit = useCallback(async (): Promise<boolean> => {
    const result = validatePigeonForm(formData);
    if (!result.success) {
      setError('Bitte überprüfe deine Eingaben');
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const pigeonData = {
        name: result.data!.name,
        description: result.data!.description,
        photo: result.data!.photo,
        location: result.data!.location || undefined,
        is_public: result.data!.isPublic,
      };

      await registerPigeon(pigeonData);
      setIsSuccess(true);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, setError, setIsSubmitting, setIsSuccess]);

  return {
    step,
    formData,
    isSubmitting,
    isSuccess,
    error,
    canProceed,
    goToStep,
    nextStep,
    prevStep,
    setPhoto,
    setName,
    setDescription,
    setLocation,
    setIsPublic,
    submit,
    reset,
    validateStep,
  };
};
