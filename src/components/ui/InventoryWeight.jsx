import React, { useEffect, useState } from "react";
// import alt from 'alt-client'; // Import the alt-client package

// A React component to display and update weight
const InventoryWeight = () => {
  // State to hold the weight value
  const [weight, setWeight] = useState(1.2); // Initial weight set to 1.2kg
  
  // Function to listen for updates from the Alt:V server
  const updateWeightFromServer = () => {
    // Listen for weight update from the server
    window.alt.on('inventory:weightUpdate', (newWeight) => {
      console.log("Received weight update from server:", newWeight);
      setWeight(newWeight); // Update React state with the new weight
    });
  };

  // Send weight change to the Alt:V server
  const updateWeightOnServer = (newWeight) => {
    window.alt.emit('inventory:updateWeight', newWeight); // Send weight update to server
  };

  // Set up event listeners when the component mounts
  useEffect(() => {
    updateWeightFromServer(); // Listen for updates from the server

    // Cleanup listener on component unmount
    return () => {
      window.alt.off('inventory:weightUpdate'); // Unregister the listener
    };
  }, []);

  return (
    <div>
      <h3 className="font-semibold"><i className="fas fa-shopping-bag" aria-hidden="true"></i>Inventory Size</h3>
      <h5 className="font-semibold">
        Weight: <span className="font-medium">{weight}kg </span>/ ꝏkg
      </h5>
      {/* Button to simulate updating weight on the server */}
      {/* <button onClick={() => updateWeightOnServer(weight + 1)}>Increase Weight</button> */}
    </div>
  );
};

export default InventoryWeight;
