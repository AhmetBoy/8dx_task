import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IxButton, showModal } from '@siemens/ix-react';
import { AgGridReact } from 'ag-grid-react';
import { problemsAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import AddProblemModal from './AddProblemModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ag-grid-dark-theme.css';

/**
 * Dashboard Component
 *
 * Main dashboard displaying 8D problem list using AG-Grid.
 * Uses Siemens iX recommended pattern with showModal function.
 *
 * Pattern based on: ModalTest.jsx (Siemens iX documentation recommended pattern)
 */
function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  // AG-Grid column definitions
  const columnDefs = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      filter: 'agNumberColumnFilter',
      hide: isMobile,
    },
    {
      field: 'title',
      headerName: 'Problem Başlığı',
      flex: 2,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'responsible_team',
      headerName: 'Sorumlu Ekip (D1)',
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      hide: isMobile,
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: isMobile ? 100 : 120,
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => {
        const status = params.value;
        const color = status === 'open' ? '#ff6b6b' : '#51cf66';
        const text = status === 'open' ? 'Açık' : 'Kapalı';
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: color,
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {text}
          </span>
        );
      }
    },
    {
      field: 'created_at',
      headerName: 'Tarih',
      width: isMobile ? 110 : 180,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return isMobile
          ? date.toLocaleDateString('tr-TR')
          : date.toLocaleString('tr-TR');
      }
    },
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await problemsAPI.getAll();
      if (response.data.success) {
        setProblems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      alert('Problemler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (event) => {
    navigate(`/problem/${event.data.id}`);
  };

  // Siemens iX recommended pattern: showModal function
  const handleAddProblem = async () => {
    await showModal({
      content: <AddProblemModal onSuccess={handleProblemCreated} />,
      backdrop: true,
    });
  };

  const handleProblemCreated = async () => {
    // Refresh problem list after successful creation
    await fetchProblems();
  };

  return (
    <>
      <ix-layout-section>
        {/* Action Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
        }}>
          <IxButton variant="primary" onClick={handleAddProblem}>
            Yeni Problem Ekle
          </IxButton>
        </div>

        {/* AG-Grid Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            Yükleniyor...
          </div>
        ) : (
          <div
            className={isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
            style={{ width: '100%' }}
          >
            <AgGridReact
              rowData={problems}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={10}
              onRowClicked={handleRowClick}
              animateRows
              domLayout="autoHeight"
            />
          </div>
        )}
      </ix-layout-section>
    </>
  );
}

export default Dashboard;
