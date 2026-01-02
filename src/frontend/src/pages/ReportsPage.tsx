import { useEffect, useRef, useState } from "react";
import {
  getPagedReports,
  type GetPagedReportItemResponse,
  type GetPagedReportsRequest,
} from "../services/reportService";
import { useSignalR } from "../hooks/useSignalR";
import ReportMenuItem from "../components/header/notifications/ReportMenuItem";
import FormContainer from "../components/forms/FormContainer";
import type { ReportStateType } from "../components/types/ReportStateType";

export default function ReportsPage() {
  const { connection } = useSignalR();
  const listRef = useRef<HTMLUListElement>(null);
  const [reports, setReports] = useState<GetPagedReportItemResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // <-- loading state
  const [totalItems, setTotalItems] = useState<number>(0);
  const [reportState, setReportState] =
    useState<ReportStateType>("NotReviewed");
  const pageSize = 8;

  const fetchData = async (page: number) => {
    setLoading(true);
    const request: GetPagedReportsRequest = {
      pageNumber: page,
      pageSize: pageSize,
      state: reportState,
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
    setReports([]);
    setPageNumber(1);
    setHasMore(true);
    fetchData(1);
  }, [reportState]);

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
    <FormContainer className="max-h-[90vh] flex flex-col">
      <h1 className="text-2xl text-center">Reports</h1>
      <div>
        <select
          className="bg-neutral-800 hover:bg-neutral-600 px-2 py-1 border-defaultbordercolor border-1 rounded-full"
          value={reportState}
          onChange={(e) => setReportState(e.target.value as ReportStateType)}
        >
          <option value="NotReviewed">Not Reviewed</option>
          <option value="Accepted">Accepted</option>
          <option value="Refused">Refused</option>
        </select>
      </div>
      <p className="text-xs"> Total {totalItems} items</p>
      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="py-1 text-white max-h-[70vh] overflow-y-auto space-y-1 flex-1 border-defaultbordercolor border-1 rounded-xl"
      >
        {reports.map((item) => (
          <ReportMenuItem key={item.id} report={item} />
        ))}

        {loading && (
          <li className="text-center text-sm text-gray-400 py-2">Loading...</li>
        )}
      </ul>
    </FormContainer>
  );
}
