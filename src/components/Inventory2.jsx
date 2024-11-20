import React, { useState, useEffect } from "react";
import { useDrag } from "../DragContext";
import { Settings, User, Zap, Package } from "lucide-react";
import EnhancedSettingsModal from "./Setting";
import ItemMenu from "./ui/ItemMenu";
import EquipmentSlot from "./slots/EquipmentSlots";
import QuickSlot from "./slots/QuickSlot";
import EmptySlot from "./slots/EmptySlot";
import InventoryItem from "./slots/InventoryItem";
import GroundItems from "./slots/GroundItems";
import { registerSetters } from "./InventoryState";
import InventoryWeight from "./ui/InventoryWeight";
import DragPreview from "./ui/DragPreview";

import {
  hat,
  shirt,
  rifle,
  sport_shoe,
  trousers,
  watch,
  armor,
} from "./images/images";

const equipmentImages = {
  hat: hat,
  watch: watch,
  armor: armor,
  shirt: shirt,
  weapon: rifle,
  pants: trousers,
  shoes: sport_shoe,
};

const defaultThemes = {
  Default: {
    primary: "bg-gray-900",
    secondary: "bg-gray-800",
    accent:
      "border-emerald-700 bg-emerald-700/10 shadow-md shadow-emerald-500/50 rounded-md",
    text: "text-gray-100",
    hover:
      "hover:border-emerald-200/40 hover:shadow-md hover:shadow-emerald-500/50",
  },
};
const initialInventory = [];

const layoutPresets = {
  standard: {
    container: "h-screen w-screen fixed inset-0 p-6 bg-black/60",
    gridLayout:
      "grid grid-cols-[100px_1fr_100px] lg:grid-cols-[100px_50%_180px] xl:grid-cols-[100px_50%_250px] 2xl:grid-cols-[8%_60%_15%] 2xl:gap-20 gap-30 md:gap-4 h-[60vh] flex justify-around", // reduced from 200px to 120px
    inventoryGrid:
      "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3 2xl:grid-cols-8 gap-3 overflow-auto max-h-[60vh]",
    quickSlotsGrid: "grid-cols-1 lg:grid-cols-2 gap-3 max-h-[60vh]",
    groundItemsGrid:
      "col-start-3 col-span-2 grid grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8 gap-3",
  },
  cyberpunk: {
    container: "h-screen w-screen fixed inset-0 p-4 bg-black/60",
    gridLayout:
      "grid reverse grid-cols-[8rem_1fr_12rem] md:grid-cols-[10rem_1fr_14rem] lg:grid-cols-[6rem_1fr_14rem] gap-32 h-3/4 max-w-7xl mx-auto flex justify-around",
    inventoryGrid:
      "grid-cols-4 md:grid-cols-5 lg:grid-cols-5 2xl:grid-cols-7 gap-3 overflow-auto max-h-[60vh]",
    quickSlotsGrid: "grid-cols-2 gap-3 overflow-auto max-h-[60vh]",
    groundItemsGrid:
      "grid grid-cols-5 md:grid-cols-6 lg:grid-cols-6 2xl:grid-cols-8 gap-3 grid-center",
    containerStyle: "camo-pattern",
    slotStyle: "border-2 border-stone-700",
  },
  futuristic: {
    container: "h-screen w-screen fixed inset-0 p-8 bg-black/60",
    gridLayout:
      "grid grid-cols-[100px_1fr_150px] md:grid-cols-[120px_1fr_180px] lg:grid-cols-[100px_1fr_200px] 2xl:grid-cols-[120px_1fr_200px] gap-10 h-[75vh] h-full max-w-[2000px] mx-auto",
    inventoryGrid:
      "grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-4 overflow-auto max-h-[60vh]",
    quickSlotsGrid: "grid-cols-2 gap-4 overflow-auto max-h-[60vh]",
    groundItemsGrid:
      "grid grid-cols-7 md:grid-cols-8 lg:grid-cols-9 gap-4 md:mt-10",
    containerStyle: "hologram-effect",
    slotStyle: "hover:skew",
  },
  medieval: {
    container: "h-screen w-screen fixed inset-0 p-12 bg-black/60",
    gridLayout:
      "grid grid-cols-[100px_1fr_180px] md:grid-cols-[100px_1fr_200px] lg:grid-cols-[100px_1fr_220px] 2xl:grid-cols-[120px_1fr_220px]  mx-auto gap-8 h-[70vh] max-w-[1600px] flex justify-around",
    inventoryGrid:
      "grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 overflow-auto max-h-[60vh]",
    quickSlotsGrid: "grid-cols-2 gap-4 overflow-auto max-h-[60vh]",
    groundItemsGrid: "grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4",
  },
};

