import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../services/api';
import './NetworkDebugPanel.css';

interface NetworkError {
  timestamp: string;
  error: string;
  url?: string;
}

export const NetworkDebugPanel: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<string>('');
  const [errors, setErrors] = useState<NetworkError[]>([]);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [checkDetails, setCheckDetails] = useState<string>('');

  useEffect(() => {
    loadErrors();
    checkHealth();
    getApiBaseUrl().then(url => setApiUrl(url));
  }, []);

  const loadErrors = () => {
    const stored = localStorage.getItem('network_errors');
    if (stored) {
      setErrors(JSON.parse(stored).slice(0, 5));
    }
  };

  const checkHealth = async () => {
    setServerStatus('checking');
    setCheckDetails('Verbindung wird getestet...');
    
    const url = await getApiBaseUrl();
    const healthUrl = `${url}/api/pigeons?limit=1`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('online');
        setCheckDetails(`✓ Server antwortet (HTTP ${response.status})`);
      } else {
        setServerStatus('offline');
        setCheckDetails(`✗ Server Fehler: HTTP ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setServerStatus('offline');
      const errorMsg = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setCheckDetails(`✗ Verbindung fehlgeschlagen: ${errorMsg}`);
    }
    
    setLastCheck(new Date().toLocaleTimeString());
  };

  const clearErrors = () => {
    localStorage.removeItem('network_errors');
    setErrors([]);
  };

  return (
    <div className="network-debug-panel">
      <h3>🔧 Netzwerk-Diagnose</h3>
      
      <div className="status-section">
        <div className="status-row">
          <span className="status-label">Server-Status:</span>
          <span className={`status-value ${serverStatus}`}`}>
            {serverStatus === 'checking' && '🟡 Wird geprüft...'}
            {serverStatus === 'online' && '🟢 Online'}
            {serverStatus === 'offline' && '🔴 Offline'}
          </span>
        </div>
        
        {lastCheck && (
          <div className="status-row">
            <span className="status-label">Letzte Prüfung:</span>
            <span className="status-detail">{lastCheck}</span>
          </div>
        )}
        
        <div className="status-row">
          <span className="status-label">API-URL:</span>
          <span className="status-detail url">{apiUrl}</span>
        </div>
      </div>

      {checkDetails && (
        <div className="check-details">
          {checkDetails}
        </div>
      )}

      <div className="button-row">
        <button onClick={checkHealth} className="test-button">
          🔄 Verbindung testen
        </button>
        <button onClick={clearErrors} className="clear-button">
          🗑️ Fehler löschen
        </button>
      </div>

      {errors.length > 0 && (
        <div className="errors-section">
          <h4>Letzte Fehler:</h4>
          <div className="error-list">
            {errors.map((err, idx) => (
              <div key={idx} className="error-item">
                <div className="error-time">{err.timestamp}</div>
                <div className="error-text">{err.error}</div>
                {err.url && <div className="error-url">URL: {err.url}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
