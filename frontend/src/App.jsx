import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { IxApplication, IxApplicationHeader, IxMenu, IxMenuItem, IxButton, IxContentHeader,IxContent, showModal } from '@siemens/ix-react';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard/Dashboard';
import ProblemDetail from './components/RootCauseAnalysis/ProblemDetail';
import AddProblemModal from './components/Dashboard/AddProblemModal';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  const menuItems = [
    { id: 'dashboard', path: '/', icon: 'home', label: 'Dashboard' },
  ];

  // Siemens iX Modal Pattern - Handle Add Problem
  const handleAddProblem = async () => {
    await showModal({
      content: <AddProblemModal onSuccess={handleProblemCreated} />,
      backdrop: true,
    });
  };

  const handleProblemCreated = () => {
    // Trigger dashboard refresh by updating key
    setRefreshKey(prev => prev + 1);
  };

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

  <IxContent>
  

  <Routes>
    <Route path="/" element={<Dashboard key={refreshKey} />} />
    <Route path="/problem/:id" element={<ProblemDetail />} />
  </Routes>
</IxContent>



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
