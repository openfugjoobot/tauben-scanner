import React from 'react';
import { useSettingsHook } from '../../hooks/useSettings';
import './ThresholdSlider.css';

export const ThresholdSlider: React.FC = () => {
  const { matchThreshold, setMatchThreshold } = useSettingsHook();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) / 100;
    setMatchThreshold(value);
  };

  const getThresholdLabel = (threshold: number): string => {
    if (threshold >= 0.90) return 'Sehr streng';
    if (threshold >= 0.80) return 'Empfohlen';
    if (threshold >= 0.70) return 'Ausgewogen';
    if (threshold >= 0.60) return 'Tolerant';
    return 'Sehr tolerant';
  };

  const getThresholdColor = (threshold: number): string => {
    if (threshold >= 0.90) return '#F44336';
    if (threshold >= 0.80) return '#4CAF50';
    if (threshold >= 0.70) return '#FF9800';
    return '#2196F3';
  };

  return (
    <div className="threshold-slider">
      <label htmlFor="threshold" className="setting-label">
        Übereinstimmungsschwelle
      </label>
      
      <div className="slider-container">
        <input
          id="threshold"
          type="range"
          min="50"
          max="100"
          step="1"
          value={Math.round(matchThreshold * 100)}
          onChange={handleChange}
          className="slider"
          style={{
            '--threshold-color': getThresholdColor(matchThreshold)
          } as React.CSSProperties}
        />
        
        <div className="slider-labels">
          <span>50%</span>
          <span className="slider-value">
            {Math.round(matchThreshold * 100)}%
          </span>
          <span>100%</span>
        </div>
      </div>
      
      <div 
        className="threshold-indicator"
        style={{ color: getThresholdColor(matchThreshold) }}
      >
        {getThresholdLabel(matchThreshold)}
      </div>
      
      <p className="slider-hint">
        Höhere Werte = genauere Übereinstimmung erforderlich. 
        80% ist für die meisten Fälle empfohlen.
      </p>
    </div>
  );
};
