import { useState, type ReactNode } from "react";
import Navbar from "../components/header/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
