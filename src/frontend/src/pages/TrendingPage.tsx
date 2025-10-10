import { useEffect, useState } from "react";
import { getPagedRooms, type GetPagedRoomsItem } from "../services/roomService";
import RoomGrid from "../components/grids/RoomGrid";
import RoomCard from "../components/cards/RoomCard";

export default function TrendingPage() {
  const [page, setPage] = useState<number>(1);
  const [rooms, setRooms] = useState<GetPagedRoomsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        const data = await getPagedRooms({
          pageNumber: 1,
          pageSize: 10,
          //@ts-ignore: Test
          category: "All",
          includeNswf: true,
          orderBy: "MostUsers",
        });
        setRooms(data.items);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [page]);

  return (
    <RoomGrid>
      {loading && <p>Loading...</p>}
      {!loading &&
        rooms.map((room) => (
          <RoomCard
            key={room.roomId}
            roomId={room.roomId}
            thumbnailUrl={room.thumbnailUrl}
            title={room.title}
            category={room.category.toLowerCase()}
            provider={room.videoProvider}
            connectedUsers={room.userCount}
          ></RoomCard>
        ))}
    </RoomGrid>
  );
}
