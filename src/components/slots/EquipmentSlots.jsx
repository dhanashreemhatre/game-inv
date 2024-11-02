const EquipmentSlot = ({
  slotName,
  theme,
  image,
  label,
  handleEquipItem,
  equippedItem,
}) => {
  return (
    <div
      data-droppable="true"
      data-type="equipment"
      data-slot-name={slotName}
      className={`${theme.secondary} ${theme.hover} p-2 aspect-square rounded flex items-center justify-center gap-2`}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <img src={image} alt={label} className="w-12 h-12 opacity-50" />
      </div>

      {equippedItem && (
        <div className="flex items-center gap-1">
          <span className="text-xl">{equippedItem.icon}</span>
        </div>
      )}
    </div>
  );
};

export default EquipmentSlot;
