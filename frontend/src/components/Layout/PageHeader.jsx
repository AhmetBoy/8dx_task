import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function PageHeader({ title, subtitle }) {
  const { isDarkMode, colors } = useTheme();

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e0e4e8'}`,
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: colors.text,
          fontWeight: '600'
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: 0,
            marginTop: '0.5rem',
            color: colors.textSecondary,
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeader;
