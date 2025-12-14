import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { IxApplication, IxApplicationHeader, IxMenu, IxMenuItem, IxButton } from '@siemens/ix-react';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard/Dashboard';
import ProblemDetail from './components/RootCauseAnalysis/ProblemDetail';
import ModalTest from './components/ModalTest/ModalTest';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/', icon: 'home', label: 'Dashboard' },
    { id: 'modal-test', path: '/modal-test', icon: 'rocket', label: 'Modal Test' },
    { id: 'about', path: '/about', icon: 'info', label: 'About 8D' },
  ];

  return (
    <IxApplication>
  <IxApplicationHeader name="8D Problem Solving Platform">
    <div slot="logo">SIEMENS</div>
  </IxApplicationHeader>

  <IxMenu>
    {menuItems.map((item) => (
      <IxMenuItem
        key={item.id}
        tabIcon={item.icon}
        active={location.pathname === item.path}
        onClick={() => navigate(item.path)}
      >
        {item.label}
      </IxMenuItem>
    ))}
  </IxMenu>

  <ix-content>
  {location.pathname === '/' && (
    <ix-content-header slot="header" has-actions="true">
      <div slot="header-title">
        Problem Listesi & Tanımlama (D1–D2)
      </div>

      <div slot="header-subtitle">
        Tüm problemleri görüntüleyin ve yeni problem tanımlayın
      </div>

      {/* 🔴 KRİTİK KISIM */}
      <IxButton
        slot="header-actions"
        variant="primary"
        onClick={() =>
          window.dispatchEvent(new Event('open-add-problem-modal'))
        }
      >
        Yeni Problem Ekle
      </IxButton>
    </ix-content-header>
  )}

  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/problem/:id" element={<ProblemDetail />} />
    <Route path="/modal-test" element={<ModalTest />} />

  </Routes>
</ix-content>



</IxApplication>

  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
