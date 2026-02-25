import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TabBar.css';

interface TabItem {
  path: string;
  icon: string;
  label: string;
}

const tabs: TabItem[] = [
  { path: '/', icon: '🏠', label: 'Start' },
  { path: '/add', icon: '➕', label: 'Neu' },
  { path: '/settings', icon: '⚙️', label: 'Einstell.' },
];

export const TabBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
