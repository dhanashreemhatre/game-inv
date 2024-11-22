import { useDrag } from "../../DragContext";
import QuantitySelector from "../ui/QuantitySelector";
import ItemTooltip from "../ui/ItemToolTip";
import React from "react";
import { ItemMapping } from "./../ItemMapping";

const QuickSlot = ({
  item,
  theme,
  index,
  onClick,
  onDrop,
  updateItemQuantity,
  layout,
  handleDropToGround,
  isSelected,
}) => {
  const { setDraggedItem, setDragPosition, setIsDragging } = useDrag();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [showQuantitySelector, setShowQuantitySelector] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const itemImage = item && ItemMapping[item.name]?.image;

  const handleMouseEnter = (e) => {
    if (!item) return;
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
    if (!item) return;

    if (e.shiftKey && item.quantity > 1) {
      e.preventDefault();
      setShowQuantitySelector(true);
      return;
    }

    e.preventDefault();
    setDraggedItem({
      ...item,
      sourceType: "quickslot",
      sourceIndex: index,
    });
    setIsDragging(true);
    setDragPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 4. Update the QuantitySelector component's handleSelect function
  const handleQuantitySelect = (selectedQuantity) => {
    if (!item || selectedQuantity <= 0 || selectedQuantity > item.quantity)
      return;

    // const remainingQuantity = item.quantity - selectedQuantity;

    // // Update the original item quantity
    // updateItemQuantity(index, remainingQuantity);

    // Create the split item for dragging
    const splitItem = {
      ...item,
      quantity: selectedQuantity,
      sourceType: "quickslot",
      sourceIndex: index,
      splitItem: true,
    };

    setDraggedItem(splitItem);
    setIsDragging(true);
    setShowQuantitySelector(false);

    if (window.event) {
      setDragPosition({
        x: window.event.clientX,
        y: window.event.clientY,
      });
    }
  };
  return (
    <>
      <div
        data-droppable="true"
        data-index={index}
        data-type="quickslot"
        className={`${theme.secondary} ${theme.hover} ${layout.slotStyle} aspect-square rounded
          p-2 flex flex-col items-center justify-center relative transition-all duration-200`}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {item ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            {itemImage && (
              <img
                src={itemImage}
                alt={item.name}
                className="w-12 h-12 object-contain"
              />
            )}
            {item.quantity > 1 && (
              <span
                className={`${theme.text} text-sm absolute bottom-1 right-2 item-quantity-right`}
              >
                {item.quantity}
              </span>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Empty</div>
        )}
      </div>

      {showTooltip && item && (
        <div
          style={{
            position: "fixed",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <ItemTooltip item={item} />
        </div>
      )}

      {showQuantitySelector && item && (
        <QuantitySelector
          item={item}
          onSelect={handleQuantitySelect}
          onClose={() => setShowQuantitySelector(false)}
        />
      )}
    </>
  );
};

export default QuickSlot;
