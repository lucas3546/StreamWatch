import { useNavigate } from "react-router";
import type { GetPagedReportItemResponse } from "../../../services/reportService";
import type { ReportCategoryType } from "../../types/ReportCategoryType";

interface ReportMenuItemProps {
  report: GetPagedReportItemResponse;
}

const categoryColorMap: Record<ReportCategoryType, string> = {
  IllegalContent: "bg-red-700/30 text-red-300 border border-red-600/40",
  DangerousLinks:
    "bg-orange-700/30 text-orange-300 border border-orange-600/40",
  Gore: "bg-orange-600/20 text-orange-300",
  AnimalAbuse: "bg-orange-600/20 text-orange-300",
  Harassment: "bg-yellow-700/20 text-yellow-300",
  Spam: "bg-yellow-600/20 text-yellow-200",
  IncorrectCategory: "bg-green-700/20 text-green-300",
  Other: "bg-neutral-600/20 text-neutral-300",
};

const targetColorMap: Record<"User" | "Room", string> = {
  User: "text-blue-300",
  Room: "text-purple-300",
};

export default function ReportMenuItem({ report }: ReportMenuItemProps) {
  const navigate = useNavigate();

  const goToReport = () => {
    navigate("/report/" + report.id);
  };
  return (
    <div
      onClick={goToReport}
      className="
        w-full px-3 py-2
        hover:bg-neutral-850/70
        transition-colors duration-150
        border-b border-neutral-800
        hover:bg-neutral-500
        cursor-pointer
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`
            text-[10px] font-semibold px-1.5 py-[2px] rounded tracking-wide
            ${categoryColorMap[report.category]}
          `}
        >
          {report.category}
        </span>

        <span className="text-xs font-bold text-gray-300">{report.state}</span>
      </div>

      {/* Detalles */}
      {report.details && (
        <div className="text-xs text-neutral-200 leading-snug line-clamp-2">
          {report.details}
        </div>
      )}

      {/* Footer */}
      <div className="mt-1 flex justify-between gap-3">
        <span
          className={`
            text-[11px] overflow-hidden whitespace-nowrap text-ellipsis max-w-[60%] block
            ${targetColorMap[report.targetType]}
          `}
          title={report.targetId}
        >
          {report.targetType} • {report.targetId}
        </span>

        <span className="text-[11px] text-neutral-500 whitespace-nowrap">
          {new Date(report.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
