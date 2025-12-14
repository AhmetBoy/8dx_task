import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { applyPolyfills, defineCustomElements } from '@siemens/ix/loader';
import { IxApplicationContext } from '@siemens/ix-react';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/theme-overrides.css';

// Initialize Siemens iX Web Components
applyPolyfills().then(() => {
  defineCustomElements();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <IxApplicationContext>
        <App />
      </IxApplicationContext>
    </ThemeProvider>
  </React.StrictMode>,
);
