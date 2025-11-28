import { useState } from "react";
import type { PagedResponse } from "../types/PagedResponse";
import {
  searchUsers,
  type SearchPagedUsersResponseItem,
} from "../../services/accountService";
import Button from "../buttons/Button";
import UserFriendItem from "./UserFriendItem";

interface UserSearchContainerProps {
  onFriendAction: (userId: string, newStatus: string) => void;
}

export default function UserSearchContainer({
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

  return (
    <div>
      {/* Buscador */}
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-white border-1 rounded-sm p-1 w-full"
        />
        <button
          className="bg-neutral-700 hover:bg-neutral-600 cursor-pointer p-2 rounded-sm"
          onClick={() => handleSearch()}
        >
          Buscar
        </button>
      </div>

      {/* Resultados de búsqueda */}
      {searchLoading && <p>Buscando...</p>}

      {searchResults && (
        <div>
          <ul className="flex flex-col flex-wrap md:flex-row gap-1">
            {searchResults.items.map((u) => {
              return (
                <UserFriendItem
                  userId={u.id}
                  userName={u.userName}
                  profilePic={u.profilePicThumb}
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
