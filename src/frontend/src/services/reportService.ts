import type { PagedResponse } from "../components/types/PagedResponse";
import type { ReportCategoryType } from "../components/types/ReportCategoryType";
import type { ReportStateType } from "../components/types/ReportStateType";
import type { ReportTargetType } from "../components/types/ReportTargetType";
import { api } from "./api";

export interface GetPagedReportsRequest {
  pageNumber: number;
  pageSize: number;
  state: ReportStateType;
}

export interface GetPagedReportItemResponse {
  id: number;
  details?: string;
  targetId: string;
  targetType: ReportTargetType;
  category: ReportCategoryType;
  state: ReportStateType;
  createdAt: string;
}

type GetPagedReportsResponse = PagedResponse<GetPagedReportItemResponse>;

export async function getPagedReports(req: GetPagedReportsRequest) {
  const response = await api.get<GetPagedReportsResponse>("/reports/paged", {
    params: {
      PageNumber: req.pageNumber,
      PageSize: req.pageSize,
      State: req.state,
    },
  });
  return response.data;
}

export interface GetReportResponse {
  id: number;
  details?: string;
  targetId: string;
  targetType: ReportTargetType;
  category: ReportCategoryType;
  state: ReportStateType;
  ipAddress: string;
  createdBy: string;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
}

export async function getReport(reportId: number) {
  return await api
    .get<GetReportResponse>(`/reports/get/${reportId}`)
    .then((res) => res.data);
}

export interface UpdateReportState {
  id: number;
  state: ReportStateType;
}

export async function updateReportState(request: UpdateReportState) {
  return await api
    .put(`/reports/update-state/`, request)
    .then((res) => res.data);
}
