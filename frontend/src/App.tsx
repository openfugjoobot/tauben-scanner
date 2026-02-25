import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AddPigeonProvider } from './contexts/AddPigeonContext';
import { TabBar } from './components/TabBar';
import { HomePage } from './components/HomePage';
import { AddPigeonPage } from './components/pigeon/AddPigeonPage';
import { SettingsPage } from './components/settings/SettingsPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AddPigeonProvider>
          <Router>
            <div className="app">
              <header className="app-header">
                <h1>🕊️ Tauben Scanner</h1>
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
