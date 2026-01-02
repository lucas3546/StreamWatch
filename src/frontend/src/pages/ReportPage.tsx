import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getReport,
  updateReportState,
  type GetReportResponse,
  type UpdateReportStateRequest,
} from "../services/reportService";

import {
  getAccountProfile,
  type GetAccountProfileResponse,
} from "../services/accountService";
import ProfilePic from "../components/avatar/ProfilePic";

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<GetReportResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [createdByUserProfile, setCreatedByUserProfile] =
    useState<GetAccountProfileResponse>();
  const [lastModifiedByUserProfile, setLastModifiedByUserProfile] =
    useState<GetAccountProfileResponse>();

  const navigate = useNavigate();

  // Fetch del reporte
  useEffect(() => {
    if (!reportId) return;
    setIsLoading(true);

    (async () => {
      const response = await getReport(parseInt(reportId));
      setReport(response);
      setIsLoading(false);
    })();
  }, [reportId]);

  // Fetch perfiles
  useEffect(() => {
    if (!report) return;

    if (report.createdBy) {
      getAccountProfile(report.createdBy).then(setCreatedByUserProfile);
    }
    if (report.lastModifiedBy) {
      getAccountProfile(report.lastModifiedBy).then(
        setLastModifiedByUserProfile,
      );
    }
  }, [report]);

  if (isLoading)
    return (
      <div className="p-4 text-center text-neutral-300">
        Cargando reporte...
      </div>
    );
  if (!report)
    return (
      <div className="p-4 text-center text-neutral-300">
        No se encontró el reporte.
      </div>
    );

  const onClickMarkNoReviewed = async () => {
    const request: UpdateReportStateRequest = {
      id: report.id,
      state: "NotReviewed",
    };

    await updateReportState(request);

    window.location.reload();
  };

  const onClickMarkRefused = async () => {
    const request: UpdateReportStateRequest = {
      id: report.id,
      state: "Refused",
    };

    await updateReportState(request);

    window.location.reload();
  };

  const onClickMarkAccepted = async () => {
    const request: UpdateReportStateRequest = {
      id: report.id,
      state: "Accepted",
    };

    await updateReportState(request);

    window.location.reload();
  };

  const onClickTargetId = () => {
    if (report.targetType === "User") {
      navigate("/profile/" + report.targetId);
    } else if (report.targetType === "Room") {
      navigate("/room/" + report.targetId);
    }
  };

  function UserInfo({
    label,
    user,
  }: {
    label: string;
    user?: GetAccountProfileResponse;
  }) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-neutral-900 border border-neutral-800">
        <span className="text-[11px] opacity-60 min-w-[80px]">{label}</span>
        {user ? (
          <div className="flex items-center gap-2 min-w-0">
            <ProfilePic
              userName={user.userName}
              fileUrl={user.profilePicThumbnailUrl}
            />
            <a
              href={`/profile/${user.userId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium truncate"
            >
              {user.userName}
            </a>
          </div>
        ) : (
          <span className="text-sm opacity-70">-</span>
        )}
      </div>
    );
  }

  function InfoItem({ label, value }: { label: string; value: any }) {
    return (
      <div
        className="flex flex-col p-2 rounded-md bg-neutral-900 border border-neutral-800"
        onClick={onClickTargetId}
      >
        <span className="text-[11px] opacity-60">{label}</span>
        <span className="text-sm font-medium truncate">{value ?? "-"}</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-lg shadow-md text-neutral-200 space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-2 justify-between border-b border-neutral-800 pb-3">
        <h1 className="text-lg font-semibold">Report #{report.id}</h1>
        <span className="text-[10px] px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 uppercase tracking-wide">
          {report.state}
        </span>
      </header>

      {/* Core info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <InfoItem label="Target ID" value={report.targetId} />
        <InfoItem label="Target Type" value={report.targetType} />
        <InfoItem label="Category" value={report.category} />
        <InfoItem label="State" value={report.state} />
        <InfoItem label="IP Address" value={report.ipAddress} />
        <InfoItem label="Created" value={formatDate(report.createdAt)} />
        <InfoItem
          label="Last Modified"
          value={formatDate(report.lastModifiedAt)}
        />
      </section>

      {/* Users */}
      <section className="border border-neutral-800 rounded-lg p-4 space-y-3">
        <h2 className="font-medium text-sm border-b border-neutral-800 pb-2">
          Users
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <UserInfo label="Created By" user={createdByUserProfile} />
          <UserInfo label="Modified By" user={lastModifiedByUserProfile} />
        </div>
      </section>

      {/* Details */}
      {report.details && (
        <section className="border border-neutral-800 rounded-lg p-4">
          <h2 className="font-medium text-sm mb-2">Details</h2>
          <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-md text-sm whitespace-pre-wrap leading-normal">
            {report.details}
          </div>
        </section>
      )}

      {/* Actions */}
      <footer className="flex flex-wrap gap-2 justify-end border-t border-neutral-800 pt-4">
        <button
          onClick={onClickMarkRefused}
          className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-xs sm:text-sm cursor-pointer"
        >
          Mark Refused
        </button>
        <button
          onClick={onClickMarkNoReviewed}
          className="px-3 py-1.5 rounded-md bg-neutral-600 hover:bg-neutral-700 text-xs sm:text-sm cursor-pointer"
        >
          Mark No Reviewed
        </button>
        <button
          onClick={onClickMarkAccepted}
          className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-xs sm:text-sm cursor-pointer"
        >
          Mark Accepted
        </button>
        <button
          onClick={() => navigate("/reports/")}
          className="px-3 py-1.5 rounded-md bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-xs sm:text-sm cursor-pointer"
        >
          Back
        </button>
      </footer>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}
