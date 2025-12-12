import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Update body class and style for theme
    if (isDarkMode) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      document.body.style.backgroundColor = '#1e1e1e';
      document.body.style.color = '#e0e0e0';
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      document.body.style.backgroundColor = '#f5f7fa';
      document.body.style.color = '#000000';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Color scheme
  const colors = {
    text: isDarkMode ? '#e0e0e0' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    background: isDarkMode ? '#1e1e1e' : '#f5f7fa',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    sectionBackground: isDarkMode ? '#3a3a3a' : '#f8f9fa',
    border: isDarkMode ? '#404040' : '#dee2e6',
    cardBorder: isDarkMode ? '#404040' : '#e0e4e8',
    cardShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)',
    inputBg: isDarkMode ? '#3a3a3a' : '#ffffff',
    inputBorder: isDarkMode ? '#555555' : '#ccc',
    inputText: isDarkMode ? '#e0e0e0' : '#000000',
    statusOpen: isDarkMode ? '#ff8787' : '#ff6b6b',
    statusClosed: isDarkMode ? '#69db7c' : '#51cf66',
    errorBorder: isDarkMode ? '#ff8787' : '#ff6b6b',
    rootCause: '#ff6b6b',
    rootCauseBg: isDarkMode ? '#4a2828' : '#fff5f5',
    rootCauseBorder: isDarkMode ? '#ff8787' : '#ff6b6b',
    solutionBg: isDarkMode ? '#2a4a2a' : '#d3f9d8',
    solutionBorder: isDarkMode ? '#69db7c' : '#51cf66',
    solutionText: isDarkMode ? '#69db7c' : '#2b8a3e',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