const initialGroundItems = [];

export default function AestheticInventory() {
  const getInitialInventoryState = (initialInventory) => {
    // Create an array of 20 null slots
    const emptyInventory = Array(20).fill(null);

    // Fill the first slots with initial items
    initialInventory.forEach((item, index) => {
      if (item.slot && item.slot <= 20) {
        emptyInventory[item.slot - 1] = {
          ...item,
          id: item.id?.toString() || Math.random().toString(),
        };
      }
    });

    return emptyInventory;
  };
  const [selectedQuickSlot, setSelectedQuickSlot] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [inventory, setInventory] = useState(() => {
    const emptyInventory = Array(20).fill(null);
    if (window.initialInventory) {
      window.initialInventory.forEach((item) => {
        if (item && item.slot) {
          const slotIndex = parseInt(item.slot) - 1;
          if (slotIndex >= 0 && slotIndex < 20) {
            emptyInventory[slotIndex] = item;
          }
        }
      });
    }
    return emptyInventory;
  });
  const [quickSlots, setQuickSlots] = useState(() => {
    const emptyQuickSlots = Array(4).fill(null);
    if (window.initialQuickItems) {
      window.initialQuickItems.forEach((item) => {
        if (item && item.slot) {
          const slotIndex = parseInt(item.slot) - 1;
          if (slotIndex >= 0 && slotIndex < 4) {
            emptyQuickSlots[slotIndex] = {
              ...item,
              id: item.id || Math.random().toString(),
            };
          }
        }
      });
    }
    return emptyQuickSlots;
  });
  const [showItemMenu, setShowItemMenu] = useState(null);

  const [activeTheme, setActiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem("customTheme");
    return savedTheme ? JSON.parse(savedTheme) : defaultThemes.Default;
  });

  const [activeLayout, setActiveLayout] = useState("standard");

  const currentLayout = layoutPresets[activeLayout];
  const { draggedItem, setDraggedItem, dragPosition, setDragPosition, setIsDragging } = useDrag();
  useEffect(() => {
    registerSetters({
      setEquipment,
      setInventory,
      setQuickSlots,
      setGroundItems,
    });
  }, []);

  const trackItemMovement = (item, fromSection, toSection, fromSlot, toSlot) => {
    let slotValue;
    let id_data;
    let FromslotValue;
    // Determine the appropriate slot value based on the sections
    if (toSection === "equipment") {
      id_data=slotValue
      slotValue = toSlot; 
    } else {
      id_data=item.id
      slotValue = typeof toSlot === "number" ? toSlot + 1 : toSlot; // For inventory/quickslot use number
    }
    if(fromSection==="equipment"){
      id_data=slotValue
      FromslotValue = item.slot; // Use the equipment slot name (e.g., "hat", "armor")
    } else {
      id_data=item.id
      FromslotValue = typeof fromSlot === "number" ? (fromSlot + 1 ): fromSlot; // For inventory/quickslot use number
    }
    const movement = {
      item: {
        id: id_data,
        name: item.name,
        quantity: item.quantity,
        slot: String(slotValue),
        type:item.type
      },
      from: {
        section: fromSection,
        slot: String(FromslotValue)
      },
      to: {
        section: toSection,
        slot: String(slotValue)
      }
    };
  
    // Emit the movement info
    window.alt.emit("ItemMoved", movement);
    console.log("item moved", movement);
    return movement;
  };

  
  // Handle quick slot selection
  const handleQuickSlotSelect = (index) => {
    if (index >= 0 && index < 4) { // Ensure index is within bounds
      setSelectedQuickSlot(index);
      
      // If you need to emit the selection to your backend
      if (window.alt) {
        window.alt.emit('QuickSlotSelected', {
          selectedSlot: index,
          item: quickSlots[index] // Send the item data if needed
        });
      }
      
      return true;
    }
    return false;
  };


