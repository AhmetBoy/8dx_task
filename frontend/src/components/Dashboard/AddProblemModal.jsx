import { useState } from 'react';
import { IxButton, IxModalHeader, IxModalContent, IxModalFooter, IxInputGroup } from '@siemens/ix-react';
import { problemsAPI } from '../../services/api';

/**
 * AddProblemModal Component
 *
 * Form modal for creating new 8D problems using Siemens iX Design System.
 * Uses IxInputGroup for form fields with built-in validation styling.
 *
 * @param {Function} onClose - Callback to close the modal
 * @param {Function} onSuccess - Callback on successful problem creation
 */
function AddProblemModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible_team: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
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
        // Reset form before calling onSuccess
        resetForm();
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
    <>
      <IxModalHeader>Yeni Problem Ekle (D1-D2)</IxModalHeader>

      {/*
        CRITICAL FIX: Form wraps ALL modal content including footer
        - Ensures type="submit" button works correctly
        - Proper form submission handling
      */}
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
          <IxButton outline type="button" onClick={onClose} disabled={loading}>
            İptal
          </IxButton>
          <IxButton type="submit" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </IxButton>
        </IxModalFooter>
      </form>
    </>
  );
}

export default AddProblemModal;
