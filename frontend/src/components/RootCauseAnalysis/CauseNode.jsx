import { useState, useEffect } from 'react';
import { IxButton, IxCheckbox, showModal, showToast, IxLayoutGrid, IxRow, IxCol, IxInputGroup, IxTypography, IxCard, IxCardContent, IxTextarea, IxChip } from '@siemens/ix-react';
import { rootCausesAPI } from '../../services/api';
import { AddCauseModal, DeleteCauseConfirmationModal } from './ProblemDetail';

function CauseNode({ cause, level, onUpdate, isLast, isDarkMode, colors }) {
  const [showActionInput, setShowActionInput] = useState(cause.is_root_cause);
  const [actionText, setActionText] = useState(cause.permanent_action || '');

  // Sync state when cause data changes
  useEffect(() => {
    setActionText(cause.permanent_action || '');
    // If solution is saved, hide input; otherwise follow is_root_cause
    if (cause.permanent_action) {
      setShowActionInput(false);
    } else {
      setShowActionInput(cause.is_root_cause);
    }
  }, [cause.is_root_cause, cause.permanent_action]);

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

  const handleToggleRootCause = () => {
    // Simply toggle the input visibility
    setShowActionInput(!showActionInput);
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
        setShowActionInput(false); // Close input after save
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
      <div style={{ marginLeft: `${indentSize}px`, width: `calc(100% - ${indentSize}px)` }}>
        <IxCard
          variant="filled"
          style={{width: '100%',
            border: cause.is_root_cause ? `2px solid ${nodeColors.rootCauseBorder}` : undefined
          }}
        >
          <IxCardContent>
            <IxLayoutGrid gap="12">
          {/* Row 1: Level Indicator + Cause Text */}
          <IxRow>
            <IxCol size="auto">
              {/* Level indicator */}
              <IxChip variant={cause.is_root_cause ? 'success' : 'primary'}>
                {level + 1}
              </IxChip>
            </IxCol>
            <IxCol>
              {/* Cause text */}
              <IxTypography
                format={isMobile ? "body" : "h5"}
                bold={cause.is_root_cause}
                style={{
                  color: cause.is_root_cause ? nodeColors.rootCause : nodeColors.text,
                  wordBreak: 'break-word'
                }}
              >
                {cause.cause_text}
                {cause.is_root_cause && (
                  <>
                    {' '}
                    <IxChip variant="success" >
                      KÖK NEDEN
                    </IxChip>
                  </>
                )}
              </IxTypography>
            </IxCol>
          </IxRow>

          {/* Row 2: Root cause checkbox */}
          <IxRow>
            <IxCol>
              <IxCheckbox
                checked={showActionInput}
                onCheckedChange={handleToggleRootCause}
              >
                Kök Neden Olarak İşaretle
              </IxCheckbox>
            </IxCol>
          </IxRow>

          {/* Row 3: Action input (D5) - Conditional */}
          {showActionInput && (
            <IxRow>
              <IxCol>
                <IxInputGroup>
                  <span slot="input-start">💡</span>
                  <input
                    type="text"
                    value={actionText}
                    onInput={(e) => setActionText(e.target.value)}
                    placeholder="Kalıcı çözüm önerinizi yazın..."
                  />
                </IxInputGroup>
                <IxButton
                  onClick={handleSaveAction}
                  style={{ marginTop: '0.5rem' }}
                  size="small"
                >
                  Çözümü Kaydet
                </IxButton>
              </IxCol>
            </IxRow>
          )}

          {/* Row 4: Display saved action - Conditional */}
          {cause.permanent_action && !showActionInput && (
            <IxRow>
              <IxCol>
                <IxTypography
                  format="h4"
                  bold
                  style={{
                    color: nodeColors.solutionText,
                    wordBreak: 'break-word',
                    width: '100%'
                  }}
                >
                  Kalıcı Çözüm: {cause.permanent_action}
                </IxTypography>
              </IxCol>
            </IxRow>
          )}

          {/* Row 5: Action buttons - Side by side */}
          <IxRow>
            <IxCol size="auto">
              <IxButton onClick={handleAddChild} size="small" outline>
                {isMobile ? '+ Alt Sebep' : '+ Alt Sebep Ekle (Neden?)'}
              </IxButton>
            </IxCol>
            <IxCol size="auto">
              <IxButton onClick={handleDelete} size="small" outline variant="danger">
                Sil
              </IxButton>
            </IxCol>
          </IxRow>
            </IxLayoutGrid>
          </IxCardContent>
        </IxCard>
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
