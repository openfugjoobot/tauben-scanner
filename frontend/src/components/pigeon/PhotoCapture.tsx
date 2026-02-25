import React, { useState, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './PhotoCapture.css';

interface PhotoCaptureProps {
  photo: string | null;
  onCapture: (photoBase64: string) => void;
  onClear: () => void;
  error?: string;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photo,
  onCapture,
  onClear,
  error
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSize, setCapturedSize] = useState<string>('');

  const capturePhoto = useCallback(async () => {
    setIsCapturing(true);
    
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        source: CameraSource.Prompt, // Ermöglicht Kamera oder Galerie
        resultType: CameraResultType.Base64,
        width: 1024, // Maximale Breite für Performance
        height: 1024,
      });

      if (image.base64String) {
        // Prüfe Dateigröße (max 5MB)
        const sizeInBytes = (image.base64String.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        if (sizeInMB > 5) {
          alert('Das Bild ist zu groß. Bitte wähle ein kleineres Bild.');
          setIsCapturing(false);
          return;
        }

        setCapturedSize(`${sizeInMB.toFixed(2)} MB`);
        
        // Füge Data-URL Präfix hinzu
        const mimeType = image.format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const photoDataUrl = `data:${mimeType};base64,${image.base64String}`;
        onCapture(photoDataUrl);
      }
    } catch (err) {
      // Benutzer hat abgebrochen - kein Fehler
      if ((err as Error).message?.includes('cancelled') || 
          (err as Error).message?.includes('dismissed')) {
        console.log('Foto-Aufnahme abgebrochen');
      } else {
        console.error('Fehler beim Aufnehmen des Fotos:', err);
        alert('Fehler beim Aufnehmen des Fotos: ' + (err as Error).message);
      }
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture]);

  const handleClear = useCallback(() => {
    setCapturedSize('');
    onClear();
  }, [onClear]);

  if (photo) {
    return (
      <div className="photo-capture">
        <div className="photo-preview-container">
          <img 
            src={photo} 
            alt="Aufgenommene Taube" 
            className="photo-preview"
          />
          <div className="photo-info">
            <span className="photo-badge">✓ Foto aufgenommen</span>
            {capturedSize && <span className="photo-size">{capturedSize}</span>}
          </div>
          <button 
            className="photo-retake-btn"
            onClick={handleClear}
            title="Neues Foto aufnehmen"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v3l-4-4 4-4v3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            </svg>
            Neues Foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`photo-capture ${error ? 'has-error' : ''}`}>
      <button 
        className={`photo-capture-btn ${isCapturing ? 'capturing' : ''}`}
        onClick={capturePhoto}
        disabled={isCapturing}
      >
        {isCapturing ? (
          <>
            <span className="spinner" />
            <span>Wird aufgenommen...</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-2.22-1.21-4.15-3-5.19C15.11 6.12 13.56 5.5 12 5.5c-1.56 0-3.11.62-4.5 1.31C5.71 7.85 4.5 9.78 4.5 12c0 2.22 1.21 4.15 3 5.19C8.89 17.88 10.44 18.5 12 18.5c.56 0 1.1-.08 1.63-.22l.96.96a8.35 8.35 0 0 1-2.59.41c-2.47 0-4.74-1.1-6.3-2.85C3.04 14.46 2.5 12.78 2.5 12s.54-2.46 2.1-4.21C6.16 6.04 8.43 4.94 10.9 4.94c2.47 0 4.74 1.1 6.3 2.85 1.13 1.29 1.76 2.66 1.76 3.37 0 .33-.03.65-.07.97l-.96-.96z"/>
              <path d="M20 6h-2.18c.27-.32.47-.68.58-1.08.15-.56-.07-1.15-.53-1.45L16.11 2.4c-.38-.26-.84-.4-1.31-.4h-1.6c-.47 0-.93.14-1.31.4l-1.56 1.07c-.46.3-.68.89-.53 1.45.11.4.31.76.58 1.08H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-12 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm10-5c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5z"/>
            </svg>
            <span>Foto aufnehmen</span>
            <span className="photo-hint">Kamera oder Galerie</span>
          </>
        )}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};
