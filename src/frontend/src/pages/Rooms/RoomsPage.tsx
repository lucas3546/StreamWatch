import { useEffect, useState } from "react";
import {
  getPagedRooms,
  type GetPagedRoomsItem,
} from "../../services/roomService";
import RoomCard from "../../components/cards/RoomCard";
import RoomGrid from "../../components/grids/RoomGrid";
import { useParams } from "react-router";
import { useSignalR } from "../../hooks/useSignalR";
import { TbReload } from "react-icons/tb";
import Icon from "../../components/icon/Icon";

interface RoomPageProps {
  category?: string;
  order?: string;
}

export default function RoomsPage({ category, order }: RoomPageProps) {
  const { categoryName } = useParams();
  category = categoryName || "All";
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rooms, setRooms] = useState<GetPagedRoomsItem[]>([]);
  const [pendingRooms, setPendingRooms] = useState<GetPagedRoomsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { connection } = useSignalR();

  useEffect(() => {
    console.log("Category changed, resetting state:", category);
    setRooms([]);
    setPage(1);
    setTotalPages(0);
  }, [category]);

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
  }, [order, page]);

  useEffect(() => {
    if (!connection || !category) return;

    connection
      .invoke("JoinRoomCreatedCategoryGroup", category)
      .catch((err) => console.error("Error joining group:", err));

    const handler = (data: any) => {
      const newRoom: GetPagedRoomsItem = {
        roomId: data.roomId,
        thumbnailUrl: data.thumbnailUrl,
        title: data.title,
        category: data.category,
        provider: data.provider,
        userCount: data.userCount,
        createdAt: data.createdAt,
      };

      setPendingRooms((prev) => [newRoom, ...prev]);
    };

    connection.off(`ReceiveCreatedRoom`, handler);

    if (order !== "MostUsers") {
      connection.on(`ReceiveCreatedRoom`, handler);
    }

    return () => {
      connection.off(`ReceiveCreatedRoom`, handler);
      connection
        .invoke("LeaveRoomCreatedCategoryGroup", category)
        .catch((err) => console.error("Error leaving group:", err));
    };
  }, [connection, category]);

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

  const onClickSetPendingRooms = () => {
    setRooms((prev) => [...pendingRooms, ...prev]);
    setPendingRooms([]);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <RoomGrid>
        {rooms?.map((room) => (
          <RoomCard
            key={room.roomId}
            roomId={room.roomId}
            thumbnailUrl={room.thumbnailUrl}
            title={room.title}
            category={room.category}
            provider={room.provider}
            connectedUsers={room.userCount}
          />
        )) || null}
        {loading && <p className="col-span-full text-center">Loading...</p>}
      </RoomGrid>
      {pendingRooms.length > 0 && (
        <button
          className="
            fixed bottom-6 right-6
            hover:bg-neutral-700
            bg-neutral-800 text-white
            rounded-sm
            shadow-xl
            cursor-pointer
            px-4 py-2
            flex items-center gap-2
          "
          onClick={onClickSetPendingRooms}
        >
          <Icon icon={TbReload}></Icon>
          Load {pendingRooms.length} new rooms
        </button>
      )}
    </div>
  );
}
