import CauseNode from './CauseNode';

function CauseTree({ causes, onUpdate, isDarkMode }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div>
      {causes.map((cause, index) => (
        <CauseNode
          key={cause.id}
          cause={cause}
          level={0}
          onUpdate={onUpdate}
          isLast={index === causes.length - 1}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}

export default CauseTree;
