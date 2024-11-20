let inventoryStateSetters = {
  setEquipment: null,
  setInventory: null,
  setQuickSlots: null,
  setGroundItems: null,
};

export const registerSetters = (setters) => {
  inventoryStateSetters = setters;
};

export const updateInventoryState = (type, data) => {
  if (inventoryStateSetters[type]) {
    inventoryStateSetters[type](data);
  }
};
export const updateInventorySection = (section, data) => {
  switch (section) {
    case "ClothingItems":
      if (inventoryStateSetters.setEquipment) {
        const equipment = {};
        Object.entries(data).forEach(([key, item]) => {
          equipment[key.toLowerCase()] = item;
        });
        inventoryStateSetters.setEquipment(equipment);
      }
      break;

    case "InventoryItems":
      if (inventoryStateSetters.setInventory) {
        const inventoryArray = Array(20).fill(null);
        data.forEach((item) => {
          if (item.slot) {
            inventoryArray[item.slot - 1] = {
              ...item,
              id: Math.random().toString(),
            };
          }
        });
        inventoryStateSetters.setInventory(inventoryArray);
      }
      break;
    case "InventoryItems":
      if (inventoryStateSetters.setInventory) {
        const inventoryArray = Array(20).fill(null);
        data.forEach((item) => {
          if (item.slot) {
            const slotIndex = parseInt(item.slot) - 1;
            if (slotIndex >= 0 && slotIndex < 20) {
              inventoryArray[slotIndex] = {
                ...item,
                id: Math.random().toString(),
              };
            }
          }
        });
        inventoryStateSetters.setInventory(inventoryArray);
      }
      break;

    case "QuickItems":
      if (inventoryStateSetters.setQuickSlots) {
        const quickSlotsArray = Array(4).fill(null);
        data.forEach((item) => {
          if (item.slot) {
            const slotIndex = parseInt(item.slot) - 1;
            if (slotIndex >= 0 && slotIndex < 4) {
              quickSlotsArray[slotIndex] = {
                ...item,
                id: Math.random().toString(),
              };
            }
          }
        });
        inventoryStateSetters.setQuickSlots(quickSlotsArray);
      }
      break;

    case "GroundItems":
      if (inventoryStateSetters.setGroundItems) {
        inventoryStateSetters.setGroundItems(
          data.map((item) => ({
            ...item,
            id: Math.random().toString(),
          })),
        );
      }
      break;
  }
};

export const setupInitialInventory = (data) => {
  if (!data) return;

  // Handle ClothingItems
  if (data.ClothingItems) {
    const equipment = {};
    Object.entries(data.ClothingItems).forEach(([key, item]) => {
      equipment[key.toLowerCase()] = item;
    });
    inventoryStateSetters.setEquipment(equipment);
  }

  // Handle InventoryItems with slots
  if (data.InventoryItems) {
    const inventoryArray = Array(20).fill(null);
    data.InventoryItems.forEach((item) => {
      if (item.slot) {
        const slotIndex = parseInt(item.slot) - 1;
        if (slotIndex >= 0 && slotIndex < 20) {
          inventoryArray[slotIndex] = {
            ...item,
            id: Math.random().toString(),
          };
        }
      }
    });
    inventoryStateSetters.setInventory(inventoryArray);
  }

  // Handle QuickItems
  if (data.QuickItems) {
    const quickSlotsArray = Array(4).fill(null);
    data.QuickItems.forEach((item) => {
      if (item.slot) {
        const slotIndex = parseInt(item.slot) - 1;
        if (slotIndex >= 0 && slotIndex < 4) {
          quickSlotsArray[slotIndex] = {
            ...item,
            id: Math.random().toString(),
          };
        }
      }
    });
    inventoryStateSetters.setQuickSlots(quickSlotsArray);
  }

  // Handle GroundItems
  if (data.GroundItems) {
    inventoryStateSetters.setGroundItems(
      data.GroundItems.map((item) => ({
        ...item,
        id: Math.random().toString(),
      })),
    );
  }
};
