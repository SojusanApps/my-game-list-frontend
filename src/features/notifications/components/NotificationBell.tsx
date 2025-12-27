import * as React from "react";
import { Link } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { Notification } from "@/client";
import {
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkNotificationAsRead,
} from "../hooks/notificationQueries";
import AvatarImagePlaceholder from "@/assets/images/Image_Placeholder.svg";
import { NotificationUnreadCount } from "@/types";
import { notificationActorSchema } from "@/lib/validation";

export default function NotificationBell(): React.JSX.Element {
  const { data: unreadData } = useGetUnreadNotificationCount();
  const { data: notificationsData } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const unreadCount = (unreadData as unknown as NotificationUnreadCount)?.unread_count ?? 0;
  const notifications = notificationsData?.results ?? [];
  const unreadNotifications = notifications.filter((n: Notification) => n.unread);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.unread) {
      markAsRead({ id: notification.id });
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <BellIcon className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-error indicator-item text-white">{unreadCount}</span>
          )}
        </div>
      </div>
      <div tabIndex={0} className="mt-3 z-1 card card-compact dropdown-content w-80 bg-base-100 shadow">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg">Notifications</span>
          </div>
          <ul className="menu p-0 max-h-96 overflow-y-auto overflow-x-hidden block">
            {unreadNotifications.length === 0 ? (
              <li className="text-center py-4 text-gray-500">No unread notifications</li>
            ) : (
              unreadNotifications.map((notification: Notification) => {
                const actorResult = notificationActorSchema.safeParse(notification.actor);
                const actor = actorResult.success ? actorResult.data : null;
                return (
                  <li key={notification.id} className="bg-blue-50 w-full">
                    <Link
                      to={actor?.type === "user" ? `/profile/${actor.id}` : "#"}
                      onClick={() => handleNotificationClick(notification)}
                      className="flex flex-row items-center gap-3 py-3 whitespace-normal"
                    >
                      <div className="avatar shrink-0">
                        <div className="w-10 rounded-full">
                          <img src={AvatarImagePlaceholder} alt="Actor avatar" />
                        </div>
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm truncate">{actor?.str || "Someone"}</span>
                        <span className="text-xs wrap-break-word">{notification.verb}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto shrink-0"></span>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
          <div className="card-actions justify-center mt-2 border-t pt-2">
            <Link to="/notifications" className="text-primary-600 hover:text-primary-800 font-bold">
              View all notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
