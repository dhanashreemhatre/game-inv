import React from "react";

const QuantitySelector = ({ item, onSelect, onClose }) => {
    const [quantity, setQuantity] = React.useState(1);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSelect(Math.min(Math.max(1, quantity), item.quantity));
      onClose();
    };
  
    const handleQuantityChange = (e) => {
      const inputValue = e.target.value;
      
      // Allow empty string to be typed
      if (inputValue === '') {
        setQuantity('');
        return;
      }
      
      // Convert to number and validate
      const numValue = parseInt(inputValue, 10);
      
      if (!isNaN(numValue)) {
        setQuantity(Math.min(Math.max(1, numValue), item.quantity));
      }
    };
  
    const adjustQuantity = (delta) => {
      setQuantity(prev => {
        const newQuantity = (prev === '' ? 1 : prev) + delta;
        return Math.min(Math.max(1, newQuantity), item.quantity);
      });
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-64" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Select Quantity</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center box-border">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                className="bg-gray-700 hover:bg-gray-600 rounded p-2"
              >
                -
              </button>
              <input
                type="text"
                pattern="\d*"
                inputMode="numeric"
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-gray-800 border border-gray-700 rounded py-2 text-center"
              />
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                className="bg-gray-700 hover:bg-gray-600 rounded p-2"
              >
                +
              </button>
            </div>
            <div className="text-center text-sm text-gray-400 mb-4">
              Max: {item.quantity}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded p-2"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 rounded p-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
export default QuantitySelector;