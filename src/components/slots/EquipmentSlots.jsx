import ItemTooltip from "../ui/ItemToolTip";
import React from "react";
import { ItemMapping } from "./../ItemMapping";
import { useDrag } from "./../../DragContext";
import { DragPreview } from "../ui/DragPreview";

const EquipmentSlot = ({
  slotName,
  onClick,
  theme,
  image,
  label,
  handleEquipItem,
  equippedItem,
}) => {
  const { setDraggedItem, setDragPosition, setIsDragging, draggedItem } = useDrag();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const [isDraggingLocal, setIsDraggingLocal] = React.useState(false);

  const handleMouseEnter = (e) => {
    if (!equippedItem || isDraggingLocal) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseDown = (e) => {
    if (!equippedItem || e.button !== 0) return; // Only handle left clicks

    const startX = e.clientX;
    const startY = e.clientY;
    let hasDragStarted = false;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 5 && !hasDragStarted) {
        hasDragStarted = true;
        setIsDraggingLocal(true);
        setShowTooltip(false);
        
        // Set the dragged item with equipment source info
        setDraggedItem({
          ...equippedItem,
          sourceType: "equipment",
          sourceSlot: slotName,
          originalSlot: slotName
        });
        
        setIsDragging(true);
        setDragPosition({
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        });
      }

      if (hasDragStarted) {
        setDragPosition({
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      
      if (!hasDragStarted) {
        onClick(e);
      }
      
      setIsDraggingLocal(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      data-droppable="true"
      data-type="equipment"
      data-slot-name={slotName}
      className={`${theme.secondary} ${theme.hover} p-2 aspect-square rounded flex items-center justify-center gap-2 relative`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {equippedItem ? (
        <div 
          className={`flex items-center gap-1 ${isDraggingLocal ? 'opacity-50' : ''}`}
        >
          {ItemMapping[equippedItem.name] ? (
            <img
              src={ItemMapping[equippedItem.name].image}
              alt={equippedItem.name}
              width={32}
              height={32}
              draggable={false}
            />
          ) : (
            <img 
              src={image} 
              alt={label} 
              width={32} 
              height={32} 
              draggable={false}
            />
          )}
        </div>
      ) : (
        <div className="w-12 h-12 flex justify-center">
          <img 
            src={image} 
            alt={label} 
            className="w-12 h-12 opacity-50" 
            draggable={false}
          />
        </div>
      )}
      
      {showTooltip && equippedItem && equippedItem.name!==""  && !isDraggingLocal && (
        <div
          style={{
            position: "fixed",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <ItemTooltip item={equippedItem} is_quantity="false" />
        </div>
      )}
    </div>
  );
};

export default EquipmentSlot;