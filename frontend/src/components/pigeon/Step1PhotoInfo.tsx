import React, { useState } from 'react';
import { useAddPigeon } from '../../contexts/AddPigeonContext';
import { PhotoCapture } from './PhotoCapture';
import './Step1PhotoInfo.css';

interface FormErrors {
  name?: string;
  photo?: string;
}

export const Step1PhotoInfo: React.FC = () => {
  const { formData, nextStep, setName, setDescription, setPhoto } = useAddPigeon();
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ name?: boolean }>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.photo || formData.photo.length === 0) {
      newErrors.photo = 'Bitte mache ein Foto der Taube';
    }
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name muss mindestens 2 Zeichen haben';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (touched.name && errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    if (formData.name && formData.name.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name muss mindestens 2 Zeichen haben' }));
    }
  };

  return (
    <div className="step-content">
      <div className="step-section">
        <label className="step-label">
          Foto der Taube
          {!formData.photo && <span className="required">*</span>}
        </label>
        <PhotoCapture 
          photo={formData.photo || null}
          onCapture={setPhoto}
          onClear={() => setPhoto('')}
          error={errors.photo}
        />
      </div>

      <div className="step-section">
        <label htmlFor="pigeon-name" className="step-label">
          Name
          <span className="required">*</span>
        </label>
        <input
          id="pigeon-name"
          type="text"
          value={formData.name || ''}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          placeholder="z.B. Hans der Tauber"
          className={`step-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="step-section">
        <label htmlFor="pigeon-description" className="step-label">
          Beschreibung
          <span className="optional">(optional)</span>
        </label>
        <textarea
          id="pigeon-description"
          value={formData.description || ''}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Besondere Merkmale, Verhalten, etc."
          rows={4}
          maxLength={500}
          className="step-textarea"
        />
        <div className="char-count">
          {(formData.description || '').length}/500
        </div>
      </div>

      <div className="step-actions">
        <button 
          className="btn btn-primary btn-full"
          onClick={handleNext}
          disabled={!formData.photo || !formData.name || formData.name.length < 2}
        >
          Weiter
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
