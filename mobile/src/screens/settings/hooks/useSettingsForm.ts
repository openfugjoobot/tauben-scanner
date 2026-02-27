import { useState, useCallback } from 'react';
import { useSettingsStore } from '../../../stores/settings';

export const useSettingsForm = () => {
  const { apiUrl, apiKey, matchThreshold, setApiUrl, setApiKey, setMatchThreshold } = useSettingsStore();
  
  const [formData, setFormData] = useState({
    apiUrl,
    apiKey,
    matchThreshold,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(<K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.apiUrl.trim()) {
      newErrors.apiUrl = 'API URL ist erforderlich';
    } else if (!/^https?:\/\/.+/.test(formData.apiUrl)) {
      newErrors.apiUrl = 'Gültige URL erforderlich (http:// oder https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const save = useCallback(() => {
    if (!validate()) return false;
    
    setApiUrl(formData.apiUrl);
    setApiKey(formData.apiKey);
    setMatchThreshold(formData.matchThreshold);
    setIsDirty(false);
    return true;
  }, [formData, validate, setApiUrl, setApiKey, setMatchThreshold]);

  const reset = useCallback(() => {
    setFormData({ apiUrl, apiKey, matchThreshold });
    setErrors({});
    setIsDirty(false);
  }, [apiUrl, apiKey, matchThreshold]);

  return {
    formData,
    errors,
    isDirty,
    updateField,
    save,
    reset,
  };
};
