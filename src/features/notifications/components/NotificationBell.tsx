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

import { SafeImage } from "@/components/ui/SafeImage";

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
      <div tabIndex={0} role="button" className="relative p-2 rounded-full hover:bg-white/10 transition-colors group">
        <div className="relative">
          <BellIcon className="h-6 w-6 text-primary-200 group-hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold text-white ring-2 ring-primary-950 animate-in fade-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-50 mt-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-background-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="p-4 border-b border-background-100 flex justify-between items-center bg-background-50/50">
          <h2 className="font-bold text-text-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full uppercase tracking-wider">
              {unreadCount} New
            </span>
          )}
        </div>

        <ul className="max-h-100 overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-2">
          {unreadNotifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <BellIcon className="h-10 w-10 text-background-300 mb-2" />

              <p className="text-sm text-text-500 font-medium">No unread notifications</p>
            </li>
          ) : (
            unreadNotifications.map((notification: Notification) => {
              const actorResult = notificationActorSchema.safeParse(notification.actor);

              const actor = actorResult.success ? actorResult.data : null;

              return (
                <li
                  key={notification.id}
                  className="bg-background-200/50 border border-background-300/50 rounded-xl hover:bg-background-200 transition-all duration-200 group overflow-hidden shadow-xs hover:shadow-md"
                >
                  <Link
                    to={actor?.type === "user" ? `/profile/${actor.id}` : "#"}
                    onClick={() => handleNotificationClick(notification)}
                    className="flex gap-4 p-3"
                  >
                    <div className="shrink-0 relative transition-transform duration-300 group-hover:scale-105">
                      <SafeImage
                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                        src={undefined} // Fallback to placeholder for now, or use gravatar if available in actor
                        fallback={AvatarImagePlaceholder}
                        alt="Actor avatar"
                      />

                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-500 border-2 border-white rounded-full shadow-xs" />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-sm text-text-900 truncate group-hover:text-primary-600 transition-colors">
                          {actor?.str || "Someone"}
                        </span>

                        <span className="text-[10px] font-medium text-text-400 whitespace-nowrap pt-0.5">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-text-600 leading-snug line-clamp-2 mt-0.5 italic">
                        {notification.verb}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>

        <div className="p-3 bg-background-50/80 border-t border-background-100">
          <Link
            to="/notifications"
            className="block text-center text-xs font-bold text-primary-600 hover:text-primary-700 py-1 uppercase tracking-widest transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
}
