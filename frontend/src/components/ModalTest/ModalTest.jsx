import {
  IxButton,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  Modal,
  showModal,
} from '@siemens/ix-react';
import { useRef } from 'react';

function CustomModal() {
  const modalRef = useRef(null);

  const close = () => {
    modalRef.current?.close();
  };

  const dismiss = () => {
    modalRef.current?.dismiss();
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={dismiss}>
        Test Modal (iX Docs Pattern)
      </IxModalHeader>

      <IxModalContent>
        <p style={{ padding: '1rem' }}>
          Bu modal Siemens iX dokümantasyonundaki recommended pattern ile açıldı.
        </p>
      </IxModalContent>

      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={dismiss}>
          İptal
        </IxButton>
        <IxButton onClick={close}>
          Tamam
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}

export default function ModalTest() {
  async function show() {
    await showModal({
      content: <CustomModal />,
      backdrop: true,
    });
  }

  return (
    <IxButton onClick={show}>
      Doküman Pattern Modal Aç
    </IxButton>
  );
}
