const GroundItems = ({ items, theme, handlePickupItem }) => {
  return (
    <>
      {items.map((item, index) => (
        <div
          key={`ground-${index}`}
          onClick={() => handlePickupItem(item, index)}
          className={`${theme.secondary} ${theme.hover} p-2 rounded aspect-square flex flex-col items-center justify-center cursor-pointer`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs text-center truncate w-full">
            {item.name}
          </span>
          <span className="text-xs text-gray-400">x{item.quantity}</span>
        </div>
      ))}
    </>
  );
};

export default GroundItems;
