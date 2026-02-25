import React from 'react';
import { useSettingsHook } from '../../hooks/useSettings';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettingsHook();
  const { isDark, toggleTheme } = useTheme();

  const themeOptions: { value: 'light' | 'dark' | 'system'; label: string; icon: string }[] = [
    { value: 'light', label: 'Hell', icon: '☀️' },
    { value: 'dark', label: 'Dunkel', icon: '🌙' },
    { value: 'system', label: 'System', icon: '🖥️' },
  ];

  return (
    <div className="theme-toggle">
      <label className="setting-label">Design</label>
      
      <div className="theme-options">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            className={`theme-option ${theme === option.value ? 'active' : ''}`}
            onClick={() => setTheme(option.value)}
          >
            <span className="theme-icon">{option.icon}</span>
            <span className="theme-label">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="theme-quick-toggle">
        <button 
          className="quick-toggle-btn"
          onClick={toggleTheme}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            {isDark ? (
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
            ) : (
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.79 1.41-1.41-1.79-1.79-1.41 1.41zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
            )}
          </svg>
          <span>{isDark ? 'Hell' : 'Dunkel'}schalten</span>
        </button>
      </div>
    </div>
  );
};
