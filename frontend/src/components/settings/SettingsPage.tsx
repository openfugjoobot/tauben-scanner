import React from 'react';
import { useSettingsHook } from '../../hooks/useSettings';
import { ThemeToggle } from './ThemeToggle';
import { BackendUrlInput } from './BackendUrlInput';
import { ThresholdSlider } from './ThresholdSlider';
import { AppInfo } from './AppInfo';
import { NetworkDebugPanel } from '../NetworkDebugPanel';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const { 
    isLoading, 
    resetSettings,
    matchThreshold 
  } = useSettingsHook();

  if (isLoading) {
    return (
      <div className="settings-page loading">
        <div className="settings-skeleton">
          <div className="skeleton-header" />
          <div className="skeleton-item" />
          <div className="skeleton-item" />
          <div className="skeleton-item" />
        </div>
      </div>
    );
  }

  const handleReset = async () => {
    if (window.confirm('Möchtest du alle Einstellungen auf die Standardwerte zurücksetzen?')) {
      await resetSettings();
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Einstellungen</h1>
      </header>

      <div className="settings-content">
        <section className="settings-section">
          <h2>Allgemein</h2>
          <ThemeToggle />
        </section>

        <section className="settings-section">
          <h2>Server</h2>
          <BackendUrlInput />
        </section>

        <section className="settings-section">
          <h2>Erkennung</h2>
          <ThresholdSlider />
          <p className="setting-description">
            Aktueller Schwellenwert: {Math.round(matchThreshold * 100)}%
          </p>
        </section>

        <section className="settings-section">
          <h2>🔧 Netzwerk-Diagnose</h2>
          <NetworkDebugPanel />
        </section>

        <section className="settings-section">
          <h2>Über</h2>
          <AppInfo />
        </section>

        <div className="settings-actions">
          <button 
            className="btn btn-danger"
            onClick={handleReset}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            Einstellungen zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
};
