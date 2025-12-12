import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, colors } = useTheme();

  const menuItems = [
    {
      id: 'dashboard',
      path: '/',
      icon: '📊',
      label: 'Dashboard',
      description: 'Problem Listesi'
    },
    {
      id: 'about',
      path: '/about',
      icon: 'ℹ️',
      label: 'About 8D',
      description: '8D Hakkında'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: isOpen ? '250px' : '70px',
          backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
          borderRight: `1px solid ${isDarkMode ? '#404040' : '#e0e4e8'}`,
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          transition: 'width 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e0e4e8'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minHeight: '70px'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#1976d2',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              flexShrink: 0
            }}
          >
            8D
          </div>
          {isOpen && (
            <span
              style={{
                color: colors.text,
                fontWeight: '600',
                fontSize: '1.1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              8D Platform
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          style={{
            position: 'absolute',
            top: '72px',
            right: '-5px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
            border: `2px solid ${isDarkMode ? '#555' : '#ddd'}`,
            color: colors.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            zIndex: 1001,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={isOpen ? 'Menüyü Daralt' : 'Menüyü Genişlet'}
        >
          {isOpen ? '◀' : '▶'}
        </button>

        {/* Menu Items */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              style={{
                width: '100%',
                padding: isOpen ? '1rem 1.5rem' : '1rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: isOpen ? 'flex-start' : 'center',
                backgroundColor: isActive(item.path)
                  ? isDarkMode ? '#3a3a3a' : '#f0f4f8'
                  : 'transparent',
                border: 'none',
                borderLeft: isActive(item.path) ? '4px solid #1976d2' : '4px solid transparent',
                color: colors.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '1rem',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#353535' : '#f5f7fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                {item.icon}
              </span>
              {isOpen && (
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: colors.textSecondary,
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Theme Toggle - Bottom */}
        <div
          style={{
            padding: isOpen ? '1rem 1.5rem' : '1rem 0',
            borderTop: `1px solid ${isDarkMode ? '#404040' : '#e0e4e8'}`,
            display: 'flex',
            justifyContent: isOpen ? 'flex-start' : 'center',
            alignItems: 'center'
          }}
        >
          {/* This will be moved here from the current position */}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
