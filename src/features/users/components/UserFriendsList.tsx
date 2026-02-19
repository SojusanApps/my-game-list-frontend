import * as React from "react";
import { Link } from "react-router-dom";
import { Box, Group, Text, Tooltip } from "@mantine/core";
import { UserDetail } from "@/client";
import { SafeImage } from "@/components/ui/SafeImage";

interface UserFriendsListProps {
  userDetails?: UserDetail;
}

export default function UserFriendsList({ userDetails }: Readonly<UserFriendsListProps>) {
  return (
    <Box
      style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid var(--color-background-200)",
        overflow: "hidden",
      }}
    >
      <Group
        justify="space-between"
        align="center"
        style={{
          background: "var(--color-background-50)",
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-background-200)",
        }}
      >
        <Text fw={600} c="var(--color-text-900)">
          Friends
        </Text>
        <Link
          to={userDetails ? `/profile/${userDetails.id}/friends` : "#"}
          style={{ fontSize: 12, fontWeight: 500, color: "var(--mantine-color-primary-6)" }}
        >
          View All
        </Link>
      </Group>
      <Box p={16}>
        {userDetails?.friends && userDetails.friends.length > 0 ? (
          <Group gap={12} wrap="wrap">
            {userDetails.friends.map(friend => (
              <Tooltip key={friend.id} label={friend.username}>
                <Link to={`/profile/${friend.id}`}>
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid var(--color-background-300)",
                    }}
                  >
                    <SafeImage
                      style={{ width: "100%", height: "100%" }}
                      src={friend.gravatar_url || undefined}
                      alt={`friend avatar ${friend.username}`}
                    />
                  </Box>
                </Link>
              </Tooltip>
            ))}
          </Group>
        ) : (
          <Text size="sm" fs="italic" c="var(--color-text-500)">
            No friends yet.
          </Text>
        )}
      </Box>
    </Box>
  );
}
