import React, { useState } from 'react';
import { ItemMapping } from '../ItemMapping';

const Hotbar = () => {
  const [selectedSlot, setSelectedSlot] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState([]);
  const slots = [1, 2, 3, 4];

  // New function to handle item selection from backend
  const hotbarSelectItem = (slotNumber) => {
    const index = slots.indexOf(slotNumber);
    if (index !== -1 && isVisible) {
      setSelectedSlot(index);
      const selectedItem = getItemForSlot(slotNumber);
      if (selectedItem) {
        // Emit the selected item using alt:V event system
        if (window.alt) {
          window.alt.emit('hotbar:itemSelected', selectedItem);
        }
        // Also log to console for debugging
        console.log('Selected item:', selectedItem);
      }
    }
  };

  // Method to open hotbar with items
  const openHotbar = (newItems,slot) => {
    setItems(newItems);
    setIsVisible(true);
  };

  // Method to close hotbar
  const closeHotbar = () => {
    setIsVisible(false);
    setItems([]);
    setSelectedSlot(0);
  };

  // Expose methods to window
  window.openHotbar = openHotbar;
  window.closeHotbar = closeHotbar;
  window.hotbarSelectItem = hotbarSelectItem;

  // Find item for a specific slot
  const getItemForSlot = (slotNumber) => {
    return items.find(item => parseInt(item.slot) === slotNumber);
  };

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-lg">
      <div className="flex gap-2">
        {slots.map((slotNumber, index) => {
          const item = getItemForSlot(slotNumber);
          
          return (
            <div
              key={slotNumber}
              className={`
                w-12 h-12 
                border-2 
                flex 
                items-center 
                justify-center 
                text-white 
                font-bold 
                cursor-pointer
                relative
                ${selectedSlot === index 
                  ? 'border-yellow-400 bg-gray-700' 
                  : 'border-gray-600 bg-gray-800'
                }
              `}
              onClick={() => hotbarSelectItem(slotNumber)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Slot number indicator */}
                <span className="absolute top-0 left-1 text-xs text-gray-400">
                  {slotNumber}
                </span>
                
                {/* Item image */}
                {item && ItemMapping[item.name] && (
                  <div className="relative w-8 h-8">
                    <img
                      src={ItemMapping[item.name].image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    {/* Quantity indicator */}
                    {item.quantity && item.quantity !== '1' && (
                      <span className="absolute bottom-0 right-0 text-xs bg-gray-800 px-1 rounded">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HotbarController = () => {
  const [_, setRenderKey] = useState(0);

  return (
    <Hotbar
      ref={(component) => {
        window.hotbarComponent = component;
        setRenderKey(prev => prev + 1); // Force re-render when ref is set
      }}
    />
  );
};

export default HotbarController;