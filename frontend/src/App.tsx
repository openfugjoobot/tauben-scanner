import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AddPigeonProvider } from './contexts/AddPigeonContext';
import { TabBar } from './components/TabBar';
import { HomePage } from './components/HomePage';
import { AddPigeonPage } from './components/pigeon/AddPigeonPage';
import { SettingsPage } from './components/settings/SettingsPage';
import './App.css';

function App() {
  useEffect(() => {
    // Request permissions on app startup (Android 10+)
    if (Capacitor.isNativePlatform()) {
      checkAndRequestPermissions();
    }
  }, []);

  const checkAndRequestPermissions = async () => {
    try {
      console.log('🔍 Checking location permissions...');
      
      // Check current permission status
      const permission = await Geolocation.checkPermissions();
      console.log('📍 Location permission status:', permission);
      
      // Request if not granted
      if (permission.location !== 'granted') {
        console.log('🔄 Requesting location permission...');
        const request = await Geolocation.requestPermissions();
        console.log('✅ Location permission requested:', request);
      } else {
        console.log('✅ Location permission already granted');
      }
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
    }
  };

  return (
    <ThemeProvider>
      <SettingsProvider>
        <AddPigeonProvider>
          <Router>
            <div className="app">
              <header className="app-header">
                <h1>Tauben Scanner</h1>
              </header>
              
              <main className="app-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/add" element={<AddPigeonPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
              
              <TabBar />
            </div>
          </Router>
        </AddPigeonProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;