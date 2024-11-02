import { useDrag } from "./../../DragContext";

const InventoryItem = ({
  item,
  theme,
  onClick,
  onDrop,
  layout,
  handleDropToGround,
  index,
}) => {
  const { setDraggedItem, setDragPosition, setIsDragging } = useDrag();

  const handleMouseDown = (e) => {
    // If it's right click, don't initiate drag
    if (e.button === 2) {
      e.preventDefault();
      return;
    }

    // Start drag on left mouse down
    let dragStarted = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const clickedElement = e.currentTarget; // Store the clicked element

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 5 && !dragStarted) {
        dragStarted = true;
        setDraggedItem({
          ...item,
          sourceType: "inventory",
          sourceIndex: index,
        });
        setIsDragging(true);
        setDragPosition({
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        });
      }
    };

    const handleMouseUp = (upEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      // If no drag occurred, treat it as a click
      if (!dragStarted && upEvent.button === 0) {
        // Create a synthetic click event with the original element
        onClick({
          ...upEvent,
          currentTarget: clickedElement,
          preventDefault: () => {},
          stopPropagation: () => {},
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      data-droppable="true"
      data-index={index}
      data-type="inventory"
      className={`${theme.secondary} aspect-square rounded ${theme.hover} ${layout.slotStyle}
        p-2 flex flex-col items-center justify-center cursor-move transition-all duration-200`}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="text-xl mb-0.5">{item.icon}</span>
      <span className="text-xs text-center truncate w-full">{item.name}</span>
      <span className="text-xs text-gray-400">x{item.quantity}</span>
    </div>
  );
};

export default InventoryItem;
