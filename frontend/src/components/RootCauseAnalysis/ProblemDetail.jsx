import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IxButton, IxCard, IxCardContent, IxSpinner } from '@siemens/ix-react';
import { problemsAPI, rootCausesAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../Layout/PageHeader';
import CauseTree from './CauseTree';

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

  const isMobile = window.innerWidth < 768;
  const { isDarkMode, colors } = useTheme();

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      <PageHeader
        title={problem.title}
        subtitle={`Sorumlu Ekip: ${problem.responsible_team} | Durum: ${problem.status === 'open' ? 'Açık' : 'Kapalı'}`}
      />

      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <IxButton outline onClick={() => navigate('/')}>
          ← Geri Dön
        </IxButton>
      </div>

      {/* Problem Description Card - Full Width */}
      <IxCard style={{
        marginBottom: '2rem',
        width: '100%',
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.cardShadow
      }}>
        <IxCardContent style={{ width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{
            margin: 0,
            marginBottom: '1rem',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: colors.text
          }}>
            Detaylı Açıklama (D2)
          </h3>
          <p style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            wordBreak: 'break-word',
            width: '100%',
            color: colors.text,
            lineHeight: '1.6'
          }}>
            {problem.description}
          </p>
        </IxCardContent>
      </IxCard>

      {/* Root Cause Analysis Card - Full Width */}
      <IxCard style={{
        width: '100%',
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.cardShadow
      }}>
        <IxCardContent style={{ width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
            width: '100%'
          }}>
            <div style={{ flex: '1', minWidth: '250px', maxWidth: '100%' }}>
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                color: colors.text
              }}>
                Kök Neden Analizi (D4-D5)
              </h2>
              <p style={{
                color: colors.textSecondary,
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                margin: 0,
                marginTop: '0.5rem'
              }}>
                5 Why Analysis - Problemin kök nedenini bulmak için "Neden?" sorusu sorun
              </p>
            </div>
            <IxButton onClick={handleAddRootCause}>
              Ana Sebep Ekle
            </IxButton>
          </div>

          {causes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: isMobile ? '2rem 1rem' : '3rem',
              backgroundColor: colors.sectionBackground,
              borderRadius: '4px'
            }}>
              <p style={{
                color: colors.textSecondary,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}>
                Henüz sebep eklenmemiş. "Ana Sebep Ekle" butonuna tıklayarak başlayın.
              </p>
            </div>
          ) : (
            <CauseTree causes={causes} onUpdate={fetchData} isDarkMode={isDarkMode} colors={colors} />
          )}
        </IxCardContent>
      </IxCard>
    </div>
  );
}

export default ProblemDetail;
