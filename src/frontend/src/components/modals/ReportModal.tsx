import { useState } from "react";
import Icon from "../icon/Icon";
import BaseModal from "./BaseModal";
import type { ReportTargetType } from "../types/ReportTargetType";
import type { ReportCategoryType } from "../types/ReportCategoryType";
import {
  createReport,
  type CreateReportRequest,
} from "../../services/reportService";
import {
  generateProblemDetailsErrorToast,
  generatePromiseToast,
} from "../../utils/toastGenerator";
import type { ProblemDetails } from "../types/ProblemDetails";
import { CgSpinnerTwo } from "react-icons/cg";

interface ReportModalProps {
  reportType: ReportTargetType;
  reportTargetId: string;
  openButtonClassname: string;
  openButtonContent: React.ReactNode;
}

export default function ReportModal({
  reportType,
  reportTargetId,
  openButtonClassname,
  openButtonContent,
}: ReportModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<string | undefined>();
  const [reportCategory, setReportCategory] =
    useState<ReportCategoryType>("Spam");

  const onReportClicked = async () => {
    setIsLoading(true);
    const request: CreateReportRequest = {
      targetType: reportType,
      targetId: reportTargetId,
      details: details,
      category: reportCategory,
    };

    try {
      await generatePromiseToast(
        createReport(request),
        "The report has been sent!",
      );

      setIsOpen(false);
    } catch (error) {
      const err = error as ProblemDetails;

      generateProblemDetailsErrorToast(err);
    } finally {
      setIsLoading(false);
    }
  };

  const footerButtons = (
    <>
      {isLoading ? (
        <button
          disabled
          className="bg-gray-600 flex gap-1 items-center hover:bg-gray-800 text-white py-2 px-3 rounded-2xl transition-colors cursor-pointer"
        >
          Loading
          <div className="animate-spin">
            <Icon icon={CgSpinnerTwo} />
          </div>
        </button>
      ) : (
        <button
          onClick={onReportClicked}
          className="bg-red-600 hover:bg-red-800 text-white py-2 px-3 rounded-2xl transition-colors cursor-pointer"
        >
          Report
        </button>
      )}
    </>
  );

  return (
    <BaseModal
      blurBackground={true}
      title={"Report" + " " + reportType}
      openButtonClassname={openButtonClassname}
      openButtonContent={openButtonContent}
      footerButtons={footerButtons}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-3 w-full" title="Report">
        {/* CATEGORY */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Select category:</label>

          {reportType === "Room" && (
            <select
              className="bg-neutral-800 hover:bg-neutral-700 px-2 py-2 border border-defaultbordercolor rounded-xl"
              value={reportCategory}
              onChange={(e) =>
                setReportCategory(e.target.value as ReportCategoryType)
              }
            >
              <option value="IncorrectCategory">Incorrect Category</option>
              <option value="IllegalContent">Illegal Content</option>
              <option value="Gore">Gore</option>
              <option value="AnimalAbuse">Animal Abuse</option>
              <option value="Other">Other</option>
            </select>
          )}

          {reportType === "User" && (
            <select
              className="bg-neutral-800 hover:bg-neutral-700 px-2 py-2 border border-defaultbordercolor rounded-xl"
              value={reportCategory}
              onChange={(e) =>
                setReportCategory(e.target.value as ReportCategoryType)
              }
            >
              <option value="Spam">Spam</option>
              <option value="IllegalContent">Illegal Content</option>
              <option value="DangerousLinks">Dangerous Links</option>
              <option value="Harassment">Harassment</option>
              <option value="Gore">Gore</option>
              <option value="AnimalAbuse">Animal Abuse</option>
              <option value="Other">Other</option>
            </select>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Details:</label>
          <textarea
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 border border-defaultbordercolor rounded-xl resize-none"
            placeholder="Explain what's happening..."
          ></textarea>
        </div>
      </div>
    </BaseModal>
  );
}
