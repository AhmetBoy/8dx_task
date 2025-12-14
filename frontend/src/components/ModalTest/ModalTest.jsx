import { useState, useRef } from 'react';
import { IxButton, IxCard, IxCardContent, IxModal, IxModalHeader, IxModalContent, IxModalFooter, showModal } from '@siemens/ix-react';
import { useTheme } from '../../contexts/ThemeContext';

function ModalTest() {
  const { colors } = useTheme();
  const modalRef1 = useRef(null);
  const modalRef2 = useRef(null);
  const [showStateModal, setShowStateModal] = useState(false);

  // Test 1: Ref ile showModal() metodu
  const handleTest1 = () => {
    console.log('Test 1: Ref ile showModal()');
    if (modalRef1.current) {
      modalRef1.current.showModal();
    }
  };

  // Test 2: Ref ile backdrop prop'u
  const handleTest2 = () => {
    console.log('Test 2: Ref ile backdrop prop');
    if (modalRef2.current) {
      modalRef2.current.showModal();
    }
  };

  // Test 3: State ile conditional rendering
  const handleTest3 = () => {
    console.log('Test 3: State ile conditional rendering');
    setShowStateModal(true);
  };

  // Test 4: showModal function (imperative API)
  const handleTest4 = async () => {
    console.log('Test 4: showModal function');
    try {
      const instance = await showModal({
        content: (
          <>
            <IxModalHeader>Test Modal - showModal Function</IxModalHeader>
            <IxModalContent>
              <div style={{ padding: '2rem' }}>
                <p style={{ color: colors.text, marginBottom: '1rem' }}>
                  Bu modal showModal() function ile açıldı.
                </p>
                <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                  Size: 480px, backdrop ile açılmalı.
                </p>
              </div>
            </IxModalContent>
            <IxModalFooter>
              <IxButton onClick={() => instance.close()}>Kapat</IxButton>
            </IxModalFooter>
          </>
        ),
        size: '480',
        backdrop: true
      });
      console.log('Modal instance:', instance);
    } catch (error) {
      console.error('showModal error:', error);
      alert('showModal hatası: ' + error.message);
    }
  };

  // Test 5: Siemens iX Pure Modal (Sadece iX componentleri)
  const handleTest5 = async () => {
    console.log('Test 5: Pure iX Modal');
    try {
      const instance = await showModal({
        content: (
          <>
            <IxModalHeader>Pure iX Modal</IxModalHeader>
            <IxModalContent>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ color: colors.text, marginBottom: '1rem' }}>
                  Tamamen Siemens iX Component'leri
                </h3>
                <p style={{ color: colors.text }}>
                  Bu modal sadece iX component'leri kullanıyor.
                </p>
              </div>
            </IxModalContent>
            <IxModalFooter>
              <IxButton outline onClick={() => instance.close()}>İptal</IxButton>
              <IxButton onClick={() => {
                alert('Kaydet tıklandı!');
                instance.close();
              }}>Kaydet</IxButton>
            </IxModalFooter>
          </>
        ),
        size: '720',
        backdrop: true,
        closeOnBackdropClick: true
      });
    } catch (error) {
      console.error('Pure iX Modal error:', error);
      alert('Hata: ' + error.message);
    }
  };

  return (
    <>
      {/* CONTENT HEADER: Siemens iX native header component */}
      <ix-content-header>
        <div slot="header-title">Modal Test Sayfası</div>
        <div slot="header-subtitle">Siemens iX Modal component'ini farklı yöntemlerle test ediyoruz</div>
      </ix-content-header>

      {/*
        TEST GRID
        - NO width constraints - uses full available width
        - Grid layout for test cards
      */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Test 1 */}
        <IxCard style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow: colors.cardShadow
        }}>
          <IxCardContent>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: colors.text }}>
              Test 1: Ref + showModal()
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
              IxModal ref ile, showModal() metodu kullanarak
            </p>
            <IxButton onClick={handleTest1}>Aç</IxButton>
          </IxCardContent>
        </IxCard>

        {/* Test 2 */}
        <IxCard style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow: colors.cardShadow
        }}>
          <IxCardContent>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: colors.text }}>
              Test 2: Ref + backdrop
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
              IxModal ref ile + backdrop prop
            </p>
            <IxButton onClick={handleTest2}>Aç</IxButton>
          </IxCardContent>
        </IxCard>

        {/* Test 3 */}
        <IxCard style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow: colors.cardShadow
        }}>
          <IxCardContent>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: colors.text }}>
              Test 3: State Control
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
              Conditional rendering ile state kontrolü
            </p>
            <IxButton onClick={handleTest3}>Aç</IxButton>
          </IxCardContent>
        </IxCard>

        {/* Test 4 */}
        <IxCard style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow: colors.cardShadow
        }}>
          <IxCardContent>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: colors.text }}>
              Test 4: showModal Function
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
              Imperative API - showModal function + backdrop
            </p>
            <IxButton onClick={handleTest4}>Aç</IxButton>
          </IxCardContent>
        </IxCard>

        {/* Test 5 - Pure iX */}
        <IxCard style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow: colors.cardShadow,
          borderLeft: `4px solid #1976d2`
        }}>
          <IxCardContent>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: colors.text }}>
              Test 5: Pure iX Modal ⭐
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
              Sadece Siemens iX componentleri - Önerilen yöntem
            </p>
            <IxButton onClick={handleTest5}>Aç</IxButton>
          </IxCardContent>
        </IxCard>
      </div>
      {/* End Test Grid */}

      {/* Console Log Card */}
      <IxCard style={{
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.cardShadow
      }}>
        <IxCardContent>
          <h3 style={{ margin: 0, marginBottom: '1rem', color: colors.text }}>
            Konsol Çıktısı
          </h3>
          <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
            Her test için console.log çıktısı görebilirsiniz. Browser DevTools Console'u açın.
          </p>
        </IxCardContent>
      </IxCard>

      {/* Modal 1: Basic Ref */}
      <IxModal ref={modalRef1} size="480">
        <IxModalHeader>Test Modal 1</IxModalHeader>
        <IxModalContent>
          <p style={{ padding: '1rem', color: colors.text }}>
            Bu modal ref ile showModal() metodu kullanılarak açıldı.
          </p>
        </IxModalContent>
        <IxModalFooter>
          <IxButton onClick={() => modalRef1.current?.dismissModal()}>
            Kapat
          </IxButton>
        </IxModalFooter>
      </IxModal>

      {/* Modal 2: With Backdrop */}
      <IxModal ref={modalRef2} size="480" backdrop={true}>
        <IxModalHeader>Test Modal 2 - Backdrop</IxModalHeader>
        <IxModalContent>
          <p style={{ padding: '1rem', color: colors.text }}>
            Bu modal backdrop prop ile açıldı.
          </p>
        </IxModalContent>
        <IxModalFooter>
          <IxButton onClick={() => modalRef2.current?.dismissModal()}>
            Kapat
          </IxButton>
        </IxModalFooter>
      </IxModal>

      {/* Modal 3: State Control */}
      {showStateModal && (
        <IxModal size="480">
          <IxModalHeader>Test Modal 3 - State</IxModalHeader>
          <IxModalContent>
            <p style={{ padding: '1rem', color: colors.text }}>
              Bu modal state ile conditional rendering kullanılarak açıldı.
            </p>
          </IxModalContent>
          <IxModalFooter>
            <IxButton onClick={() => setShowStateModal(false)}>
              Kapat
            </IxButton>
          </IxModalFooter>
        </IxModal>
      )}
    </>
  );
}

export default ModalTest;
