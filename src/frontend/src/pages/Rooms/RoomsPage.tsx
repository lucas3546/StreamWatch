import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useParams } from "react-router";
import {
  getPagedRooms,
  type GetPagedRoomsItem,
} from "../../services/roomService";
import RoomCard from "../../components/cards/RoomCard";
import RoomGrid from "../../components/grids/RoomGrid";

export default function RoomsPage() {
  const { category = "All", order = "Recent" } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);

  const [rooms, setRooms] = useState<GetPagedRoomsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        const data = await getPagedRooms({
          pageNumber: page,
          pageSize: 10,
          //@ts-ignore: Test
          category: category as any,
          includeNswf: true,
          orderBy: order as any,
        });
        setRooms(data.items);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [category, order, page]);

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
