import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IxButton, IxSpinner } from '@siemens/ix-react';
import { problemsAPI, rootCausesAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import CauseTree from './CauseTree';

/**
 * ProblemDetail Component
 *
 * Displays detailed view of a specific 8D problem with root cause analysis.
 * Uses Siemens iX Design System components:
 * - IxCard for content sections
 * - IxButton for actions
 * - IxSpinner for loading state
 *
 * Implements 5 Why Analysis for root cause investigation (D4-D5)
 */
function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [problemResponse, causesResponse] = await Promise.all([
        problemsAPI.getById(id),
        rootCausesAPI.getByProblemId(id)
      ]);

      if (problemResponse.data.success) {
        setProblem(problemResponse.data.data);
      }

      if (causesResponse.data.success) {
        setCauses(causesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRootCause = async () => {
    const causeText = prompt('Neden?');
    if (!causeText) return;

    try {
      const response = await rootCausesAPI.create({
        problem_id: parseInt(id),
        parent_id: null,
        cause_text: causeText,
        is_root_cause: false,
        order_index: causes.length
      });

      if (response.data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error adding cause:', error);
      alert('Sebep eklenirken hata oluştu');
    }
  };

  const { isDarkMode, colors } = useTheme();
  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <IxSpinner size="large" />
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Problem bulunamadı</p>
        <IxButton onClick={() => navigate('/')}>Geri Dön</IxButton>
      </div>
    );
  }

  return (
  <>
    {/* Sayfa Header */}
    <ix-content-header slot="header">
      <div slot="header-title">Problem Detayı</div>
      <div slot="header-subtitle">{problem.title}</div>
      <div slot="header-actions">
        <IxButton outline onClick={() => navigate('/')}>
          ← Geri Dön
        </IxButton>
      </div>
    </ix-content-header>

    {/* Ana İçerik – Dashboard ile AYNI PATTERN (Tam genişlik) */}
    <ix-layout-section>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h3 style={{ margin: 0 }}>
          5 Why / Kök Neden Analizi (D4-D5)
        </h3>
        {causes.length === 0 && (
          <IxButton variant="primary" onClick={handleAddRootCause}>
            + İlk Nedeni Ekle
          </IxButton>
        )}
      </div>

      {causes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
          borderRadius: '4px',
          border: `1px dashed ${isDarkMode ? '#555' : '#dee2e6'}`,
          width: '100%'
        }}>
          <p style={{
            margin: '0 0 1rem 0',
            fontSize: '16px',
            color: isDarkMode ? '#aaa' : '#666'
          }}>
            Henüz kök neden analizi başlatılmadı.
          </p>
          <p style={{
            margin: '0 0 1.5rem 0',
            fontSize: '14px',
            color: isDarkMode ? '#999' : '#777'
          }}>
            5 Why metoduyla problemin kök nedenini bulun.
          </p>
          <IxButton variant="primary" onClick={handleAddRootCause}>
            + İlk Nedeni Ekle
          </IxButton>
        </div>
      ) : (
        <CauseTree
          causes={causes}
          onUpdate={fetchData}
          isDarkMode={isDarkMode}
          colors={colors}
        />
      )}
    </ix-layout-section>
  </>
);



}

export default ProblemDetail;
