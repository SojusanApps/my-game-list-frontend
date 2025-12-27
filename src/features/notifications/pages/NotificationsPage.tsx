import * as React from "react";
import { Link } from "react-router-dom";
import { Notification } from "@/client";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteAllReadNotifications,
} from "../hooks/notificationQueries";
import AvatarImagePlaceholder from "@/assets/images/Image_Placeholder.svg";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { notificationActorSchema } from "@/lib/validation";

export default function NotificationsPage(): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const { data: notificationsData, isLoading, isFetching } = useGetNotifications({ page });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteOne } = useDeleteNotification();
  const { mutate: deleteAllRead } = useDeleteAllReadNotifications();

  const notifications = notificationsData?.results ?? [];
  const hasNext = !!notificationsData?.next;
  const hasPrevious = !!notificationsData?.previous;

  const handleMarkAsRead = (id: number) => {
    markAsRead({ id });
  };

  const handleMarkAllRead = () => {
    if (window.confirm("Are you sure you want to mark all notifications as read?")) {
      markAllAsRead();
    }
  };

  const handleDeleteOne = (id: number) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      deleteOne({ id });
    }
  };

  const handleDeleteAllRead = () => {
    if (window.confirm("Are you sure you want to delete all read notifications?")) {
      deleteAllRead();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const hasUnread = notifications.some(n => n.unread);
  const hasRead = notifications.some(n => !n.unread);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">All Notifications</h1>
          {isFetching && <span className="loading loading-spinner loading-sm text-primary"></span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {hasUnread && (
            <button onClick={handleMarkAllRead} className="btn btn-primary btn-sm">
              <CheckIcon className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
          )}
          {hasRead && (
            <button onClick={handleDeleteAllRead} className="btn btn-error btn-outline btn-sm">
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete all read
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Status</th>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No notifications found.
                </td>
              </tr>
            ) : (
              notifications.map((notification: Notification) => {
                const actorResult = notificationActorSchema.safeParse(notification.actor);
                const actor = actorResult.success ? actorResult.data : null;
                return (
                  <tr key={notification.id} className={notification.unread ? "bg-blue-50" : ""}>
                    <td>
                      {notification.unread ? (
                        <div className="badge badge-primary badge-sm">New</div>
                      ) : (
                        <div className="badge badge-ghost badge-sm opacity-50">Read</div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img src={AvatarImagePlaceholder} alt="User avatar" />
                          </div>
                        </div>
                        <div>
                          <Link
                            to={actor?.type === "user" ? `/profile/${actor.id}` : "#"}
                            className="font-bold hover:text-primary-600"
                          >
                            {actor?.str || "Someone"}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>{notification.verb}</td>
                    <td>
                      <span className="text-sm opacity-70">{new Date(notification.timestamp).toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {notification.unread && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="btn btn-ghost btn-xs text-primary-600 tooltip"
                            data-tip="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        {!notification.unread && (
                          <button
                            onClick={() => handleDeleteOne(notification.id)}
                            className="btn btn-ghost btn-xs text-error tooltip"
                            data-tip="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {(hasNext || hasPrevious) && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button className="join-item btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!hasPrevious}>
              «
            </button>

            <button className="join-item btn">Page {page}</button>

            <button className="join-item btn" onClick={() => setPage(p => p + 1)} disabled={!hasNext}>
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
