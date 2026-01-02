import { useState } from "react";
import type { PagedResponse } from "../types/PagedResponse";
import {
  searchUsers,
  type SearchPagedUsersResponseItem,
} from "../../services/accountService";
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
    setSearchResults(null);
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
          {searchResults && searchResults.totalPages > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button
                disabled={searchPage <= 1}
                onClick={() => handleSearch(searchPage - 1)}
                className="
                  flex items-center gap-1 rounded-md border border-neutral-700
                  bg-neutral-900 px-3 py-1.5 text-neutral-200
                  hover:bg-neutral-800 hover:text-white
                  disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900
                  transition
                "
              >
                ← Previous
              </button>

              <span className="px-3 py-1 text-neutral-400">
                Page
                <span className="mx-1 font-medium text-neutral-200">
                  {searchResults.page}
                </span>
                of
                <span className="ml-1 font-medium text-neutral-200">
                  {searchResults.totalPages}
                </span>
              </span>

              <button
                disabled={searchPage >= searchResults.totalPages}
                onClick={() => handleSearch(searchPage + 1)}
                className="
                  flex items-center gap-1 rounded-md border border-neutral-700
                  bg-neutral-900 px-3 py-1.5 text-neutral-200
                  hover:bg-neutral-800 hover:text-white
                  disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900
                  transition
                "
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
