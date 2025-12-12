import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ProblemDetail from './components/RootCauseAnalysis/ProblemDetail';

function AppContent() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: colors.background
      }}>
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          marginLeft: sidebarOpen ? '250px' : '70px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              zIndex: 9999,
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
              border: `2px solid ${isDarkMode ? '#555' : '#ddd'}`,
              color: isDarkMode ? '#e0e0e0' : '#000',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          {/* Page Content */}
          <div style={{
            flex: 1,
            padding: 'clamp(1rem, 3vw, 2rem)',
            paddingTop: 'clamp(1rem, 3vw, 2rem)',
            backgroundColor: colors.background
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/problem/:id" element={<ProblemDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
