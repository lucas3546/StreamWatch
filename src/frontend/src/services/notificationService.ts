import type { NotificationModel } from "../components/types/NotificationModel";
import type { PagedResponse } from "../components/types/PagedResponse";
import { api } from "./api";

export interface GetPagedNotificationsRequest {
  pageNumber: number;
  pageSize: number;
}

type GetPagedNotificationsResponse = PagedResponse<NotificationModel>;

export async function getPagedNotifications(req: GetPagedNotificationsRequest) {
  const response = await api.get<GetPagedNotificationsResponse>(
    "/notification/paged",
    {
      params: {
        PageNumber: req.pageNumber,
        PageSize: req.pageSize,
      },
    },
  );
  return response.data;
}

export async function removeNotification(notificationId: string) {
  return await api.delete(`/notification/remove/${notificationId}`);
}
