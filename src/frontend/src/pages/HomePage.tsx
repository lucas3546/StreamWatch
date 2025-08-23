import * as React from "react";
import RoomCard from "../components/cards/RoomCard";

const HomePage: React.FC = () => {
  const im =
    "https://images.pexels.com/photos/355288/pexels-photo-355288.jpeg?cs=srgb&dl=pexels-pixabay-355288.jpg&fm=jpg";
  return (
    <>
      <div className="grid gap-2 p-2 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        <RoomCard
          thumbnail={im}
          title="asd"
          category="music"
          provider="youtube"
          connectedUsers={8}
        />
        <RoomCard
          thumbnail={im}
          title="otro"
          category="movies"
          provider="s3"
          connectedUsers={2}
        />
        <RoomCard
          thumbnail={im}
          title="más"
          category="series"
          provider="local"
          connectedUsers={4}
        />
        <RoomCard
          thumbnail={im}
          title="más"
          category="anime"
          provider="tokyvideo"
          connectedUsers={555}
        />
        <RoomCard
          thumbnail={im}
          title="más"
          category="podcasts"
          provider="asd"
          connectedUsers={1024}
        />
        <RoomCard
          thumbnail={im}
          title="más"
          category="videos"
          provider="asd"
          connectedUsers={3}
        />
      </div>
    </>
  );
};

export default HomePage;
