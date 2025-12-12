import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IxButton, IxCard, IxCardContent } from '@siemens/ix-react';
import { AgGridReact } from 'ag-grid-react';
import { problemsAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../Layout/PageHeader';
import AddProblemModal from './AddProblemModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ag-grid-dark-theme.css';

function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Theme context
  const { isDarkMode, colors } = useTheme();
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

  const handleProblemCreated = () => {
    setShowModal(false);
    fetchProblems();
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      <PageHeader
        title="Problem Listesi & Tanımlama (D1-D2)"
        subtitle="Tüm problemleri görüntüleyin ve yeni problem tanımlayın"
      />

      {/* Action Button */}
      <div style={{
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <IxButton onClick={() => setShowModal(true)}>
          Yeni Problem Ekle
        </IxButton>
      </div>

      {/* Card - Full Width */}
      <IxCard style={{
        width: '100%',
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.cardShadow
      }}>
        <IxCardContent>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: colors.text }}>
              Yükleniyor...
            </div>
          ) : (
            <div
              className={isDarkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
              style={{
                height: 'calc(100vh - 300px)',
                minHeight: '400px',
                width: '100%',
                maxWidth: '100%'
              }}
            >
              <AgGridReact
                rowData={problems}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                onRowClicked={handleRowClick}
                rowStyle={{ cursor: 'pointer' }}
                animateRows={true}
                suppressHorizontalScroll={false}
                domLayout='normal'
              />
            </div>
          )}
        </IxCardContent>
      </IxCard>

      {showModal && (
        <AddProblemModal
          onClose={() => setShowModal(false)}
          onSuccess={handleProblemCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;
