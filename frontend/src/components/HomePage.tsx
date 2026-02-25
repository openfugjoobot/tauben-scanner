import { useState } from 'react';
import { Camera } from './Camera';
import { MatchResult } from './MatchResult';
import type { MatchResponse } from '../types/api';

type HomeScreen = 'home' | 'camera' | 'result';

export const HomePage: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<HomeScreen>('home');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);

  const handleCapture = (imageBase64: string) => {
    setCapturedImage(imageBase64);
    setCurrentScreen('result');
  };

  const handleScanComplete = (result: MatchResponse) => {
    setMatchResult(result);
  };

  const handleReset = () => {
    setCapturedImage('');
    setMatchResult(null);
    setCurrentScreen('camera');
  };

  const handleBack = () => {
    setCapturedImage('');
    setMatchResult(null);
    setCurrentScreen('home');
  };

  if (currentScreen === 'camera') {
    return <Camera onCapture={handleCapture} />;
  }

  if (currentScreen === 'result') {
    return (
      <MatchResult
        image={capturedImage}
        onReset={handleReset}
        onBack={handleBack}
        initialResult={matchResult}
        onResult={handleScanComplete}
      />
    );
  }

  // Home screen
  return (
    <div className="home-screen">
      <svg className="home-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#4CAF50" fillOpacity="0.2"/>
        <path d="M12 6C13.5 7.5 13.5 9 12 10.5C10.5 12 9 12 7.5 10.5" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16.5 8C18 9.5 18 11 16.5 12.5" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 12C14 14 14 16 12 18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="8" stroke="#4CAF50" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" fill="#4CAF50"/>
      </svg>
      
      <h1 className="home-title">Tauben Scanner</h1>
      
      <p className="home-subtitle">
        Identifiziere Tauben per Kamera. Erstelle eine Datenbank und finde Übereinstimmungen.
      </p>
      
      <button className="btn btn-primary" onClick={() => setCurrentScreen('camera')}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z"/>
          <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317a.75.75 0 0 0 .636.364 49.17 49.17 0 0 1 3.166 0c1.4.092 2.49 1.236 2.49 2.638v6.364c0 1.402-1.09 2.546-2.49 2.638a49.17 49.17 0 0 1-3.166 0 .75.75 0 0 0-.636.365l-.82 1.317a2.25 2.25 0 0 1-2.333 1.391 59.81 59.81 0 0 1-5.312 0 2.25 2.25 0 0 1-2.333-1.39l-.82-1.317a.75.75 0 0 0-.636-.365 49.17 49.17 0 0 1-3.166 0C1.09 17.546 0 16.402 0 15V8.638c0-1.402 1.09-2.546 2.49-2.638a49.17 49.17 0 0 1 3.166 0 .75.75 0 0 0 .636.364l.821-1.317A2.25 2.25 0 0 1 9.344 3.07ZM12 6.75a5.25 5.25 0 0 0-5.25 5.25c0 4.39 5.25 9.75 5.25 9.75s5.25-5.36 5.25-9.75A5.25 5.25 0 0 0 12 6.75Z"/>
        </svg>
        Taube scannen
      </button>
    </div>
  );
};
