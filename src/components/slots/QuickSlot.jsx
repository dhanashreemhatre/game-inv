import { useDrag } from "../../DragContext";

const QuickSlot = ({
  item,
  theme,
  index,
  onClick,
  onDrop,
  layout,
  handleDropToGround,
}) => {
  const { setDraggedItem, setDragPosition, setIsDragging } = useDrag();

  const handleMouseDown = (e) => {
    if (!item) return;
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

  return (
    <div
      data-droppable="true"
      data-index={index}
      data-type="quickslot"
      className={`${theme.secondary} ${theme.hover} ${layout.slotStyle} aspect-square rounded
        p-2 flex flex-col items-center justify-center relative transition-all duration-200`}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      {item && (
        <>
          <div className="absolute top-1 left-1 text-xs bg-black/50 px-1.5 py-0.5 rounded">
            {index + 1}
          </div>
          <span className="text-xl mb-0.5">{item.icon}</span>
          <span className="text-xs text-center truncate w-full">
            {item.name}
          </span>
          <span className="text-xs text-gray-400">x{item.quantity}</span>
        </>
      )}
    </div>
  );
};

export default QuickSlot;
