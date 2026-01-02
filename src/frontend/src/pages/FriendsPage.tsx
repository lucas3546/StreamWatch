import { useEffect, useState } from "react";
import FormContainer from "../components/forms/FormContainer";
import {
  getFriends,
  type GetFriendsResponse,
} from "../services/friendshipService";

import UserSearchContainer from "../components/friends/UserSearchContainer";
import UserFriendItem from "../components/friends/UserFriendItem";
import { useSignalR } from "../hooks/useSignalR";
import type { UpdateFriendshipStatusModel } from "../components/types/UpdatedFriendshipStatusModel";

export default function FriendsPage() {
  const { connection } = useSignalR();
  const [friends, setFriends] = useState<GetFriendsResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "search">("friends");
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await getFriends();
        console.log(data);
        setFriends(data);
      } finally {
        setLoadingFriends(false);
      }
    };
    loadFriends();
  }, []);

  useEffect(() => {
    if (!connection) return;

    const handler = (state: UpdateFriendshipStatusModel) => {
      console.log("New friendship state received:", state);

      setFriends((prev) => {
        // buscar si existe el amigo en la lista
        const exists = prev.find(
          (f) =>
            f.userId === state.requesterId || f.userId === state.receiverId,
        );

        // si no existe → no hacer nada
        if (!exists) return prev;

        // si existe → mutarlo
        return prev.map((f) => {
          if (f.userId === state.requesterId || f.userId === state.receiverId) {
            return {
              ...f,
              requestDate: state.requestedDate,
              requestedByAccountId: state.requesterId,
              status: state.friendshipStatus,
            };
          }
          return f;
        });
      });
    };

    connection.on("UpdateFriendState", handler);

    return () => {
      connection.off("UpdateFriendState", handler);
    };
  }, [connection]);

  function onFriendAction(userId: string, newStatus: string) {
    setFriends((prev) => {
      if (newStatus === "Declined") {
        // lo saco de la lista
        return prev.filter((friend) => friend.userId !== userId);
      }

      if (newStatus === "Accepted") {
        // lo actualizo en la lista
        return prev.map((friend) =>
          friend.userId === userId ? { ...friend, status: "Accepted" } : friend,
        );
      }

      return prev;
    });
  }

  return (
    <FormContainer>
      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full gap-2 justify-center border-b-1  border-defaultbordercolor mb-2">
          <button
            onClick={() => setActiveTab("friends")}
            className={`text-xl w-full font-medium cursor-pointer ${
              activeTab === "friends"
                ? "border-b-2  border-neutral-200 text-neutral-200"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`text-xl w-full font-medium cursor-pointer ${
              activeTab === "search"
                ? "border-b-2 border-neutral-200 text-neutral-200"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Search
          </button>
        </div>
        {activeTab === "friends" && (
          <>
            {loadingFriends ? (
              <p>Loading friends...</p>
            ) : friends.length === 0 ? (
              <p>You don´t have any friends yet.</p>
            ) : (
              <ul className="flex flex-col flex-wrap md:flex-row gap-1">
                {friends.map((f) => (
                  <UserFriendItem
                    key={f.userId}
                    userId={f.userId}
                    userName={f.userName}
                    profilePic={f.thumbnailUrl}
                    status={f.status}
                    requestedByAccountId={f.requestedByAccountId}
                    onFriendAction={onFriendAction}
                  ></UserFriendItem>
                ))}
              </ul>
            )}
          </>
        )}
        {activeTab === "search" && (
          <UserSearchContainer
            onFriendAction={onFriendAction}
          ></UserSearchContainer>
        )}
      </div>

      {/* Lista de amigos */}
    </FormContainer>
  );
}
