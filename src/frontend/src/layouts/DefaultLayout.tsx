import Navbar from "../components/header/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useUiStore } from "../stores/uiStore";
import { Outlet } from "react-router";

export default function DefaultLayout() {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar setSidebarOpen={setSidebarOpen}></Navbar>

      <div className="flex flex-row overflow-y-auto">
        {/* Sidebar */}
        <Sidebar
          sidebarIsOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        ></Sidebar>

        {/* Contenido principal */}
        <main className="flex-1 md:h-[calc(100vh-56px)] ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
