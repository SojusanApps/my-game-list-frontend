import * as React from "react";
import { Link } from "react-router-dom";
import { Notification } from "@/client";
import { NotificationListDataQuery } from "../api/notification";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteAllReadNotifications,
} from "../hooks/notificationQueries";
import { IconTrash, IconCheck } from "@tabler/icons-react";
import pageStyles from "./NotificationsPage.module.css";
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  Table,
  Badge,
  Loader,
  Tooltip,
  ActionIcon,
  Group,
  Pagination,
  Box,
  Text,
  Title,
  SegmentedControl,
  Select,
} from "@mantine/core";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage(): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const [unreadFilter, setUnreadFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [levelFilter, setLevelFilter] = React.useState<string | null>(null);

  const queryParams: Record<string, boolean | string | undefined | number> = { page };
  if (unreadFilter === "unread") {
    queryParams.unread = true;
  }
  if (unreadFilter === "read") {
    queryParams.unread = false;
  }
  if (categoryFilter) {
    queryParams.category = categoryFilter;
  }
  if (levelFilter) {
    queryParams.level = levelFilter;
  }

  const {
    data: notificationsData,
    isLoading,
    isFetching,
  } = useGetNotifications(queryParams as NotificationListDataQuery);
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

  const hasUnread = notifications.some((n: Notification) => n.unread);
  const hasRead = notifications.some((n: Notification) => !n.unread);

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "info":
        return "blue";
      case "warning":
        return "yellow";
      case "success":
        return "green";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "system":
        return "gray";
      case "friendship":
        return "violet";
      case "game_release":
        return "orange";
      default:
        return "blue";
    }
  };

  const formatText = (text?: string) => {
    if (!text) return "Unknown";
    return text
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

      <Group mb={16} gap={16} align="flex-end">
        <SegmentedControl
          value={unreadFilter}
          onChange={val => {
            setUnreadFilter(val);
            setPage(1);
          }}
          data={[
            { label: "All", value: "all" },
            { label: "Unread", value: "unread" },
            { label: "Read", value: "read" },
          ]}
        />
        <Select
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={val => {
            setCategoryFilter(val);
            setPage(1);
          }}
          data={[
            { label: "System", value: "system" },
            { label: "Friendship", value: "friendship" },
            { label: "Game Release", value: "game_release" },
          ]}
          clearable
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by level"
          value={levelFilter}
          onChange={val => {
            setLevelFilter(val);
            setPage(1);
          }}
          data={[
            { label: "Info", value: "info" },
            { label: "Success", value: "success" },
            { label: "Warning", value: "warning" },
            { label: "Error", value: "error" },
          ]}
          clearable
          style={{ width: 200 }}
        />
        {(unreadFilter !== "all" || categoryFilter !== null || levelFilter !== null) && (
          <Button
            variant="ghost"
            onClick={() => {
              setUnreadFilter("all");
              setCategoryFilter(null);
              setLevelFilter(null);
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        )}
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
              <Table.Th>Category</Table.Th>
              <Table.Th>Level</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {notifications.length === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={7}
                  style={{ textAlign: "center", paddingBlock: "32px", color: "var(--color-text-400)" }}
                >
                  No notifications found.
                </Table.Td>
              </Table.Tr>
            ) : (
              notifications.map((notification: Notification) => {
                const actor = notification.actor;
                const target = notification.target;

                let displayEntity = undefined;
                if (actor?.type === "user") {
                  displayEntity = actor;
                } else if (target?.type === "user") {
                  displayEntity = target;
                }

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
                            src={displayEntity?.gravatar_url || undefined}
                            alt="User avatar"
                            containerStyle={{ width: "40px", height: "40px" }}
                          />
                        </Box>
                        <Link
                          to={displayEntity?.type === "user" ? `/profile/${displayEntity.id}` : "#"}
                          className={pageStyles.tableUserLink}
                        >
                          {displayEntity?.str || "Someone"}
                        </Link>
                      </Group>
                    </Table.Td>
                    <Table.Td>{notification.verb}</Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light" color={getCategoryColor(notification.category)}>
                        {formatText(notification.category)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="dot" color={getLevelColor(notification.level)}>
                        {formatText(notification.level)}
                      </Badge>
                    </Table.Td>
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
