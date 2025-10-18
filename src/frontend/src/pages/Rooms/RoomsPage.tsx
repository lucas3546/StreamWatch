import { useEffect, useState } from "react";
import {
  getPagedRooms,
  type GetPagedRoomsItem,
} from "../../services/roomService";
import RoomCard from "../../components/cards/RoomCard";
import RoomGrid from "../../components/grids/RoomGrid";
import { useParams } from "react-router";

interface RoomPageProps {
  category?: string;
  order?: string;
}

export default function RoomsPage({ category, order }: RoomPageProps) {
  const { categoryName } = useParams(); // <-- viene de la URL
  category = categoryName || "All";
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rooms, setRooms] = useState<GetPagedRoomsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (loading) return;
      setLoading(true);
      console.log("fetching rooms");
      try {
        const data = await getPagedRooms({
          pageNumber: page,
          pageSize: 10,
          category,
          includeNswf: true,
          orderBy: order,
        });
        console.log(data);
        setRooms((prev) => [...prev, ...data.items]);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [page, category, order]);

  // Scroll automático
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        page < totalPages
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPages]);

  useEffect(() => {
    if (
      !loading &&
      document.body.scrollHeight <= window.innerHeight &&
      page < totalPages
    ) {
      setPage((p) => p + 1);
    }
  }, [rooms, loading, totalPages, page]);

  useEffect(() => {
    console.log("Category changed, resetting state:", category);
    setRooms([]);
    setPage(1);
    setTotalPages(0);
  }, [category]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <RoomGrid>
        {rooms.map((room) => (
          <RoomCard
            key={room.roomId}
            roomId={room.roomId}
            thumbnailUrl={room.thumbnailUrl}
            title={room.title}
            category={room.category.toLowerCase()}
            provider={room.videoProvider}
            connectedUsers={room.userCount}
          />
        ))}
        {loading && <p className="col-span-full text-center">Loading...</p>}
      </RoomGrid>
    </div>
  );
}
