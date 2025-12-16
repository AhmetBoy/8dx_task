import { useState, useRef } from 'react';
import { IxButton, IxModalHeader, IxModalContent, IxModalFooter, IxInputGroup, Modal } from '@siemens/ix-react';
import { problemsAPI } from '../../services/api';

/**
 * AddProblemModal Component
 *
 * Form modal for creating new 8D problems using Siemens iX Design System.
 * Uses the RECOMMENDED Siemens iX modal pattern with Modal component.
 *
 * Pattern based on: ModalTest.jsx (Siemens iX documentation recommended pattern)
 *
 * @param {Function} onSuccess - Callback on successful problem creation
 */
function AddProblemModal({ onSuccess }) {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible_team: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Modal control methods (Siemens iX recommended pattern)
  const close = () => {
    modalRef.current?.close();
  };

  const dismiss = () => {
    modalRef.current?.dismiss();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      responsible_team: '',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Detaylı açıklama gereklidir';
    }

    if (!formData.responsible_team.trim()) {
      newErrors.responsible_team = 'Sorumlu ekip gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const response = await problemsAPI.create(formData);

      if (response.data.success) {
        // Reset form and close modal
        resetForm();
        close();
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      alert('Problem oluşturulurken hata oluştu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={dismiss}>
        Yeni Problem Ekle (D1-D2)
      </IxModalHeader>


      <form onSubmit={handleSubmit} id="add-problem-form">
        <IxModalContent>
          
          <IxInputGroup
            label="Problem Başlığı *"
            style={{ marginBottom: '1.5rem' }}
          >
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Makine Durması - Hat 2"
              className={errors.title ? 'is-invalid' : ''}
            />
            {errors.title && (
              <span slot="error">{errors.title}</span>
            )}
          </IxInputGroup>

          <IxInputGroup
            label="Detaylı Açıklama (D2) *"
            style={{ marginBottom: '1.5rem' }}
          >
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Problemin detaylı açıklaması..."
              className={errors.description ? 'is-invalid' : ''}
            />
            {errors.description && (
              <span slot="error">{errors.description}</span>
            )}
          </IxInputGroup>

          <IxInputGroup
            label="Sorumlu Ekip (D1) *"
            style={{ marginBottom: '1.5rem' }}
          >
            <input
              type="text"
              name="responsible_team"
              value={formData.responsible_team}
              onChange={handleChange}
              placeholder="Örn: Bakım Ekibi"
              className={errors.responsible_team ? 'is-invalid' : ''}
            />
            {errors.responsible_team && (
              <span slot="error">{errors.responsible_team}</span>
            )}
          </IxInputGroup>
        </IxModalContent>

        <IxModalFooter>
          <IxButton variant="subtle-primary" type="button" onClick={dismiss} disabled={loading}>
            İptal
          </IxButton>
          <IxButton type="submit" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </IxButton>
        </IxModalFooter>
      </form>
    </Modal>
  );
}

export default AddProblemModal;
