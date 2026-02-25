import React from 'react';
import { useAddPigeon } from '../../contexts/AddPigeonContext';
import { usePigeonApi } from '../../hooks/usePigeonApi';
import { SummaryCard } from './SummaryCard';
import './Step3Confirmation.css';

export const Step3Confirmation: React.FC = () => {
  const { 
    formData, 
    goToStep,
    setIsSubmitting,
    setIsSuccess,
    setError,
    isSubmitting, 
    isSuccess
  } = useAddPigeon();
  
  const { createPigeon, error: apiError } = usePigeonApi();

  const submitForm = async () => {
    if (!formData.name || !formData.photo) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createPigeon({
        name: formData.name,
        description: formData.description,
        photo: formData.photo,
        location: formData.location || undefined,
        color: formData.color,
      });
      
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitError = apiError || null;

  // Erfolg zeigen
  if (isSuccess) {
    return (
      <div className="step-content success-step">
        <div className="success-animation">
          <div className="success-icon"></div>
        </div>
        
        <h2 className="success-title">Taube gespeichert!</h2>
        
        <p className="success-message">
          <strong>"{formData.name}"</strong> wurde erfolgreich 
          in der Datenbank registriert.
        </p>
        
        <div className="success-actions">
          <a href="/scan" className="btn btn-primary">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-2.22-1.21-4.15-3-5.19C15.11 6.12 13.56 5.5 12 5.5c-1.56 0-3.11.62-4.5 1.31C5.71 7.85 4.5 9.78 4.5 12c0 2.22 1.21 4.15 3 5.19C8.89 17.88 10.44 18.5 12 18.5c.56 0 1.1-.08 1.63-.22l.96.96a8.35 8.35 0 0 1-2.59.41c-2.47 0-4.74-1.1-6.3-2.85C3.04 14.46 2.5 12.78 2.5 12s.54-2.46 2.1-4.21C6.16 6.04 8.43 4.94 10.9 4.94c2.47 0 4.74 1.1 6.3 2.85 1.13 1.29 1.76 2.66 1.76 3.37 0 .33-.03.65-.07.97l-.96-.96z"/>
            </svg>
            Weitere Taube scannen
          </a>
          
          <a href="/" className="btn btn-secondary">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Zur Startseite
          </a>
        </div>
      </div>
    );
  }

  // Bestätigungsansicht
  return (
    <div className="step-content">
      <div className="confirmation-intro">
        <p>Bitte überprüfe die Daten bevor du speicherst:</p>
      </div>

      <SummaryCard data={formData} />

      {submitError && (
        <div className="submit-error">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {submitError}
        </div>
      )}

      <div className="step-actions confirmation-actions">
        <button 
          className="btn btn-text"
          onClick={() => goToStep(1)}
          disabled={isSubmitting}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Zurück
        </button>

        <button 
          className="btn btn-primary btn-full"
          onClick={submitForm}
          disabled={isSubmitting || !formData.name || !formData.photo}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Speichert...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14l-5-5 1.41-1.41L12 14.17l3.59-3.58L17 12l-5 5z"/>
              </svg>
              Taube speichern
            </>
          )}
        </button>
      </div>
    </div>
  );
};
