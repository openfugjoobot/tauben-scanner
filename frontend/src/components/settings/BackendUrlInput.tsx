import React, { useState } from 'react';
import { useSettingsHook } from '../../hooks/useSettings';
import './BackendUrlInput.css';

export const BackendUrlInput: React.FC = () => {
  const { backendUrl, setBackendUrl } = useSettingsHook();
  const [value, setValue] = useState(backendUrl);
  const [isValid, setIsValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValid(validateUrl(newValue));
    setShowCheck(false);
  };

  const handleBlur = async () => {
    if (isValid && value !== backendUrl) {
      setIsSaving(true);
      await setBackendUrl(value);
      setIsSaving(false);
      setShowCheck(true);
      
      // Hide checkmark after 2 seconds
      setTimeout(() => setShowCheck(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="backend-url-input">
      <label htmlFor="backend-url" className="setting-label">
        Backend URL
      </label>
      <div className={`input-wrapper ${!isValid ? 'invalid' : ''}`}>
        <input
          id="backend-url"
          type="url"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="https://tauben-scanner.fugjoo.duckdns.org/"
          className="setting-input"
        />
        {isSaving ? (
          <span className="input-status saving">
            <svg className="spinner" viewBox="0 0 24 24" width="20" height="20">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" 
                      strokeDasharray="31.416" strokeDashoffset="10" />
            </svg>
          </span>
        ) : showCheck ? (
          <span className="input-status success">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </span>
        ) : null}
      </div>
      {!isValid && (
        <p className="input-error">
          Bitte gib eine gültige URL ein
        </p>
      )}
      <p className="input-hint">
        Die URL des Backend-Servers für Bilderkennung und Datensynchronisation
      </p>
    </div>
  );
};
