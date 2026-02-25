import { useState, useEffect, useCallback } from 'react';
import { matchPigeon, getApiBaseUrl } from '../services/api';
import { UploadProgress, UploadStep } from './UploadProgress';
import type { MatchResponse } from '../types/api';

interface MatchResultProps {
  image: string;
  onReset: () => void;
  onBack: () => void;
  initialResult: MatchResponse | null;
  onResult: (result: MatchResponse) => void;
}

export function MatchResult({ image, onReset, onBack, initialResult, onResult }: MatchResultProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<MatchResponse | null>(initialResult);
  const [error, setError] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [uploadSteps, setUploadSteps] = useState<UploadStep[]>([
    { id: 1, label: 'Bild wird vorbereitet...', icon: '📷', status: 'pending' },
    { id: 2, label: 'Verbindung zum Server testen...', icon: '🔗', status: 'pending', detail: '' },
    { id: 3, label: 'Bild wird hochgeladen...', icon: '📤', status: 'pending', detail: '' },
    { id: 4, label: 'KI analysiert...', icon: '🤖', status: 'pending', detail: '' },
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const updateStep = (stepIndex: number, status: UploadStep['status'], detail?: string) => {
    setUploadSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status, ...(detail && { detail }) } : step
    ));
    if (status === 'active') setCurrentStep(stepIndex);
  };

  const performScan = useCallback(async () => {
    if (!image) return;

    setIsScanning(true);
    setError('');
    setCurrentStep(0);
    
    // Reset all steps
    setUploadSteps([
      { id: 1, label: 'Bild wird vorbereitet...', icon: '📷', status: 'active', detail: 'Base64-Kodierung' },
      { id: 2, label: 'Verbindung zum Server testen...', icon: '🔗', status: 'pending', detail: '' },
      { id: 3, label: 'Bild wird hochgeladen...', icon: '📤', status: 'pending', detail: '' },
      { id: 4, label: 'KI analysiert...', icon: '🤖', status: 'pending', detail: '' },
    ]);

    try {
      // Schritt 1: Bild vorbereiten
      await new Promise(resolve => setTimeout(resolve, 300)); // Kurze Verzögerung für UI
      updateStep(0, 'completed');
      
      // Schritt 2: Verbindung testen
      const baseUrl = await getApiBaseUrl();
      updateStep(1, 'active', `Prüfe: ${baseUrl}/health`);
      
      try {
        // Quick health check
        const healthResponse = await fetch(`${baseUrl}/health`, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        updateStep(1, 'completed', `Server antwortet (HTTP ${healthResponse.status})`);
      } catch (healthErr) {
        updateStep(1, 'error', 'Server nicht erreichbar');
        throw new Error('Server nicht erreichbar. Bitte überprüfe die Internet-Verbindung.');
      }
      
      // Schritt 3: Bild hochladen
      updateStep(2, 'active', `Sende an: ${baseUrl}/api/images/match`);
      
      const matchRequest = {
        photo: image,
        threshold: 0.80,
      };

      const response = await matchPigeon(matchRequest);
      updateStep(2, 'completed');
      
      // Schritt 4: Analyse
      updateStep(3, 'active', 'Verarbeite Ergebnis...');
      await new Promise(resolve => setTimeout(resolve, 200));
      updateStep(3, 'completed');
      
      setResult(response);
      onResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      
      // Markiere aktuellen Schritt als fehlerhaft
      if (currentStep < uploadSteps.length) {
        updateStep(currentStep, 'error', errorMessage);
      }
      
      console.error('Match error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [image, onResult, currentStep]);

  // Auto-scan on mount if no result
  useEffect(() => {
    if (!initialResult && image) {
      performScan();
    }
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'confidence-high';
    if (confidence >= 0.70) return 'confidence-medium';
    return 'confidence-low';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.85) return 'Sehr wahrscheinlich';
    if (confidence >= 0.70) return 'Wahrscheinlich';
    return 'Unwahrscheinlich';
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  if (isScanning) {
    return (
      <div className="card">
        <div className="loading-container">
          <div className="camera-container" style={{ aspectRatio: '1/1', maxWidth: '280px' }}>
            <img
              src={image}
              alt="Wird gescannt"
              className="camera-preview"
            />
            <div className="scan-overlay">
              <div className="scan-line" />
            </div>
          </div>

          <UploadProgress 
            steps={uploadSteps} 
            currentStep={currentStep} 
            error={error}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message">
          <strong>Fehler:</strong> {error}
        </div>

        <img
          src={image}
          alt="Aufgenommenes Foto"
          className="image-preview"
          style={{ marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-primary" onClick={performScan}>
            Erneut versuchen
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card">
        <div className="loading-container">
          <p className="card-text">Scan wird vorbereitet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-wrapper">
      <img
        src={image}
        alt="Aufgenommenes Foto"
        className="image-preview"
        style={{ marginBottom: '16px' }}
      />

      <div
        className={`card result-container ${
          result.match ? 'result-match' : 'result-no-match'
        }`}
      >
        {result.match ? (
          <>
            <h2 className="card-title" style={{ color: '#2E7D32' }}>
              🎉 Match gefunden!
            </h2>

            <div className={`confidence-badge ${getConfidenceColor(result.confidence)}`}>
              {getConfidenceText(result.confidence)} • {formatConfidence(result.confidence)}
            </div>

            {result.pigeon && (
              <>
                <div className="pigeon-card">
                  <img
                    src={result.pigeon.photo_url || '/placeholder-pigeon.png'}
                    alt={result.pigeon.name}
                    className="pigeon-photo"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-pigeon.png';
                    }}
                  />
                  <div className="pigeon-info">
                    <div className="pigeon-name">{result.pigeon.name}</div>
                    {result.pigeon.description && (
                      <div className="pigeon-details">{result.pigeon.description}</div>
                    )}
                    {result.pigeon.sightings_count !== undefined && (
                      <div className="pigeon-details">
                        📍 {result.pigeon.sightings_count} Sichtung{result.pigeon.sightings_count !== 1 && 'en'}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(!showDetails)}
                  style={{ marginTop: '12px' }}
                >
                  {showDetails ? 'Details ausblenden' : 'Details anzeigen'}
                </button>

                {showDetails && (
                  <div style={{ marginTop: '16px', textAlign: 'left' }}>
                    <p className="card-text">
                      <strong>ID:</strong> {result.pigeon.id}
                    </p>
                    {result.pigeon.first_seen && (
                      <p className="card-text">
                        <strong>Erste Sichtung:</strong>{' '}
                        {new Date(result.pigeon.first_seen).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="card-title" style={{ color: '#F57C00' }}>
              🤔 Kein Match gefunden
            </h2>

            <p className="card-text">
              Diese Taube ist in der Datenbank noch nicht bekannt.
            </p>

            {result.suggestion && (
              <p className="card-text" style={{ fontStyle: 'italic' }}>
                {result.suggestion}
              </p>
            )}

            {result.similar_pigeons && result.similar_pigeons.length > 0 && (
              <div className="similar-list">
                <h3>Ähnliche Tauben:</h3>
                {result.similar_pigeons.map((pigeon) => (
                  <div key={pigeon.id} className="similar-item">
                    <span className="similar-score">
                      {(result.similar_pigeons?.find(p => p.id === pigeon.id)?.sightings_count || 0) > 0
                        ? `${Math.round((result.confidence || 0) * 100)}%`
                        : 'Ähnlich'}
                    </span>
                    <span>{pigeon.name}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <button className="btn btn-primary" onClick={onReset}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z"/>
            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317a.75.75 0 0 0 .636.364 49.17 49.17 0 0 1 3.166 0c1.4.092 2.49 1.236 2.49 2.638v6.364c0 1.402-1.09 2.546-2.49 2.638a49.17 49.17 0 0 1-3.166 0 .75.75 0 0 0-.636.365l-.82 1.317a2.25 2.25 0 0 1-2.333 1.391 59.81 59.81 0 0 1-5.312 0 2.25 2.25 0 0 1-2.333-1.39l-.82-1.317a.75.75 0 0 0-.636-.365 49.17 49.17 0 0 1-3.166 0C1.09 17.546 0 16.402 0 15V8.638c0-1.402 1.09-2.546 2.49-2.638a49.17 49.17 0 0 1 3.166 0 .75.75 0 0 0 .636.364l.821-1.317A2.25 2.25 0 0 1 9.344 3.07ZM12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z"/>
          </svg>
          {result.match ? 'Nächste Taube scannen' : 'Erneut versuchen'}
        </button>

        <button className="btn btn-secondary" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" />
          </svg>
          Zurück
        </button>
      </div>
    </div>
  );
}
