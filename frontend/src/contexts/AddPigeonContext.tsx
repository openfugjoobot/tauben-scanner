import React, { createContext, useContext, useCallback, useState } from 'react';
import type { PigeonFormData, LocationData } from '../validation/pigeonSchema';

export type { PigeonFormData, LocationData };

interface AddPigeonState {
  step: number;
  formData: Partial<PigeonFormData>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface AddPigeonContextType extends AddPigeonState {
  // Actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<PigeonFormData>) => void;
  setPhoto: (photo: string) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: LocationData | null) => void;
  setIsPublic: (isPublic: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialFormData: Partial<PigeonFormData> = {
  name: '',
  description: '',
  photo: '',
  location: null,
  isPublic: false,
};

const initialState: AddPigeonState = {
  step: 0,
  formData: initialFormData,
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

const AddPigeonContext = createContext<AddPigeonContextType | undefined>(undefined);

export const AddPigeonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AddPigeonState>(initialState);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 2) }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  }, []);

  const updateFormData = useCallback((data: Partial<PigeonFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  }, []);

  const setPhoto = useCallback((photo: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, photo },
    }));
  }, []);

  const setName = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, name },
    }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, description },
    }));
  }, []);

  const setLocation = useCallback((location: LocationData | null) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, location: location || undefined },
    }));
  }, []);

  const setIsPublic = useCallback((isPublic: boolean) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, isPublic },
    }));
  }, []);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const setIsSuccess = useCallback((isSuccess: boolean) => {
    setState(prev => ({ ...prev, isSuccess }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <AddPigeonContext.Provider
      value={{
        ...state,
        goToStep,
        nextStep,
        prevStep,
        updateFormData,
        setPhoto,
        setName,
        setDescription,
        setLocation,
        setIsPublic,
        setIsSubmitting,
        setIsSuccess,
        setError,
        reset,
      }}
    >
      {children}
    </AddPigeonContext.Provider>
  );
};

export const useAddPigeon = (): AddPigeonContextType => {
  const context = useContext(AddPigeonContext);
  if (context === undefined) {
    throw new Error('useAddPigeon must be used within an AddPigeonProvider');
  }
  return context;
};
