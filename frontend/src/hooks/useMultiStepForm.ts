import { useCallback, useState, useRef, useEffect } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

interface UseMultiStepFormOptions<T> {
  steps: string[];
  initialData: T;
  validateStep?: (step: number, data: T) => ValidationErrors | null;
  onComplete?: (data: T) => void;
}

interface UseMultiStepFormReturn<T> {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  formData: T;
  errors: ValidationErrors;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  
  // Actions
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: number) => boolean;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  updateFields: (fields: Partial<T>) => void;
  setStepError: (errors: ValidationErrors) => void;
  clearErrors: () => void;
  resetForm: () => void;
  submitForm: () => void;
}

/**
 * Hook for managing multi-step forms with validation
 */
export function useMultiStepForm<T extends Record<string, any>>(
  options: UseMultiStepFormOptions<T>
): UseMultiStepFormReturn<T> {
  const { steps, initialData, validateStep, onComplete } = options;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const formDataRef = useRef(formData);
  
  // Keep ref in sync with state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const validateCurrentStep = useCallback((): boolean => {
    if (!validateStep) return true;
    
    const stepErrors = validateStep(currentStep, formDataRef.current);
    if (stepErrors) {
      setErrors(stepErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [currentStep, validateStep]);

  const nextStep = useCallback((): boolean => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        return true;
      }
    }
    return false;
  }, [currentStep, steps.length, validateCurrentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number): boolean => {
    if (step >= 0 && step < steps.length) {
      // Only allow going back, or going forward if current step is valid
      if (step < currentStep || validateCurrentStep()) {
        setCurrentStep(step);
        setErrors({});
        return true;
      }
    }
    return false;
  }, [currentStep, steps.length, validateCurrentStep]);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const updateFields = useCallback((fields: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
    }));
    // Clear errors for updated fields
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(fields).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  const setStepError = useCallback((newErrors: ValidationErrors) => {
    setErrors(newErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  const submitForm = useCallback(() => {
    if (validateCurrentStep()) {
      onComplete?.(formData);
    }
  }, [formData, onComplete, validateCurrentStep]);

  return {
    currentStep,
    totalSteps: steps.length,
    stepName: steps[currentStep],
    formData,
    errors,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    progress: ((currentStep + 1) / steps.length) * 100,
    nextStep,
    prevStep,
    goToStep,
    updateField,
    updateFields,
    setStepError,
    clearErrors,
    resetForm,
    submitForm,
  };
}
