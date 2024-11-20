import AestheticInventory from "./components/Inventory2";
import { DragProvider } from "./DragContext";
import "./App.css";
import HotbarController from "./components/ui/Hotbar";

function App() {
  return (
    <DragProvider>
      <div className="App" id="app">
        <AestheticInventory />
        <HotbarController/>
      </div>
    </DragProvider>
  );
}

export default App;
