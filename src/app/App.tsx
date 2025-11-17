import { Outlet } from "react-router-dom";
import Sidebar from "../widgets/Sidebar/ui";

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="main__content">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
