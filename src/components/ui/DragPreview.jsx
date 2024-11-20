import React from 'react';
import { ItemMapping } from '../ItemMapping';

const DragPreview = ({ item, position }) => {
  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div className="opacity-70">
  {ItemMapping[item.name] && (
    <img
      src={ItemMapping[item.name].image}
      alt={item.name}
      width={32}
      height={32}
    />
  )}
</div>

    </div>
  );
};

export default DragPreview;