import { useState } from 'react';

interface PigeonFormData {
  name: string;
  ringNumber: string;
  color: string;
  notes: string;
}

export const useAddPigeonForm = () => {
  const [formData, setFormData] = useState<PigeonFormData>({
    name: '',
    ringNumber: '',
    color: '',
    notes: '',
  });

  const updateField = (field: keyof PigeonFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ringNumber: '',
      color: '',
      notes: '',
    });
  };

  const isValid = () => {
    return formData.name.trim().length > 0 && formData.color.trim().length > 0;
  };

  return {
    formData,
    updateField,
    resetForm,
    isValid,
  };
};
