import CauseNode from './CauseNode';

function CauseTree({ causes, onUpdate, isDarkMode, colors }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      padding: isMobile ? '0.75rem' : '1rem',
      backgroundColor: colors?.sectionBackground || (isDarkMode ? '#3a3a3a' : '#f8f9fa'),
      borderRadius: '4px',
      overflowX: 'auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {causes.map((cause, index) => (
        <CauseNode
          key={cause.id}
          cause={cause}
          level={0}
          onUpdate={onUpdate}
          isLast={index === causes.length - 1}
          isDarkMode={isDarkMode}
          colors={colors}
        />
      ))}
    </div>
  );
}

export default CauseTree;
