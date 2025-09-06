import { type ReactNode } from "react";
import Navbar from "../components/header/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useUiStore } from "../stores/uiStore";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <div>
      {/* Navbar */}
      <Navbar setSidebarOpen={setSidebarOpen}></Navbar>

      <div className="flex flex-row overflow-y-auto">
        {/* Sidebar */}
        <Sidebar
          sidebarIsOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        ></Sidebar>

        {/* Contenido principal */}
        <main className="flex-1 md:h-[calc(100vh-56px)] h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
