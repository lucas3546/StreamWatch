import { useState, useRef, useEffect } from "react";
import { PiStarOfDavid } from "react-icons/pi";
import Icon from "../../icon/Icon";

import { useSignalR } from "../../../hooks/useSignalR";

import {
  getPagedReports,
  type GetPagedReportItemResponse,
  type GetPagedReportsRequest,
} from "../../../services/reportService";
import ReportMenuItem from "./ReportMenuItem";
import { useNavigate } from "react-router";

export default function ReportsMenu() {
  const [open, setOpen] = useState(false);
  const { connection } = useSignalR();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement>(null);
  const [reports, setReports] = useState<GetPagedReportItemResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // <-- loading state
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 4;

  const fetchData = async (page: number) => {
    setLoading(true);
    const request: GetPagedReportsRequest = {
      pageNumber: page,
      pageSize: pageSize,
      state: "NotReviewed",
    };
    const response = await getPagedReports(request);

    if (response.items.length < pageSize) {
      setHasMore(false);
    }
    setTotalItems(response.totalItems);
    setReports((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const newItems = response.items.filter((n) => !existingIds.has(n.id));
      return [...prev, ...newItems];
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || !hasMore || loading) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      fetchData(nextPage);
    }
  };

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveReport", (rep: GetPagedReportItemResponse) => {
      console.log("Received report", rep);
      setReports((prev) => [rep, ...prev]);
    });

    return () => {
      connection.off("ReceiveReport");
    };
  }, [connection]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer rounded-full p-0.5 hover:bg-neutral-500"
      >
        <Icon icon={PiStarOfDavid} />
        {totalItems > 0 && (
          <span className="absolute  bottom-2 right-1 translate-x-1/2 translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1">
            {totalItems}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-md shadow-xl z-50">
          <ul
            ref={listRef}
            onScroll={handleScroll}
            className="py-1 text-white max-h-64 overflow-y-auto space-y-1"
          >
            {reports.map((item) => (
              <ReportMenuItem key={item.id} report={item} />
            ))}

            {loading && (
              <li className="text-center text-sm text-gray-400 py-2">
                Loading...
              </li>
            )}
          </ul>

          <button
            onClick={() => navigate("/reports/")}
            className="w-full p-1 mt-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white rounded-b-md transition-colors"
          >
            Go to page
          </button>
        </div>
      )}
    </div>
  );
}
