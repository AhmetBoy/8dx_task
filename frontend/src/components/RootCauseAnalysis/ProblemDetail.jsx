import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IxButton, IxSpinner,IxContentHeader,IxContent, IxCardContent, IxCard, IxTypography, IxIcon } from '@siemens/ix-react';
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

  const handleDeleteProblem = async () => {
    // Confirmation dialog
    const confirmMessage = `Bu problemi silmek istediğinize emin misiniz?\n\nProblem: ${problem.title}\n\nBu işlem geri alınamaz ve tüm kök neden analizi de silinecektir.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await problemsAPI.delete(id);

      if (response.data.success) {
        alert('Problem başarıyla silindi');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      alert('Problem silinirken hata oluştu: ' + (error.response?.data?.message || error.message));
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
  <ix-layout-section>
  <IxContent>
    <IxContentHeader
      has-back-button
      header-title="5 Why / Kök Neden Analizi (D4–D5)"
      header-subtitle="Subtitle"
      style={{ marginBottom: '1rem'}}
      onBackButtonClick={() => navigate('/')}>
      <IxButton
            outline
            variant="secondary"
            onClick={handleDeleteProblem}
            style={{ marginRight: 8 }}>
            Problemi Sil
      </IxButton>
      {causes.length === 0 && (
          <IxButton variant="primary" onClick={handleAddRootCause}>
            + İlk Nedeni Ekle
          </IxButton>
        )}
    </IxContentHeader>
    
    
    
      {causes.length === 0 ? (
    <IxCard variant="filled" padding={isMobile ? 'small' : 'large'} style={{ marginBottom: '1rem', width: '100%' }}>
      <IxCardContent>
        <IxTypography bold>Henüz kök neden analizi başlatılmadı.</IxTypography>
        
      </IxCardContent>
    </IxCard>
    ) : (
        <CauseTree
          causes={causes}
          onUpdate={fetchData}
          isDarkMode={isDarkMode}
          colors={colors}
        />
      )}
    
    
      
      
    </IxContent>
    </ix-layout-section>
  </>
);




}

export default ProblemDetail;