const handleInventoryDrop = (droppedItem, targetIndex) => {
    if (!droppedItem) return;
  
    const fromSection = droppedItem.sourceType;
    const fromSlot = droppedItem.sourceIndex;
    const toSection = "inventory";
    const toSlot = targetIndex;
    if (droppedItem.name === "") {
      return
    }
  
    // Get target slot item
    const targetItem = inventory[targetIndex];
  
    // Handle inventory source
    if (droppedItem.sourceType === "inventory") {
      // Check if dropping to the same slot - if so, do nothing
      if (droppedItem.sourceIndex === targetIndex) {
        return;
      }
  
      setInventory((prev) => {
        const newInventory = [...prev];
  
        // If it's a split item
        if (droppedItem.splitItem) {
          // If target slot has same item type, stack them
          if (targetItem && targetItem.id === droppedItem.id) {
            newInventory[targetIndex] = {
              ...targetItem,
              quantity: targetItem.quantity + droppedItem.quantity,
            };
          }
          // If target slot is empty, create new stack
          else if (!targetItem) {
            newInventory[targetIndex] = {
              ...droppedItem,
              splitItem: undefined,
              sourceType: undefined,
              sourceIndex: undefined,
            };
          }
          return newInventory;
        }
  
        // Handle non-split items
        const sourceItem = newInventory[droppedItem.sourceIndex];
        if (targetItem && targetItem.id === sourceItem?.id) {
          // Stack items
          newInventory[targetIndex] = {
            ...targetItem,
            quantity: targetItem.quantity + sourceItem.quantity,
          };
          newInventory[droppedItem.sourceIndex] = null;
        } else {
          // Swap items
          newInventory[droppedItem.sourceIndex] = targetItem;
          newInventory[targetIndex] = sourceItem;
        }
  
        return newInventory;
      });
    } else if (droppedItem.sourceType === "quickslot") {
      handleQuickSlotToInventoryDrop(droppedItem, targetIndex, targetItem);
    } else if (droppedItem.sourceType === "equipment") {
      // console.log("item dropping", droppedItem.name.length !== 0);

      if (droppedItem.name !== "") {
        handleEquipmentToInventoryDrop(droppedItem, targetIndex);
      }

      
    }
    
    trackItemMovement(droppedItem, fromSection, toSection, fromSlot, toSlot);
  };


  const handleEquipmentToInventoryDrop = (droppedItem, targetIndex) => {
    const targetInventoryItem = inventory[targetIndex];
    
    if (droppedItem.name === "") {
      return
    }
  
    // If the target slot is empty, just move the equipped item there
    if (!targetInventoryItem) {
      setInventory(prev => {
        const newInventory = [...prev];
        newInventory[targetIndex] = {
          ...droppedItem,
          sourceType: undefined,
          sourceIndex: undefined
        };
        return newInventory;
      });
  
      // Clear the equipment slot
      setEquipment(prev => ({
        ...prev,
        [droppedItem.sourceSlot]: null
      }));
    } else {
      // If target slot has an item, check if it can be equipped
      const canEquip = targetInventoryItem.slot && 
                      targetInventoryItem.slot.toLowerCase() === droppedItem.sourceSlot.toLowerCase();
  
      if (canEquip) {
        // Swap the items
        setInventory(prev => {
          const newInventory = [...prev];
          newInventory[targetIndex] = {
            ...droppedItem,
            sourceType: undefined,
            sourceIndex: undefined
          };
          return newInventory;
        });
  
        setEquipment(prev => ({
          ...prev,
          [droppedItem.sourceSlot]: targetInventoryItem
        }));
      }
    }
  };

  
  // 3. Update handleDropToGround to handle split items
  const handleDropToGround = (item) => {
    if (!item) return;
    const fromSection = item.sourceType;
    const fromSlot = item.sourceType === "equipment" ? item.sourceSlot : item.sourceIndex;
    const toSection = "ground";
    const toSlot = null;
    console.log("ohh i drop the item",item)
    if (item.name === "") {
      return
    }
    trackItemMovement({
      ...item,
      slot: item.sourceType === "equipment" ? item.sourceSlot : (item.slot || fromSlot + 1)
    }, fromSection, toSection, fromSlot, toSlot);
    const groundItem = {
      id: item.id,
      name: item.name,
      icon: item.icon,
      type: item.type, // Preserve the type
      quantity: item.quantity,
      slot: item.sourceType === "equipment" ? item.sourceSlot : item.slot
    };

    setGroundItems((prev) => [...prev, groundItem]);

    // Only clear source if it's not a split item
    if (!item.splitItem) {
      if (item.sourceType === "inventory") {
        setInventory((prev) => {
          const newInventory = [...prev];
          newInventory[item.sourceIndex] = null;
          return newInventory;
        });
      } else if (item.sourceType === "quickslot") {
        setQuickSlots((prev) => {
          const newQuickSlots = [...prev];
          newQuickSlots[item.sourceIndex] = null;
          return newQuickSlots;
        });
      } else if (item.sourceType === "equipment") {
        
        setEquipment((prev) => {
          // Equipment is an object, so we need to handle it differently
          const newEquipment = {...prev};
          // Clear the specific equipment slot using the sourceSlot property
          if (item.sourceSlot) {
              newEquipment[item.sourceSlot] = null;
          }
          return newEquipment;
      });
      }
    }
  };

  const handleEquipItem = (item, slotName) => {
    const slot = slotName.toLowerCase();
    if (!item) return;
  
    const fromSection = item.sourceType;
    const fromSlot = item.sourceIndex;
    const toSection = "equipment";
    const toSlot = slotName;
    // If the item is already in this equipment slot, do nothing
    if (item.sourceType === "equipment" && item.sourceSlot === slot) {
      return true; // Indicate successful "drop" without changes
    }
  
    if (!item || !item.slot || item.slot.toLowerCase() !== slot) {
      console.log("Invalid equipment slot");
      return false;
    }
  
    try {
      setEquipment((prev) => {
        const currentEquipped = prev[slot];
  
        // Handle currently equipped item
        if (currentEquipped) {
          if (item.sourceType === "quickslot") {
            // If item is from quickslot, swap with quickslot
            setQuickSlots((prev) => {
              const newQuickSlots = [...prev];
              newQuickSlots[item.sourceIndex] = currentEquipped;
              return newQuickSlots;
            });
          } 
          else {
            // Otherwise try to put in inventory
            const emptySlot = inventory.findIndex((slot) => !slot);
            if (emptySlot !== -1) {
              setInventory((prev) => {
                const newInventory = [...prev];
                newInventory[emptySlot] = currentEquipped;
                return newInventory;
              });
            } else {
              console.log("Inventory is full, cannot unequip current item");
              return prev;
            }
          }
        }
  
        // Remove item from source
        if (item.sourceType === "inventory") {
          setInventory((prev) => {
            const newInventory = [...prev];
            newInventory[item.sourceIndex] = null;
            return newInventory;
          });
        } else if (item.sourceType === "quickslot") {
          setQuickSlots((prev) => {
            const newQuickSlots = [...prev];
            newQuickSlots[item.sourceIndex] = null;
            return newQuickSlots;
          });
        }
  
        // Update equipment
        return {
          ...prev,
          [slot]: {
            ...item,
            sourceType: "equipment",
            sourceSlot: slot,
          },
        };
      });
      trackItemMovement(item, fromSection, toSection, fromSlot, toSlot);
      return true;
    } catch (error) {
      console.error("Error equipping item:", error);
      return false;
    }
  };
  // 5. Update handleQuickSlotDrop to handle split items
  const handleQuickSlotDrop = (droppedItem, targetIndex) => {
  if (!droppedItem) return;
  const fromSection = droppedItem.sourceType;
  const fromSlot = droppedItem.sourceIndex;
  const toSection = "quickslot";
  const toSlot = targetIndex;
  if (droppedItem.name === "") {
    return;
  }
  if (droppedItem.sourceType === "equipment") {
  
    // Handle equipment to quickslot
    setQuickSlots((prev) => {
      const newQuickSlots = [...prev];
      newQuickSlots[targetIndex] = {
        ...droppedItem,
        sourceType: undefined,
        sourceIndex: undefined
      };
      return newQuickSlots;
    });

    setEquipment((prev) => ({
      ...prev,
      [droppedItem.sourceSlot]: null
    }));
  } else if (droppedItem.sourceType === "quickslot") {
    // Existing quickslot logic...
    setQuickSlots((prev) => {
      const newQuickSlots = [...prev];
      if (droppedItem.splitItem) {
        const targetItem = newQuickSlots[targetIndex];
        if (targetItem && targetItem.id === droppedItem.id) {
          newQuickSlots[targetIndex] = {
            ...targetItem,
            quantity: targetItem.quantity + droppedItem.quantity,
          };
        } else if (!targetItem) {
          newQuickSlots[targetIndex] = {
            ...droppedItem,
            splitItem: undefined,
            sourceType: undefined,
            sourceIndex: undefined,
          };
        }
      } else {
        const temp = newQuickSlots[targetIndex];
        newQuickSlots[targetIndex] = newQuickSlots[droppedItem.sourceIndex];
        newQuickSlots[droppedItem.sourceIndex] = temp;
      }
      return newQuickSlots;
    });
  } else if (droppedItem.sourceType === "inventory") {
    handleInventoryToQuickSlotDrop(droppedItem, targetIndex);
  }
  trackItemMovement(droppedItem, fromSection, toSection, fromSlot, toSlot);
};

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedItem) {
        setDragPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    const handleMouseUp = (e) => {
      if (!draggedItem) return;

      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const dropTarget = elements.find((el) => el.dataset.droppable === "true");

      if (dropTarget) {
        const { type, index } = dropTarget.dataset;
        switch (type) {
          case "inventory":
            handleInventoryDrop(draggedItem, parseInt(index));
            break;
          case "quickslot":
            handleQuickSlotDrop(draggedItem, parseInt(index));
            break;
          case "equipment":
            handleEquipItem(draggedItem, dropTarget.dataset.slotName);
            break;
          default:
            handleDropToGround(draggedItem);
        }
      } else {
        handleDropToGround(draggedItem);
      }

      setDraggedItem(null);
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedItem]);

  const [equipment, setEquipment] = useState({
    hat: null, // Changed from Hat
    watch: null, // Changed from Watch
    armor: null, // Changed from Armor
    shirt: null, // Changed from Shirt
    weapon: null, // Changed from Weapon
    pants: null, // Changed from Pants
    shoes: null, // Changed from Shoes
  });
  const [groundItems, setGroundItems] = useState(initialGroundItems);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("quickSlots", JSON.stringify(quickSlots));
  }, [inventory, quickSlots]);

  const handleItemClick = (e, item, slotIndex = null) => {
    if (!e || !e.currentTarget) return; // Guard clause

    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    setShowItemMenu({
      item,
      slotIndex,
      position: { x, y },
    });
  };

  const handleQuickSlotToInventoryDrop = (
    droppedItem,
    targetIndex,
    targetItem,
  ) => {
    if (droppedItem.splitItem) {
      // Handle split item from quickslot
      const sourceQuickSlot = quickSlots[droppedItem.sourceIndex];

      setInventory((prev) => {
        const newInventory = [...prev];
        if (targetItem && targetItem.id === droppedItem.id) {
          // Stack with existing item
          newInventory[targetIndex] = {
            ...targetItem,
            quantity: targetItem.quantity + droppedItem.quantity,
          };
        } else if (!targetItem) {
          // Place in empty slot
          newInventory[targetIndex] = {
            ...droppedItem,
            splitItem: undefined,
            sourceType: undefined,
            sourceIndex: undefined,
          };
        }
        return newInventory;
      });

      setQuickSlots((prev) => {
        const newQuickSlots = [...prev];
        const remainingQuantity =
          sourceQuickSlot.quantity - droppedItem.quantity;

        if (remainingQuantity <= 0) {
          newQuickSlots[droppedItem.sourceIndex] = null;
        } else {
          newQuickSlots[droppedItem.sourceIndex] = {
            ...sourceQuickSlot,
            quantity: remainingQuantity,
          };
        }
        return newQuickSlots;
      });
    } else {
      // Handle full quickslot item
      setInventory((prev) => {
        const newInventory = [...prev];
        if (targetItem && targetItem.id === droppedItem.id) {
          // Stack with existing item
          newInventory[targetIndex] = {
            ...targetItem,
            quantity: targetItem.quantity + droppedItem.quantity,
          };
          // Clear source quickslot since all items were stacked
          setQuickSlots((prev) => {
            const newQuickSlots = [...prev];
            newQuickSlots[droppedItem.sourceIndex] = null;
            return newQuickSlots;
          });
        } else {
          // Handle swapping or placing in inventory
          if (targetItem) {
            // Swap items
            newInventory[targetIndex] = {
              ...droppedItem,
              sourceType: undefined,
              sourceIndex: undefined,
            };
            // Move inventory item to quickslot
            setQuickSlots((prev) => {
              const newQuickSlots = [...prev];
              newQuickSlots[droppedItem.sourceIndex] = {
                ...targetItem,
                sourceType: undefined,
                sourceIndex: undefined,
              };
              return newQuickSlots;
            });
          } else {
            // Just place in empty inventory slot
            newInventory[targetIndex] = {
              ...droppedItem,
              sourceType: undefined,
              sourceIndex: undefined,
            };
            // Clear source quickslot
            setQuickSlots((prev) => {
              const newQuickSlots = [...prev];
              newQuickSlots[droppedItem.sourceIndex] = null;
              return newQuickSlots;
            });
          }
        }
        return newInventory;
      });
    }
  };

  const handleInventoryToQuickSlotDrop = (droppedItem, targetIndex) => {
    const targetQuickSlotItem = quickSlots[targetIndex];
    const sourceInventoryItem = inventory[droppedItem.sourceIndex];

    if (droppedItem.splitItem) {
      setQuickSlots((prev) => {
        const newQuickSlots = [...prev];
        if (targetQuickSlotItem && targetQuickSlotItem.id === droppedItem.id) {
          // Stack with existing quickslot item
          newQuickSlots[targetIndex] = {
            ...targetQuickSlotItem,
            quantity: targetQuickSlotItem.quantity + droppedItem.quantity,
          };
        } else if (!targetQuickSlotItem) {
          // Place in empty quickslot
          newQuickSlots[targetIndex] = {
            ...droppedItem,
            splitItem: undefined,
            sourceType: undefined,
            sourceIndex: undefined,
          };
        }
        return newQuickSlots;
      });

      setInventory((prev) => {
        const newInventory = [...prev];
        const remainingQuantity =
          sourceInventoryItem.quantity - droppedItem.quantity;

        if (remainingQuantity <= 0) {
          newInventory[droppedItem.sourceIndex] = null;
        } else {
          newInventory[droppedItem.sourceIndex] = {
            ...sourceInventoryItem,
            quantity: remainingQuantity,
          };
        }
        return newInventory;
      });
    } else {
      // Handle full inventory item
      setQuickSlots((prev) => {
        const newQuickSlots = [...prev];
        // If there's an item in the target quickslot, we'll swap it
        if (targetQuickSlotItem) {
          newQuickSlots[targetIndex] = {
            ...sourceInventoryItem,
            sourceType: undefined,
            sourceIndex: undefined,
          };
        } else {
          // Just place the inventory item in the empty quickslot
          newQuickSlots[targetIndex] = {
            ...sourceInventoryItem,
            sourceType: undefined,
            sourceIndex: undefined,
          };
        }
        return newQuickSlots;
      });

      setInventory((prev) => {
        const newInventory = [...prev];
        // If there was an item in the quickslot, place it in the inventory
        if (targetQuickSlotItem) {
          newInventory[droppedItem.sourceIndex] = {
            ...targetQuickSlotItem,
            sourceType: undefined,
            sourceIndex: undefined,
          };
        } else {
          // Just clear the source inventory slot
          newInventory[droppedItem.sourceIndex] = null;
        }
        return newInventory;
      });
    }
  };

  const handlePickupItem = (item, index) => {
    if (!item) return;
    const fromSection = "ground";
    const fromSlot = index;
    const toSection = "inventory";
    const toSlot = inventory.findIndex((slot) => !slot);
  
    const quantityToPickup = item.selectedQuantity || item.quantity;
   
    const existingItemIndex = inventory.findIndex(
      (inv) => inv && inv.id === item.id,
    );
    console.log("we pickup this item",item)
    
    trackItemMovement({
      ...item,
      type: item.type,
      slot: item.slot || toSlot + 1
    }, fromSection, toSection, fromSlot, toSlot);
  
    if (existingItemIndex !== -1) {
      setInventory((prev) =>
        prev.map((inv, idx) =>
          idx === existingItemIndex && inv
            ? { ...inv, quantity: inv.quantity + quantityToPickup }
            : inv,
        ),
      );
      
  
      setGroundItems((prev) => {
        const remainingQuantity = item.quantity - quantityToPickup;
        return remainingQuantity <= 0
          ? prev.filter((_, i) => i !== index)
          : prev.map((groundItem, i) =>
              i === index
                ? { ...groundItem, quantity: remainingQuantity, selectedQuantity: undefined }
                : groundItem
            );
      });
      return;
    }
  
    const emptySlotIndex = inventory.findIndex((slot) => !slot);
  
    if (emptySlotIndex !== -1) {
      setInventory((prev) => {
        const newInventory = [...prev];
        newInventory[emptySlotIndex] = {
          ...item,
          quantity: quantityToPickup,
        };
        return newInventory;
      });
  
      setGroundItems((prev) => {
        const remainingQuantity = item.quantity - quantityToPickup;
        return remainingQuantity <= 0
          ? prev.filter((_, i) => i !== index)
          : prev.map((groundItem, i) =>
              i === index
                ? { ...groundItem, quantity: remainingQuantity, selectedQuantity: undefined }
                : groundItem
            );
            
      });
    } else {
      console.log("Inventory is full!");
      return;
    }
  };

  const handleGlobalMouseMove = (e) => {
    if (draggedItem) {
      setDragPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleGlobalMouseUp = (e) => {
    if (!draggedItem) return;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const dropTarget = elements.find((el) => el.dataset.droppable === "true");

    if (dropTarget) {
      const { type, index, slotName } = dropTarget.dataset;

      switch (type) {
        case "inventory":
          handleInventoryDrop(draggedItem, parseInt(index));
          break;
        case "quickslot":
          handleQuickSlotDrop(draggedItem, parseInt(index));
          break;
        case "equipment":
          handleEquipItem(draggedItem, slotName);
          break;
        default:
          handleDropToGround(draggedItem);
      }
    } else {
      handleDropToGround(draggedItem);
    }

    setDraggedItem(null);
    setIsDragging(false);
  };
  const updateItemQuantity = (index, newQuantity) => {
    setInventory((prev) => {
      const updated = [...prev];
      if (newQuantity > 0) {
        updated[index] = { ...updated[index], quantity: newQuantity };
      } else {
        updated[index] = null; // or however you handle empty slots
      }
      return updated;
    });
  };
  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      className={`${currentLayout.container} ${currentLayout.containerStyle}`}
      id="inventory"
    >
      <div className={currentLayout.gridLayout}>
        {/* Character Equipment Panel */}
        <div className={`rounded-lg flex flex-col`}>
          <h2
            className={`${activeTheme.text} text-md font-bold p-4 flex justify-center items-center gap-2`}
          >
            <div className={`border p-2 ${activeTheme.accent}`}>
              <User className="w-5 h-5" />
            </div>{" "}
            User
          </h2>
          <div className="grid grid-cols-1 gap-3 p-4">
            {["hat", "watch", "armor", "shirt", "pants", "shoes"].map(
              (slot) => (
                <EquipmentSlot
                  key={slot}
                  slotName={slot}
                  theme={activeTheme}
                  image={equipmentImages[slot]}
                  label={slot.charAt(0).toUpperCase() + slot.slice(1)}
                  handleEquipItem={handleEquipItem}
                  equippedItem={equipment[slot]}
                  onClick={(e) => handleItemClick(e, slot)}
                />
              ),
            )}
          </div>
        </div>
        <div className={`rounded-lg flex flex-col justify-between gap-6`}>
          {/* Main Inventory */}
          <div className={`rounded-lg flex flex-col`}>
            {/* <h2
              className={`${activeTheme.text} text-lg font-bold p-4 flex items-center gap-2`}
            >
              <div className={`border p-2 ${activeTheme.accent}`}>
                {" "}
                <Package className="w-5 h-5" />{" "}
              </div>
              Inventory
            </h2> */}
            <div className="p-4">
              <div className={`rounded w-[35%] p-2 text-gray-300 ${activeTheme.secondary}`}>
              <InventoryWeight/>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className={`grid ${currentLayout.inventoryGrid}`}>
                {inventory.map((item, index) =>
                  item ? (
                    <InventoryItem
                      key={`inv-${index}`}
                      item={item}
                      theme={activeTheme}
                      onClick={(e) => handleItemClick(e, item)}
                      onDrop={(droppedItem) =>
                        handleInventoryDrop(droppedItem, index)
                      }
                      layout={currentLayout}
                      handleDropToGround={handleDropToGround}
                      index={index}
                      updateItemQuantity={updateItemQuantity}
                    />
                  ) : (
                    <EmptySlot
                      key={`empty-inv-${index}`}
                      theme={activeTheme}
                      onDrop={(droppedItem) =>
                        handleInventoryDrop(droppedItem, index)
                      }
                      index={index}
                      type="inventory"
                    />
                  ),
                )}
              </div>
            </div>
          </div>
          {/* Ground Items Panel - Updated to be more compact */}

          <div className={`col-span-2 rounded-lg flex flex-col`}>
            <div className={`grid ${currentLayout.groundItemsGrid}`}>
              <GroundItems
                items={groundItems}
                theme={activeTheme}
                handlePickupItem={handlePickupItem}
              />
            </div>
          </div>
        </div>
        {/* Quick Slots Panel */}
        <div className={`rounded-lg flex flex-col`}>
          <h2
            className={`${activeTheme.text} text-lg font-bold p-4 flex items-center gap-2`}
          >
            <div className={`border p-2 ${activeTheme.accent}`}>
              {" "}
              <Zap className="w-5 h-5" />
            </div>{" "}
            Quick Access
          </h2>
          <div className="flex-1 p-4">
            <div className={`grid ${currentLayout.quickSlotsGrid}`}>
              {quickSlots.map((item, index) => (
                <QuickSlot
                  key={index}
                  item={item}
                  theme={activeTheme}
                  layout={currentLayout}
                  index={index}
                  onClick={(e) => item && handleItemClick(e, item, index)}
                  onDrop={(droppedItem) =>
                    handleQuickSlotDrop(droppedItem, index)
                  }
                  handleDropToGround={handleDropToGround}
                  updateItemQuantity={updateItemQuantity}
                  isSelected={index === selectedQuickSlot}
                  onSelect={() => handleQuickSlotSelect(index)} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 p-4 bg-gray-800/90 rounded-full hover:bg-gray-700 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>

      {draggedItem && (
      <DragPreview 
        item={draggedItem}
        position={dragPosition}
      />
    )}

      {/* Enhanced Settings Modal */}
      {showSettings && (
        <EnhancedSettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)} // Pass the function to close the modal
          theme={activeTheme}
          onThemeChange={setActiveTheme} // Pass the state setter function
          layout={activeLayout}
          onLayoutChange={setActiveLayout} // Pass the layout setter function
        />
      )}
      {/* Item Action Menu */}
      {showItemMenu && (
        <ItemMenu
          showItemMenu={showItemMenu}
          setShowItemMenu={setShowItemMenu}
          activeTheme={activeTheme}
          inventory={inventory}
          setInventory={setInventory}
          quickSlots={quickSlots}
          setQuickSlots={setQuickSlots}
          menuPosition={{
            x: showItemMenu.position.x,
            y: showItemMenu.position.y,
          }}
        />
      )}
    </div>
  );
}
