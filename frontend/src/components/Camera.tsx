import { useState, useRef, useCallback } from 'react';
import { Camera as CameraIcon, CameraResultType, CameraSource } from '@capacitor/camera';

interface CameraProps {
  onCapture: (imageBase64: string) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const takePhoto = useCallback(async () => {
    setIsCapturing(true);
    setError('');

    try {
      // Try to use Capacitor Camera plugin first
      const image = await CameraIcon.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024,
      });

      if (image.base64String) {
        const base64Image = `data:image/${image.format};base64,${image.base64String}`;
        setCapturedImage(base64Image);
      } else {
        throw new Error('No image data received');
      }
    } catch (err) {
      // Fallback for web/development
      console.log('Using web camera fallback:', err);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    setIsCapturing(true);
    setError('');

    try {
      const image = await CameraIcon.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
        width: 1024,
        height: 1024,
      });

      if (image.base64String) {
        const base64Image = `data:image/${image.format};base64,${image.base64String}`;
        setCapturedImage(base64Image);
      } else {
        throw new Error('No image data received');
      }
    } catch (err) {
      console.log('Using gallery fallback:', err);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
      };
      reader.onerror = () => {
        setError('Fehler beim Lesen der Datei');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage('');
    setError('');
  }, []);

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  return (
    <div className="camera-wrapper">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {!capturedImage ? (
        <div className="card">
          <h2 className="card-title">Taube fotografieren</h2>
          <p className="card-text">
            Drücke auf die Kamera, um ein Foto zu machen, oder wähle ein Bild aus der Galerie.
          </p>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={takePhoto}
              disabled={isCapturing}
              style={{ minHeight: '56px' }}
            >
              {isCapturing ? (
                <>
                  <div className="loading-spinner" style={{ width: '24px', height: '24px' }} />
                  Kamera wird geöffnet...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z"/>
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317a.75.75 0 0 0 .636.364 49.17 49.17 0 0 1 3.166 0c1.4.092 2.49 1.236 2.49 2.638v6.364c0 1.402-1.09 2.546-2.49 2.638a49.17 49.17 0 0 1-3.166 0 .75.75 0 0 0-.636.365l-.82 1.317a2.25 2.25 0 0 1-2.333 1.391 59.81 59.81 0 0 1-5.312 0 2.25 2.25 0 0 1-2.333-1.39l-.82-1.317a.75.75 0 0 0-.636-.365 49.17 49.17 0 0 1-3.166 0C1.09 17.546 0 16.402 0 15V8.638c0-1.402 1.09-2.546 2.49-2.638a49.17 49.17 0 0 1 3.166 0 .75.75 0 0 0 .636.364l.821-1.317A2.25 2.25 0 0 1 9.344 3.07ZM12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z"/>
                  </svg>
                  Foto machen
                </>
              )}
            </button>

            <button
              className="btn btn-secondary"
              onClick={pickFromGallery}
              disabled={isCapturing}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"/>
              </svg>
              Aus Galerie wählen
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2 className="card-title">Vorschau</h2>

          <img
            src={capturedImage}
            alt="Aufgenommenes Foto"
            className="image-preview"
            style={{ marginBottom: '16px' }}
          />

          <p className="card-text" style={{ marginBottom: '16px' }}>
            Möchtest du mit diesem Foto fortfahren?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" onClick={confirmPhoto}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" />
              </svg>
              Foto verwenden
            </button>

            <button className="btn btn-secondary" onClick={retakePhoto}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" />
              </svg>
              Neu aufnehmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
