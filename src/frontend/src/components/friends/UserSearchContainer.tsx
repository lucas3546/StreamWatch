import { useState } from "react";
import type { PagedResponse } from "../types/PagedResponse";
import {
  searchUsers,
  type SearchPagedUsersResponseItem,
} from "../../services/accountService";
import type { GetFriendsResponse } from "../../services/friendshipService";
import Button from "../buttons/Button";
import UserFriendItem from "./UserFriendItem";

interface UserSearchContainerProps {
  friends: GetFriendsResponse[];
  onFriendAction: (userId: string, newStatus: string) => void;
}

export default function UserSearchContainer({
  friends,
  onFriendAction,
}: UserSearchContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<PagedResponse<SearchPagedUsersResponseItem> | null>(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await searchUsers({
        pageNumber: page,
        pageSize: 10,
        userName: searchQuery,
      });
      setSearchResults(res);
      setSearchPage(page);
    } finally {
      setSearchLoading(false);
    }
  };

  // 🔹 check si ya es amigo
  const getFriendStatus = (userId: string) => {
    const match = friends.find((f) => f.userId === userId);
    return match ? match.status : null;
  };

  return (
    <div>
      {/* Buscador */}
      <h2 className="text-xl mb-2 mt-2">Search users</h2>
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-white border-1 rounded-sm"
        />
        <button onClick={() => handleSearch()}>Buscar</button>
      </div>

      {/* Resultados de búsqueda */}
      {searchLoading && <p>Buscando...</p>}

      {searchResults && (
        <div>
          <ul className="flex flex-col flex-wrap md:flex-row">
            {searchResults.items.map((u) => {
              const status = getFriendStatus(u.id);
              return (
                <UserFriendItem
                  userId={u.id}
                  userName={u.userName}
                  profilePic={u.profilePicThumb}
                  status={status ?? ""}
                  onFriendAction={onFriendAction}
                ></UserFriendItem>
              );
            })}
          </ul>

          {/* Paginación */}
          <div className="flex gap-2 mt-4">
            <button
              disabled={searchPage <= 1}
              onClick={() => handleSearch(searchPage - 1)}
            >
              Anterior
            </button>
            <span>
              Página {searchResults.page} de {searchResults.totalPages}
            </span>
            <Button
              disabled={searchPage >= searchResults.totalPages}
              onClick={() => handleSearch(searchPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
