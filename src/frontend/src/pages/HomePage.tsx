import * as React from "react";
import Navbar from "../components/header/Navbar";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar></Navbar>
      <p className="bg-amber-400">Inicio</p>
    </div>
  );
};

export default HomePage;
