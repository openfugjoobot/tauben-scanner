import React from 'react';
import { useAddPigeon } from '../../contexts/AddPigeonContext';
import './StepIndicator.css';

export const StepIndicator: React.FC = () => {
  const { step, formData } = useAddPigeon();
  const steps = ['Foto & Info', 'Standort', 'Bestätigung'];

  return (
    <div className="step-indicator">
      <div className="step-progress-bar">
        <div 
          className="step-progress-fill" 
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      <div className="step-items">
        {steps.map((label, index) => {
          const isActive = index === step;
          const isCompleted = index < step;
          const isPhotoStep = index === 0;
          
          // Check if this step is valid
          let isValid = false;
          if (isPhotoStep) {
            isValid = !!formData.photo && !!formData.name && formData.name.length >= 2;
          }

          return (
            <div 
              key={index}
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="step-label">{label}</span>
              
              {isPhotoStep && isValid && isActive && (
                <span className="step-valid-indicator"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
