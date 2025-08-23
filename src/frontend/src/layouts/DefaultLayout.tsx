import { useEffect, useState, type ReactNode } from "react";
import Navbar from "../components/header/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Navbar setSidebarOpen={setSidebarOpen}></Navbar>

      <div className="flex flex-row">
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
