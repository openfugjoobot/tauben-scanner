import React from 'react';
import type { PigeonFormData } from '../../validation/pigeonSchema';
import './SummaryCard.css';

interface SummaryCardProps {
  data: Partial<PigeonFormData>;
}

const colorLabels: Record<string, string> = {
  grau: 'Grau',
  weiß: 'Weiß',
  schwarz: 'Schwarz',
  bunt: 'Bunt',
  andere: 'Andere',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const hasLocation = data.location?.lat != null && data.location?.lng != null;

  return (
    <div className="summary-card">
      <h3 className="summary-title">Zusammenfassung</h3>
      
      <div className="summary-section">
        <h4>Foto</h4>
        {data.photo ? (
          <div className="summary-photo">
            <img src={data.photo} alt="Taube" />
          </div>
        ) : (
          <p className="summary-missing">Kein Foto</p>
        )}
      </div>

      <div className="summary-section">
        <h4>Informationen</h4>
        <dl className="summary-list">
          <div className="summary-item">
            <dt>Name:</dt>
            <dd>{data.name || '-'}</dd>
          </div>
          
          {data.description && (
            <div className="summary-item">
              <dt>Beschreibung:</dt>
              <dd className="summary-description">{data.description}</dd>
            </div>
          )}
          
          {data.color && (
            <div className="summary-item">
              <dt>Farbe:</dt>
              <dd>{colorLabels[data.color] || data.color}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="summary-section">
        <h4>Standort</h4>
        {hasLocation ? (
          <dl className="summary-list">
            {data.location?.name && (
              <div className="summary-item">
                <dt>Ort:</dt>
                <dd>{data.location.name}</dd>
              </div>
            )}
            <div className="summary-item">
              <dt>Koordinaten:</dt>
              <dd>
                {data.location!.lat!.toFixed(6)}, {data.location!.lng!.toFixed(6)}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="summary-missing">Kein Standort angegeben</p>
        )}
      </div>
    </div>
  );
};
