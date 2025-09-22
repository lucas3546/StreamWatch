import { useEffect, useState } from "react";
import FormContainer from "../components/forms/FormContainer";
import {
  getFriends,
  type GetFriendsResponse,
} from "../services/friendshipService";

import UserSearchContainer from "../components/friends/UserSearchContainer";
import UserFriendItem from "../components/friends/UserFriendItem";

export default function FriendsPage() {
  const [friends, setFriends] = useState<GetFriendsResponse[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  // 🔹 cargar amigos al montar
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data);
      } finally {
        setLoadingFriends(false);
      }
    };
    loadFriends();
  }, []);

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

      // si es otro status, no toco nada
      console.log("nada");
      return prev;
    });
  }

  return (
    <FormContainer>
      {/* Lista de amigos */}
      <div className="flex flex-col w-full">
        <h2 className="text-2xl mb-4">Friends</h2>
        {loadingFriends ? (
          <p>Loading friends...</p>
        ) : friends.length === 0 ? (
          <p>You don´t have any friends yet.</p>
        ) : (
          <ul className="flex flex-col flex-wrap md:flex-row">
            {friends.map((f) => (
              <UserFriendItem
                key={f.userId}
                userId={f.userId}
                userName={f.userName}
                profilePic={f.profileThumbnail}
                status={f.status}
                friendsSince={f.responseDate}
                onFriendAction={onFriendAction}
              ></UserFriendItem>
            ))}
          </ul>
        )}

        <UserSearchContainer
          friends={friends}
          onFriendAction={onFriendAction}
        ></UserSearchContainer>
      </div>
    </FormContainer>
  );
}
