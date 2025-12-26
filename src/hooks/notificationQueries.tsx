import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
  NotificationListDataQuery,
  NotificationMarkAsReadCreateDataPath,
  NotificationDestroyDataPath,
} from "@/services/api/notification";

export const useGetNotifications = (query?: NotificationListDataQuery) => {
  return useQuery({
    queryKey: ["notifications", query],
    queryFn: () => getNotifications(query),
  });
};

export const useGetUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: NotificationMarkAsReadCreateDataPath) => markNotificationAsRead(path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: NotificationDestroyDataPath) => deleteNotification(path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

export const useDeleteAllReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};
