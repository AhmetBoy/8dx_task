import { useState } from 'react';
import { IxButton, IxCheckbox, showModal, showToast } from '@siemens/ix-react';
import { rootCausesAPI } from '../../services/api';
import { AddCauseModal, DeleteCauseConfirmationModal } from './ProblemDetail';

function CauseNode({ cause, level, onUpdate, isLast, isDarkMode, colors }) {
  const [showActionInput, setShowActionInput] = useState(cause.is_root_cause);
  const [actionText, setActionText] = useState(cause.permanent_action || '');

  const isMobile = window.innerWidth < 768;
  const indentSize = level * (isMobile ? 20 : 40);

  // Use provided colors (should always be from ThemeContext now)
  const nodeColors = colors;

  const handleAddChild = async () => {
    // Siemens iX Modal Pattern - Add Child Cause Modal
    await showModal({
      content: <AddCauseModal
        title="Alt Sebep Ekle (Neden?)"
        placeholder="Alt sebep açıklamasını yazın..."
        onConfirm={async (causeText) => {
          try {
            const response = await rootCausesAPI.create({
              problem_id: cause.problem_id,
              parent_id: cause.id,
              cause_text: causeText,
              is_root_cause: false,
              order_index: cause.children ? cause.children.length : 0
            });

            if (response.data.success) {
              onUpdate();
            }
          } catch (error) {
            console.error('Error adding child cause:', error);
            showToast({
              message: 'Alt sebep eklenirken hata oluştu',
              type: 'error'
            });
          }
        }}
      />,
      backdrop: true,
    });
  };

  const handleToggleRootCause = async () => {
    const newIsRootCause = !cause.is_root_cause;

    try {
      const response = await rootCausesAPI.update(cause.id, {
        cause_text: cause.cause_text,
        is_root_cause: newIsRootCause,
        permanent_action: newIsRootCause ? actionText : null,
        order_index: cause.order_index
      });

      if (response.data.success) {
        setShowActionInput(newIsRootCause);
        onUpdate();
      }
    } catch (error) {
      console.error('Error toggling root cause:', error);
      showToast({
        message: 'Kök neden işaretlenirken hata oluştu',
        type: 'error'
      });
    }
  };

  const handleSaveAction = async () => {
    if (!actionText.trim()) {
      showToast({
        message: 'Kalıcı çözüm açıklaması gereklidir',
        type: 'warning'
      });
      return;
    }

    try {
      const response = await rootCausesAPI.update(cause.id, {
        cause_text: cause.cause_text,
        is_root_cause: true,
        permanent_action: actionText,
        order_index: cause.order_index
      });

      if (response.data.success) {
        showToast({
          message: 'Kalıcı çözüm başarıyla kaydedildi',
          type: 'success'
        });
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving action:', error);
      showToast({
        message: 'Kalıcı çözüm kaydedilirken hata oluştu',
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    // Siemens iX Modal Pattern - Delete Confirmation Modal
    await showModal({
      content: <DeleteCauseConfirmationModal
        causeText={cause.cause_text}
        onConfirm={async () => {
          try {
            const response = await rootCausesAPI.delete(cause.id);
            if (response.data.success) {
              onUpdate();
            }
          } catch (error) {
            console.error('Error deleting cause:', error);
            showToast({
              message: 'Sebep silinirken hata oluştu',
              type: 'error'
            });
          }
        }}
      />,
      backdrop: true,
    });
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        style={{
          marginLeft: `${indentSize}px`,
          padding: isMobile ? '0.75rem' : '1rem',
          backgroundColor: nodeColors.cardBackground,
          borderRadius: '4px',
          border: cause.is_root_cause ? `2px solid ${nodeColors.rootCauseBorder}` : `1px solid ${nodeColors.border}`,
          boxShadow: cause.is_root_cause ? `0 2px 8px rgba(255,107,107,${isDarkMode ? '0.4' : '0.2'})` : 'none',
          width: `calc(100% - ${indentSize}px)`,
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: isMobile ? '0.5rem' : '1rem',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* Level indicator */}
          <div style={{
            minWidth: isMobile ? '25px' : '30px',
            height: isMobile ? '25px' : '30px',
            borderRadius: '50%',
            backgroundColor: cause.is_root_cause ? '#ff6b6b' : '#4dabf7',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: isMobile ? '11px' : '12px'
          }}>
            {level + 1}
          </div>

          <div style={{ flex: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Cause text */}
            <div style={{ marginBottom: '0.75rem', width: '100%' }}>
              <p style={{
                margin: 0,
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: cause.is_root_cause ? 'bold' : 'normal',
                color: cause.is_root_cause ? nodeColors.rootCause : nodeColors.text,
                wordBreak: 'break-word'
              }}>
                {cause.cause_text}
                {cause.is_root_cause && (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '2px 8px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    fontSize: isMobile ? '10px' : '11px',
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    display: isMobile ? 'inline-block' : 'inline',
                    marginTop: isMobile ? '0.25rem' : '0'
                  }}>
                    KÖK NEDEN
                  </span>
                )}
              </p>
            </div>

            {/* Root cause checkbox */}
            <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={cause.is_root_cause}
                  onChange={handleToggleRootCause}
                />
                <span style={{ fontSize: isMobile ? '12px' : '14px', color: nodeColors.text }}>
                  Kök Neden Olarak İşaretle
                </span>
              </label>
            </div>

            {/* Action input (D5) */}
            {showActionInput && (
              <div style={{
                marginTop: '1rem',
                padding: isMobile ? '0.75rem' : '1rem',
                backgroundColor: nodeColors.rootCauseBg,
                borderRadius: '4px',
                border: `1px dashed ${nodeColors.rootCauseBorder}`,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: nodeColors.rootCause,
                  fontSize: isMobile ? '13px' : '14px',
                  width: '100%'
                }}>
                  Kalıcı Çözüm (D5) *
                </label>
                <textarea
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="Kalıcı çözüm önerinizi yazın..."
                  rows={3}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${nodeColors.rootCauseBorder}`,
                    backgroundColor: nodeColors.inputBg,
                    color: nodeColors.text,
                    borderRadius: '4px',
                    fontSize: isMobile ? '13px' : '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
                <IxButton
                  onClick={handleSaveAction}
                  style={{ marginTop: '0.5rem' }}
                  size="small"
                >
                  Çözümü Kaydet
                </IxButton>
              </div>
            )}

            {/* Display saved action */}
            {cause.permanent_action && !showActionInput && (
              <div style={{
                marginTop: '1rem',
                padding: isMobile ? '0.75rem' : '1rem',
                backgroundColor: nodeColors.solutionBg,
                borderRadius: '4px',
                border: `1px solid ${nodeColors.solutionBorder}`,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: isMobile ? '12px' : '13px',
                  color: nodeColors.solutionText,
                  wordBreak: 'break-word',
                  width: '100%'
                }}>
                  <strong>Kalıcı Çözüm:</strong> {cause.permanent_action}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <IxButton onClick={handleAddChild} size="small" outline>
                {isMobile ? '+ Alt Sebep' : '+ Alt Sebep Ekle (Neden?)'}
              </IxButton>
              <IxButton onClick={handleDelete} size="small" outline variant="danger">
                Sil
              </IxButton>
            </div>
          </div>
        </div>
      </div>

      {/* Render children recursively */}
      {cause.children && cause.children.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          {cause.children.map((child, index) => (
            <CauseNode
              key={child.id}
              cause={child}
              level={level + 1}
              onUpdate={onUpdate}
              isLast={index === cause.children.length - 1}
              isDarkMode={isDarkMode}
              colors={colors}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CauseNode;
