import {
  NotificationService,
  NotificationListData,
  NotificationMarkAsReadCreateData,
  NotificationDestroyData,
  NotificationWritable,
} from "@/client";
import StatusCode from "@/utils/StatusCode";

export type NotificationListDataQuery = NotificationListData["query"];

export const getNotifications = async (query?: NotificationListDataQuery) => {
  const { data, response } = await NotificationService.notificationList({ query });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching notifications");
  }
  return data;
};

export const getUnreadNotificationCount = async () => {
  const { data, response } = await NotificationService.notificationUnreadCountRetrieve();
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching unread notification count");
  }
  return data;
};

export type NotificationMarkAsReadCreateDataPath = NotificationMarkAsReadCreateData["path"];

export const markNotificationAsRead = async (path: NotificationMarkAsReadCreateDataPath) => {
  const { data, response } = await NotificationService.notificationMarkAsReadCreate({
    path,
    body: {} as NotificationWritable,
  });
  if (
    response.status !== StatusCode.OK &&
    response.status !== StatusCode.CREATED &&
    response.status !== StatusCode.NO_CONTENT
  ) {
    throw new Error("Error marking notification as read");
  }
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data, response } = await NotificationService.notificationMarkAllAsReadCreate({
    body: {} as NotificationWritable,
  });
  // TODO: It should return 204 on backend, fix the swagger generation.
  if (
    response.status !== StatusCode.OK &&
    response.status !== StatusCode.CREATED &&
    response.status !== StatusCode.NO_CONTENT
  ) {
    throw new Error("Error marking all notifications as read");
  }
  return data;
};

export type NotificationDestroyDataPath = NotificationDestroyData["path"];

export const deleteNotification = async (path: NotificationDestroyDataPath) => {
  const { data, response } = await NotificationService.notificationDestroy({ path });
  if (response.status !== StatusCode.NO_CONTENT) {
    throw new Error("Error deleting notification");
  }
  return data;
};

export const deleteAllReadNotifications = async () => {
  const { data, response } = await NotificationService.notificationDeleteAllReadDestroy();
  if (response.status !== StatusCode.NO_CONTENT) {
    throw new Error("Error deleting all read notifications");
  }
  return data;
};
