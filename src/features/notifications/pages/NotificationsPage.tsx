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
import { IconTrash, IconCheck } from "@tabler/icons-react";
import { notificationActorSchema } from "@/lib/validation";
import pageStyles from "./NotificationsPage.module.css";
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";
import { Table, Badge, Loader, Tooltip, ActionIcon, Group, Pagination, Box, Text, Title } from "@mantine/core";
import { Button } from "@/components/ui/Button";

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
  const addToPage = hasNext ? 1 : 0;
  const totalPages = hasNext || hasPrevious ? Math.max(page + addToPage, page) : 1;

  const handleMarkAsRead = (id: number) => {
    markAsRead({ id });
  };

  const handleMarkAllRead = () => {
    if (globalThis.confirm("Are you sure you want to mark all notifications as read?")) {
      markAllAsRead();
    }
  };

  const handleDeleteOne = (id: number) => {
    if (globalThis.confirm("Are you sure you want to delete this notification?")) {
      deleteOne({ id });
    }
  };

  const handleDeleteAllRead = () => {
    if (globalThis.confirm("Are you sure you want to delete all read notifications?")) {
      deleteAllRead();
    }
  };

  if (isLoading) {
    return (
      <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "256px" }}>
        <Loader size="lg" />
      </Box>
    );
  }

  const hasUnread = notifications.some(n => n.unread);
  const hasRead = notifications.some(n => !n.unread);

  return (
    <Box maw={1024} mx="auto" p={16}>
      <PageMeta title="Notifications" />
      <Group justify="space-between" align="center" mb={24} gap={16} wrap="wrap">
        <Group gap={8}>
          <Title order={1} fz={24} fw={700}>
            All Notifications
          </Title>
          {isFetching && <Loader size="sm" />}
        </Group>
        <Group gap="sm">
          {hasUnread && (
            <Button onClick={handleMarkAllRead} size="sm">
              <IconCheck style={{ width: 16, height: 16, marginRight: 4 }} />
              Mark all as read
            </Button>
          )}
          {hasRead && (
            <Button onClick={handleDeleteAllRead} variant="destructive" size="sm">
              <IconTrash style={{ width: 16, height: 16, marginRight: 4 }} />
              Delete all read
            </Button>
          )}
        </Group>
      </Group>

      <Box
        style={{ overflowX: "auto", background: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Status</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Action</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {notifications.length === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={5}
                  style={{ textAlign: "center", paddingBlock: "32px", color: "var(--color-text-400)" }}
                >
                  No notifications found.
                </Table.Td>
              </Table.Tr>
            ) : (
              notifications.map((notification: Notification) => {
                const actorResult = notificationActorSchema.safeParse(notification.actor);
                const actor = actorResult.success ? actorResult.data : null;
                return (
                  <Table.Tr
                    key={notification.id}
                    bg={notification.unread ? "var(--mantine-color-primary-0)" : undefined}
                  >
                    <Table.Td>
                      {notification.unread ? (
                        <Badge size="sm" color="blue">
                          New
                        </Badge>
                      ) : (
                        <Badge size="sm" variant="light" color="gray" style={{ opacity: 0.5 }}>
                          Read
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={12}>
                        <Box style={{ width: "40px", height: "40px", borderRadius: "9999px", overflow: "hidden" }}>
                          <SafeImage
                            src={undefined}
                            alt="User avatar"
                            containerStyle={{ width: "40px", height: "40px" }}
                          />
                        </Box>
                        <Link
                          to={actor?.type === "user" ? `/profile/${actor.id}` : "#"}
                          className={pageStyles.tableUserLink}
                        >
                          {actor?.str || "Someone"}
                        </Link>
                      </Group>
                    </Table.Td>
                    <Table.Td>{notification.verb}</Table.Td>
                    <Table.Td>
                      <Text component="span" fz="sm" style={{ opacity: 0.7 }}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {notification.unread && (
                          <Tooltip label="Mark as read">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <IconCheck style={{ width: 16, height: 16 }} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        {!notification.unread && (
                          <Tooltip label="Delete">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() => handleDeleteOne(notification.id)}
                            >
                              <IconTrash style={{ width: 16, height: 16 }} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Box>

      {(hasNext || hasPrevious) && (
        <Group justify="center" mt={24}>
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}
    </Box>
  );
}
