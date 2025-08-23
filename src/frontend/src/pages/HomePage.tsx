import * as React from "react";
import RoomCard from "../components/cards/RoomCard";

const HomePage: React.FC = () => {
  const im =
    "https://images.pexels.com/photos/355288/pexels-photo-355288.jpeg?cs=srgb&dl=pexels-pixabay-355288.jpg&fm=jpg";
  return (
    <div className="grid gap-2 p-2 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      <RoomCard thumbnail={im} title="asd" provider="asd" />
      <RoomCard
        thumbnail="https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2025/01/flow-mundo-salvar-4285688.jpg?tf=3840x"
        title="asd"
        provider="asd"
      />
      <RoomCard thumbnail={im} title="otro" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
      <RoomCard thumbnail={im} title="más" provider="asd" />
    </div>
  );
};

export default HomePage;
