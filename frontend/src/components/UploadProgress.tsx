import React from 'react';
import './UploadProgress.css';

export type UploadStep = {
  id: number;
  label: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  detail?: string;
};

type UploadProgressProps = {
  steps: UploadStep[];
  currentStep: number;
  error?: string | null;
};

export const UploadProgress: React.FC<UploadProgressProps> = ({ steps, currentStep, error }) => {
  return (
    <div className="upload-progress-container">
      <h4>Scan wird durchgeführt...</h4>
      <div className="steps-list">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-item ${step.status}`}
          >
            <div className="step-icon">
              {step.status === 'active' && <span className="spinner">⟳</span>}
              {step.status === 'completed' && <span className="check">✓</span>}
              {step.status === 'error' && <span className="error-x">✗</span>}
              {step.status === 'pending' && <span className="pending">{step.icon}</span>}
            </div>
            <div className="step-content">
              <div className="step-label">{step.label}</div>
              {step.detail && step.status === 'active' && (
                <div className="step-detail">{step.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="error-message">
          <strong>Fehler:</strong> {error}
        </div>
      )}
    </div>
  );
};
