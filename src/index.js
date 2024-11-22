import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DragProvider } from "./DragContext";
import { updateInventoryState } from "./components/InventoryState";
import { armor } from "./components/images/images";

if (window.alt === undefined) {
  window.alt = {
    emit: () => {},
    on: () => {},
    off:()=>{}
  };
}

const formatInventoryData = (data) => {
  const formatted = {
    ClothingItems: {
      Hat: data.ClothingItems?.Hat ? { name: data.ClothingItems.Hat.name, slot: "hat" ,quantity:1,type:"clothing"} : { name: "" },
      Armor: data.ClothingItems?.Armor ? { name: data.ClothingItems.Armor.name, slot: "armor",quantity:1,type:"clothing" } : { name: "" },
      Watch: data.ClothingItems?.Watch ? { name: data.ClothingItems.Watch.name, slot: "watch",quantity:1,type:"clothing" } : { name: "" },
      Pants: data.ClothingItems?.Pants ? { name: data.ClothingItems.Pants.name, slot: "pants",quantity:1,type:"clothing"} : { name: "" },
      Torso: data.ClothingItems?.Torso ? { name: data.ClothingItems.Torso.name, slot: "torso",quantity:1,type:"clothing" } : { name: "" },
      Shoes: data.ClothingItems?.Shoes ? { name: data.ClothingItems.Shoes.name, slot: "shoes",quantity:1,type:"clothing" } : { name: "" },
    },
    InventoryItems: (data.InventoryItems || []).map((item) => ({
      name: item.name || "",
      type: item.type || "",
      quantity: item.quantity || "",
      slot: item.slot || "",
    })),
    QuickItems: (data.QuickItems || []).map((item, index) => ({
      name: item.name || "",
      type: item.type || "clothing",
      quantity: item.quantity || 1,
      slot: item.slot || (index + 1).toString(),
      id: item.id || `quick-${index}`,
    })),
    GroundItems: (data.GroundItems || []).map((item) => ({
      name: item.name || "",
      type: item.type || "",
      quantity: item.quantity || "",
    })),
  };
  return formatted;
};

function OpenInventory(inventoryData = {}) {
  const appElement = document.getElementById("inventory");
  window.closeHotbar()

  // Check if element exists before trying to modify it
  if (appElement) {
    appElement.style.display = "block";
  } else {
    console.warn("Element with ID 'app' not found");
  }

  const formattedData = formatInventoryData(inventoryData);
  // Update equipment/clothing items
  updateInventoryState("setEquipment", {
    hat: formattedData.ClothingItems?.Hat ,
    watch: formattedData.ClothingItems?.Watch,
    shirt: formattedData.ClothingItems?.Torso,
    pants: formattedData.ClothingItems?.Pants,
    shoes: formattedData.ClothingItems?.Shoes,
    armor: formattedData.ClothingItems?.Armor,
  });

  // Update inventory items
  const inventorySlots = Array(20).fill(null);
  formattedData.InventoryItems.forEach((item) => {
    if (item.name && item.slot) {
      const slotIndex = parseInt(item.slot) - 1;
      if (slotIndex >= 0 && slotIndex < 20) {
        inventorySlots[slotIndex] = {
          ...item,
          id: Math.random().toString(),
        };
      }
    }
  });
  window.initialInventory = inventorySlots;
  updateInventoryState("setInventory", inventorySlots);

  // Update quick slots
  const quickSlotItems = Array(4).fill(null);
  formattedData.QuickItems.forEach((item) => {
    if (item.name && item.slot) {
      const slotIndex = parseInt(item.slot) - 1;
      if (slotIndex >= 0 && slotIndex < 4) {
        quickSlotItems[slotIndex] = {
          ...item,
          id: Math.random().toString(),
        };
      }
    }
  });
  window.initialQuickItems = quickSlotItems;
  updateInventoryState("setQuickSlots", quickSlotItems);

  // Update ground items
  const groundItems = formattedData.GroundItems.map((item) => ({
    ...item,
    id: Math.random().toString(),
  }));
  updateInventoryState("setGroundItems", groundItems);
}

function UpdateInventory(inventoryData) {
  const formattedData = formatInventoryData(inventoryData);
  console.log(formattedData)
  // Update equipment/clothing items
  updateInventoryState("setEquipment", {
    hat: formattedData.ClothingItems?.Hat ,
    watch: formattedData.ClothingItems?.Watch,
    shirt: formattedData.ClothingItems?.Torso,
    pants: formattedData.ClothingItems?.Pants,
    shoes: formattedData.ClothingItems?.Shoes,
    armor: formattedData.ClothingItems?.Armor,
  });

  // Update inventory items
  const inventorySlots = Array(20).fill(null);
  formattedData.InventoryItems.forEach((item) => {
    if (item.name && item.slot) {
      const slotIndex = parseInt(item.slot) - 1;
      if (slotIndex >= 0 && slotIndex < 20) {
        inventorySlots[slotIndex] = {
          ...item,
          id: Math.random().toString(),
        };
      }
    }
  });
  window.initialInventory = inventorySlots;
  updateInventoryState("setInventory", inventorySlots);

  // Update quick slots
  const quickSlotItems = Array(4).fill(null);
  formattedData.QuickItems.forEach((item) => {
    if (item.name && item.slot) {
      const slotIndex = parseInt(item.slot) - 1;
      if (slotIndex >= 0 && slotIndex < 4) {
        quickSlotItems[slotIndex] = {
          ...item,
          id: Math.random().toString(),
        };
      }
    }
  });
  window.initialQuickItems = quickSlotItems;
  updateInventoryState("setQuickSlots", quickSlotItems);

  // Update ground items
  const groundItems = formattedData.GroundItems.map((item) => ({
    ...item,
    id: Math.random().toString(),
  }));
  updateInventoryState("setGroundItems", groundItems);
}

function CloseInventory() {

  document.getElementById("inventory").style.display = "none";
  // Clear the inventory when closing
  if (window.setInventory) {
    window.setInventory([]);
  }
  window.initialInventory = [];
  window.alt.emit("CloseInventory");
}

window.OpenInventory = OpenInventory;
window.CloseInventory = CloseInventory;
window.UpdateInventory = UpdateInventory;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DragProvider>
      <App />
    </DragProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.onload = () => window.alt.emit("loaded");

window.alt.on("open", (data) => OpenInventory(data));
window.alt.on("close", () => CloseInventory());
window.alt.on("update", (data) => UpdateInventory(data));

window.alt.on("openHotbar", (data,slot) => window.openHotbar(data,slot));
window.alt.on("closeHotbar", () => window.closeHotbar());
window.alt.on("selectItem", (slot) => window.hotbarSelectItem(slot));
