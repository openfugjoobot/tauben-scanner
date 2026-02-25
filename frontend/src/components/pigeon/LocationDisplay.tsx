import React from 'react';
import './LocationDisplay.css';

interface LocationDisplayProps {
  latitude: number | null;
  longitude: number | null;
  locationName?: string | null;
  accuracy?: number | null;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  latitude,
  longitude,
  locationName,
  accuracy,
}) => {
  if (latitude === null || longitude === null) {
    return null;
  }

  const formattedLat = latitude.toFixed(6);
  const formattedLng = longitude.toFixed(6);
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const lngDirection = longitude >= 0 ? 'E' : 'W';

  const formatAccuracy = (acc?: number | null): string => {
    if (acc == null) return '';
    if (acc < 10) return `${Math.round(acc)} m`;
    if (acc < 1000) return `${Math.round(acc)} m`;
    return `${(acc / 1000).toFixed(1)} km`;
  };

  const handleOpenMap = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const handleCopyCoordinates = async () => {
    const text = `${formattedLat}, ${formattedLng}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Konnte Koordinaten nicht kopieren:', err);
    }
  };

  return (
    <div className="location-display">
      <div className="location-header">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span className="location-title">Standort ermittelt</span>
      </div>
      
      {locationName && (
        <div className="location-name">{locationName}</div>
      )}
      
      <div className="location-coordinates">
        <div className="coordinate-row">
          <span className="coordinate-label">Breite:</span>
          <span className="coordinate-value">
            {Math.abs(latitude).toFixed(6)}° {latDirection}
          </span>
        </div>
        <div className="coordinate-row">
          <span className="coordinate-label">Länge:</span>
          <span className="coordinate-value">
            {Math.abs(longitude).toFixed(6)}° {lngDirection}
          </span>
        </div>
        
        {accuracy != null && (
          <div className="coordinate-row accuracy">
            <span className="coordinate-label">Genauigkeit:</span>
            <span className={`coordinate-value ${accuracy < 20 ? 'good' : accuracy < 100 ? 'medium' : 'poor'}`}>
              ±{formatAccuracy(accuracy)}
            </span>
          </div>
        )}
      </div>
      
      <div className="location-actions">
        <button className="location-action-btn" onClick={handleCopyCoordinates}>
          Kopieren
        </button>
        <button className="location-action-btn primary" onClick={handleOpenMap}>
          Auf Karte
        </button>
      </div>
    </div>
  );
};
