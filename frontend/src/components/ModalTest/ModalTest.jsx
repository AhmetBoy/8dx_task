import {
  IxButton,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  Modal,
  showModal,
  IxCard,
  IxCardContent,
} from '@siemens/ix-react';
import { useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Example 1: Basic Modal (from Siemens iX Docs)
 * Shows close() and dismiss() with payload
 */
function BasicModal() {
  const modalRef = useRef(null);

  const close = () => {
    console.log('✅ Modal closed with payload');
    modalRef.current?.close('close payload!');
  };

  const dismiss = () => {
    console.log('❌ Modal dismissed with payload');
    modalRef.current?.dismiss('dismiss payload');
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={dismiss}>
        Basic Modal - Siemens iX Pattern
      </IxModalHeader>
      <IxModalContent>
        <p style={{ padding: '1rem' }}>
          Bu modal Siemens iX'in resmi dokümantasyonundan alınan örnek pattern.
          <br /><br />
          <strong>Özellikler:</strong>
          <br />• close() - Payload ile kapanır
          <br />• dismiss() - Payload ile iptal edilir
          <br />• Console'da payload'ları görebilirsiniz
        </p>
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={dismiss}>
          Cancel (Dismiss)
        </IxButton>
        <IxButton onClick={close}>
          OK (Close)
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}

/**
 * Example 2: Form Modal
 * Practical example with form submission
 */
function FormModal() {
  const modalRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log('📝 Form submitted:', data);
    modalRef.current?.close(data);
  };

  const dismiss = () => {
    modalRef.current?.dismiss();
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={dismiss}>
        Form Example
      </IxModalHeader>
      <form onSubmit={handleSubmit}>
        <IxModalContent>
          <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                İsim:
              </label>
              <input
                type="text"
                name="name"
                placeholder="Adınızı girin"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                E-posta:
              </label>
              <input
                type="email"
                name="email"
                placeholder="E-posta adresiniz"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>
        </IxModalContent>
        <IxModalFooter>
          <IxButton variant="subtle-primary" type="button" onClick={dismiss}>
            İptal
          </IxButton>
          <IxButton type="submit">
            Gönder
          </IxButton>
        </IxModalFooter>
      </form>
    </Modal>
  );
}

/**
 * Example 3: Confirmation Dialog
 */
function ConfirmationModal({ message }) {
  const modalRef = useRef(null);

  const confirm = () => {
    console.log('✅ User confirmed');
    modalRef.current?.close(true);
  };

  const cancel = () => {
    console.log('❌ User cancelled');
    modalRef.current?.dismiss(false);
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={cancel}>
        Onay Gerekiyor
      </IxModalHeader>
      <IxModalContent>
        <p style={{ padding: '1rem' }}>
          {message || 'Bu işlemi yapmak istediğinize emin misiniz?'}
        </p>
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={cancel}>
          Hayır
        </IxButton>
        <IxButton variant="primary" onClick={confirm}>
          Evet
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}

/**
 * Main ModalTest Component
 */
export default function ModalTest() {
  const { isDarkMode, colors } = useTheme();

  // Example 1: Basic Modal
  const showBasicModal = async () => {
    const result = await showModal({
      content: <BasicModal />,
      backdrop: true,
    });
    console.log('Modal result:', result);
  };

  // Example 2: Form Modal
  const showFormModal = async () => {
    try {
      const result = await showModal({
        content: <FormModal />,
        backdrop: true,
      });
      console.log('Form data received:', result);
      alert('Form gönderildi! Console\'da veriyi görebilirsiniz.');
    } catch (dismissReason) {
      console.log('Form cancelled:', dismissReason);
    }
  };

  // Example 3: Confirmation Dialog
  const showConfirmationModal = async () => {
    try {
      const confirmed = await showModal({
        content: <ConfirmationModal message="Silme işlemini onaylıyor musunuz?" />,
        backdrop: true,
      });
      if (confirmed) {
        alert('✅ İşlem onaylandı!');
      }
    } catch (cancelled) {
      alert('❌ İşlem iptal edildi!');
    }
  };

  // Example 4: Size variations
  const showLargeModal = async () => {
    await showModal({
      content: <BasicModal />,
      backdrop: true,
      size: '720',
    });
  };

  return (
    <>
      {/* Header */}
      <ix-content-header slot="header">
        <div slot="header-title">Modal Test & Examples</div>
        <div slot="header-subtitle">
          Siemens iX Modal component'inin farklı kullanım örnekleri
        </div>
      </ix-content-header>

      {/* Content */}
      <ix-layout-section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Example 1 */}
          <IxCard style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <IxCardContent>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                1. Basic Modal
              </h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                Siemens iX dokümantasyonundan resmi örnek. Close ve dismiss payload'ları gösterir.
              </p>
              <IxButton onClick={showBasicModal}>
                Basic Modal Aç
              </IxButton>
            </IxCardContent>
          </IxCard>

          {/* Example 2 */}
          <IxCard style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <IxCardContent>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                2. Form Modal
              </h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                Form submission örneği. Veriyi payload olarak döndürür.
              </p>
              <IxButton onClick={showFormModal}>
                Form Modal Aç
              </IxButton>
            </IxCardContent>
          </IxCard>

          {/* Example 3 */}
          <IxCard style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <IxCardContent>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                3. Confirmation Dialog
              </h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                Onay dialog'u. Evet/Hayır seçimi ile boolean döndürür.
              </p>
              <IxButton onClick={showConfirmationModal}>
                Confirmation Modal Aç
              </IxButton>
            </IxCardContent>
          </IxCard>

          {/* Example 4 */}
          <IxCard style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <IxCardContent>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                4. Large Modal (720px)
              </h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                Size parametresi ile daha geniş modal.
              </p>
              <IxButton onClick={showLargeModal}>
                Large Modal Aç
              </IxButton>
            </IxCardContent>
          </IxCard>
        </div>

        {/* Info Box */}
        <IxCard style={{
          backgroundColor: colors.cardBackground,
          border: `2px solid #1976d2`,
          marginTop: '2rem',
        }}>
          <IxCardContent>
            <h3 style={{ margin: 0, marginBottom: '1rem' }}>
              💡 Console Output
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
              Her modal işlemi console'a log yazdırır. Browser DevTools Console'u açın ve modal'ları test edin.
              <br /><br />
              <strong>Görecekleriniz:</strong>
              <br />• close() payload'ları
              <br />• dismiss() payload'ları
              <br />• Form verileri
              <br />• Onay/İptal sonuçları
            </p>
          </IxCardContent>
        </IxCard>
      </ix-layout-section>
    </>
  );
}
