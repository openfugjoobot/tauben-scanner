import { useState, useCallback } from 'react';

interface UseMultiStepFormOptions {
  totalSteps: number;
  initialStep?: number;
}

export const useMultiStepForm = ({ totalSteps, initialStep = 0 }: UseMultiStepFormOptions) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isComplete, setIsComplete] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const complete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setIsComplete(false);
  }, [initialStep]);

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isComplete,
    complete,
    reset,
    progress,
    isFirstStep,
    isLastStep,
    totalSteps,
  };
};
