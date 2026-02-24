import { useState, useEffect, useCallback } from 'react';
import { matchPigeon } from '../services/api';
import { getEmbeddingFromBase64 } from '../services/embedding';
import type { MatchResponse, Pigeon } from '../types/api';

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

  const performScan = useCallback(async () => {
    if (!image) return;

    setIsScanning(true);
    setError('');

    try {
      // Try to extract embedding on device (optional optimization)
      let embedding: number[] | undefined;
      try {
        embedding = await getEmbeddingFromBase64(image);
      } catch (e) {
        console.log('Client embedding extraction failed, using server-side:', e);
      }

      // Send to API for matching
      const matchRequest = {
        photo: image,
        ...(embedding && { embedding }),
        threshold: 0.80,
      };

      const response = await matchPigeon(matchRequest);
      setResult(response);
      onResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      console.error('Match error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [image, onResult]);

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

          <div className="loading-spinner" />
          <p className="card-text">Taube wird analysiert...</p>

          <p className="card-text" style={{ fontSize: '0.875rem', marginTop: '8px' }}>
            KI extrahiert Merkmale und vergleicht mit Datenbank
          </p>
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
