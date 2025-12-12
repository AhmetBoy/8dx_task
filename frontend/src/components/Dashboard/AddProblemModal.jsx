import { useState } from 'react';
import { IxModal, IxModalHeader, IxModalContent, IxModalFooter, IxButton } from '@siemens/ix-react';
import { problemsAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

function AddProblemModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible_team: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Theme context
  const { colors } = useTheme();

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
    <IxModal size="large">
      <IxModalHeader>Yeni Problem Ekle (D1-D2)</IxModalHeader>

      <IxModalContent>
        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: colors.text }}>
              Problem Başlığı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.title ? `1px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`,
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Örn: Makine Durması - Hat 2"
            />
            {errors.title && (
              <span style={{ color: colors.errorBorder, fontSize: '12px', marginTop: '0.25rem', display: 'block' }}>
                {errors.title}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: colors.text }}>
              Detaylı Açıklama (D2) *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.description ? `1px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`,
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              placeholder="Problemin detaylı açıklaması..."
            />
            {errors.description && (
              <span style={{ color: colors.errorBorder, fontSize: '12px', marginTop: '0.25rem', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: colors.text }}>
              Sorumlu Ekip (D1) *
            </label>
            <input
              type="text"
              name="responsible_team"
              value={formData.responsible_team}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.responsible_team ? `1px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`,
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Örn: Bakım Ekibi"
            />
            {errors.responsible_team && (
              <span style={{ color: colors.errorBorder, fontSize: '12px', marginTop: '0.25rem', display: 'block' }}>
                {errors.responsible_team}
              </span>
            )}
          </div>
        </form>
      </IxModalContent>

      <IxModalFooter>
        <IxButton outline onClick={onClose} disabled={loading}>
          İptal
        </IxButton>
        <IxButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </IxButton>
      </IxModalFooter>
    </IxModal>
  );
}

export default AddProblemModal;
