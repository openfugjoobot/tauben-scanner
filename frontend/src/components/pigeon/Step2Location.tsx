import React, { useState, useEffect } from 'react';
import { useAddPigeon } from '../../contexts/AddPigeonContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { LocationDisplay } from './LocationDisplay';
import './Step2Location.css';

export const Step2Location: React.FC = () => {
  const { formData, nextStep, prevStep, setLocation } = useAddPigeon();
  const { 
    location, 
    error, 
    isLoading, 
    permission,
    getCurrentPosition,
    reverseGeocode,
  } = useGeolocation({ timeout: 15000 });
  
  const [manualLocation, setManualLocation] = useState({
    lat: formData.location?.lat?.toString() || '',
    lng: formData.location?.lng?.toString() || '',
    name: formData.location?.name || '',
  });
  const [useManual, setUseManual] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Update manual location when GPS updates
  useEffect(() => {
    if (location.latitude && location.longitude && !useManual) {
      setManualLocation({
        lat: location.latitude.toString(),
        lng: location.longitude.toString(),
        name: location.locationName || '',
      });
    }
  }, [location, useManual]);

  const handleGetLocation = async () => {
    setIsLocating(true);
    await getCurrentPosition();
    setIsLocating(false);
    
    // Try to get location name if we have coordinates
    if (location.latitude && location.longitude) {
      await reverseGeocode(location.latitude, location.longitude);
    }
  };

  const handleManualChange = (field: keyof typeof manualLocation, value: string) => {
    const newLocation = { ...manualLocation, [field]: value };
    setManualLocation(newLocation);
    
    // Update form data if valid
    const lat = parseFloat(newLocation.lat);
    const lng = parseFloat(newLocation.lng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setLocation({
        lat,
        lng,
        name: newLocation.name || undefined,
      });
    }
  };

  const handleSkip = () => {
    setLocation(null);
    nextStep();
  };

  const handleNext = () => {
    if (useManual) {
      const lat = parseFloat(manualLocation.lat);
      const lng = parseFloat(manualLocation.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({
          lat,
          lng,
          name: manualLocation.name || undefined,
        });
      }
    }
    nextStep();
  };

  return (
    <div className="step-content">
      <div className="step-intro">
        <p>Wo hast du diese Taube gesehen? (optional)</p>
      </div>

      {!useManual ? (
        <>
          <button 
            className="btn btn-secondary location-action"
            onClick={handleGetLocation}
            disabled={isLocating || isLoading}
          >
            {isLocating || isLoading ? (
              <>
                <span className="spinner" />
                Standort wird ermittelt...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                </svg>
                Aktuellen Standort ermitteln
              </>
            )}
          </button>

          {location.latitude && location.longitude && (
            <LocationDisplay
              latitude={location.latitude}
              longitude={location.longitude}
              locationName={location.locationName}
              accuracy={location.accuracy}
            />
          )}

          {error && (
            <div className="location-error">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error.message}
            </div>
          )}

          {permission === 'denied' && (
            <p className="permission-help">
              Der Standortzugriff wurde verweigert. 
              Bitte erlaube den Zugriff in den Systemeinstellungen oder gib den Standort manuell ein.
            </p>
          )}
        </>
      ) : (
        <div className="manual-location">
          <div className="form-grid">
            <div className="form-group">
              <label>Breitengrad</label>
              <input
                type="number"
                step="any"
                value={manualLocation.lat}
                onChange={(e) => handleManualChange('lat', e.target.value)}
                placeholder="z.B. 52.520008"
              />
            </div>
            
            <div className="form-group">
              <label>Längengrad</label>
              <input
                type="number"
                step="any"
                value={manualLocation.lng}
                onChange={(e) => handleManualChange('lng', e.target.value)}
                placeholder="z.B. 13.404954"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Standortname (optional)</label>
            <input
              type="text"
              value={manualLocation.name}
              onChange={(e) => handleManualChange('name', e.target.value)}
              placeholder="z.B. Hauptbahnhof Berlin"
            />
          </div>
        </div>
      )}

      <button 
        className="btn btn-text toggle-mode"
        onClick={() => setUseManual(!useManual)}
      >
        {useManual ? 'GPS-Standort verwenden' : 'Oder manuell eingeben'}
      </button>

      <div className="step-actions">
        <button className="btn btn-secondary" onClick={prevStep}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Zurück
        </button>
        
        <div className="action-right">
          <button className="btn btn-text" onClick={handleSkip}>
            Überspringen
          </button>
          
          <button className="btn btn-primary" onClick={handleNext}>
            Weiter
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
