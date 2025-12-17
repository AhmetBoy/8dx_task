import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IxButton, IxSpinner, IxContentHeader, IxContent, IxTypography, Modal, IxModalHeader, IxModalContent, IxModalFooter, IxMessageBar, IxTextarea, showModal, showToast } from '@siemens/ix-react';
import { problemsAPI, rootCausesAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import CauseTree from './CauseTree';

/**
 * AddCauseModal Component
 *
 * Siemens iX Modal Pattern - Modal for adding causes with text input
 */
export function AddCauseModal({ title = "Yeni Neden Ekle", placeholder = "Neden açıklamasını yazın...", onConfirm }) {
  const modalRef = useRef(null);
  const [causeText, setCauseText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!causeText.trim()) {
      setError('Lütfen bir açıklama yazın');
      return;
    }
    modalRef.current?.close(causeText);
    onConfirm(causeText);
  };

  const handleCancel = () => {
    modalRef.current?.dismiss();
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={handleCancel}>
        {title}
      </IxModalHeader>
      <IxModalContent>
        <IxTextarea
          value={causeText}
          onInput={(e) => {
            setCauseText(e.target.value);
            setError('');
          }}
          name="cause"
          label="Neden Açıklaması *"
          placeholder={placeholder}
          textareaRows={4}
          helperText={error || "Neden açıklamasını yazın"}
        ></IxTextarea>
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={handleCancel}>
          İptal
        </IxButton>
        <IxButton onClick={handleConfirm}>
          Ekle
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}

export function DeleteCauseConfirmationModal({ causeText, onConfirm }) {
  const modalRef = useRef(null);

  const handleConfirm = () => {
    modalRef.current?.close(true);
    onConfirm();
  };

  const handleCancel = () => {
    modalRef.current?.dismiss(false);
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={handleCancel}>
        Problem Silme Onayı
      </IxModalHeader>
      <IxModalContent>
        Bu problemi silmek istediğinize emin misiniz?
        ⚠️ Bu işlem geri alınamaz ve tüm kök neden analizi de silinecektir.
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={handleCancel}>
          İptal
        </IxButton>
        <IxButton onClick={handleConfirm}>
          Evet, Sil
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}

function DeleteConfirmationModal({ problemTitle, onConfirm }) {
  const modalRef = useRef(null);

  const handleConfirm = () => {
    modalRef.current?.close(true);
    onConfirm();
  };

  const handleCancel = () => {
    modalRef.current?.dismiss(false);
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={handleCancel}>
        Problem Silme Onayı
      </IxModalHeader>
      <IxModalContent>
        Bu problemi silmek istediğinize emin misiniz?
        ⚠️ Bu işlem geri alınamaz ve tüm kök neden analizi de silinecektir.
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={handleCancel}>
          İptal
        </IxButton>
        <IxButton onClick={handleConfirm}>
          Evet, Sil
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}


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
      showToast({
        message: 'Veri yüklenirken hata oluştu',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProblem = async () => {
    // Siemens iX Modal Pattern - Confirmation dialog
    const confirmed = await showModal({
      content: <DeleteConfirmationModal
        problemTitle={problem.title}
        onConfirm={async () => {
          try {
            const response = await problemsAPI.delete(id);

            if (response.data.success) {
              // Success - navigate to home
              navigate('/');
            }
          } catch (error) {
            console.error('Error deleting problem:', error);
            showToast({
              message: 'Problem silinirken hata oluştu: ' + (error.response?.data?.message || error.message),
              type: 'error'
            });
          }
        }}
      />,
      backdrop: true,
    });
  };

  const handleAddRootCause = async () => {
    // Siemens iX Modal Pattern - Add Cause Modal
    await showModal({
      content: <AddCauseModal
        title="İlk Nedeni Ekle"
        placeholder="İlk neden açıklamasını yazın..."
        onConfirm={async (causeText) => {
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
            showToast({
              message: 'Sebep eklenirken hata oluştu',
              type: 'error'
            });
          }
        }}
      />,
      backdrop: true,
    });
  };

  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
        <IxSpinner size="large"/>
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
      <IxMessageBar persistent>Henüz kök neden analizi başlatılmadı. İlk nedeni ekleyerek başlayın.</IxMessageBar>
    ) : (
        <CauseTree
          causes={causes}
          onUpdate={fetchData}
          isDarkMode={isDarkMode}
        />
      )}
    
    </IxContent>
  </>
);




}

export default ProblemDetail;
