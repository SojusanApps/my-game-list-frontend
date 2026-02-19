import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useGetUserDetails } from "../hooks/userQueries";
import { useGetFriendshipsInfiniteQuery } from "../hooks/friendshipQueries";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import FriendCard from "../components/FriendCard";
import { Box, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";

export default function UserFriendsPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);
  const userId = parsedId.success ? parsedId.data : undefined;

  const { data: userDetails, isLoading: isUserLoading } = useGetUserDetails(userId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFriendsLoading,
  } = useGetFriendshipsInfiniteQuery({ user: userId });

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const allFriendships = data?.pages.flatMap(page => page.results) || [];
  const totalFriends = data?.pages[0]?.count ?? 0;

  const pageTitle = isUserLoading ? "Loading Friends..." : `${userDetails?.username}'s Friends`;

  const renderFriendsContent = () => {
    if (isFriendsLoading) {
      return (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 7 }} spacing="md">
          {Array.from({ length: 14 }).map((_, i) => {
            const skeletonKey = `friend-skeleton-${i}`;
            return <Skeleton key={skeletonKey} style={{ height: "220px", width: "100%", borderRadius: "12px" }} />;
          })}
        </SimpleGrid>
      );
    }

    if (allFriendships.length === 0) {
      return (
        <Box
          style={{
            textAlign: "center",
            paddingBlock: "48px",
            background: "var(--color-background-50)",
            borderRadius: "12px",
            border: "1px dashed var(--color-background-300)",
          }}
        >
          <Text c="var(--color-text-500)">No friends found.</Text>
        </Box>
      );
    }

    return (
      <VirtualGridList
        style={{ height: "100%" }}
        items={allFriendships}
        renderItem={friendship => <FriendCard friendship={friendship} />}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        rowHeight={220}
      />
    );
  };

  return (
    <Stack gap={24} maw={1152} mx="auto" p={16} style={{ height: "calc(100vh - 4rem)" }}>
      <PageMeta title={pageTitle} />

      <Stack gap={8} style={{ flexShrink: 0 }}>
        <Title
          order={1}
          fz={30}
          fw={700}
          c="var(--color-text-900)"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          {isUserLoading ? (
            <Skeleton style={{ width: "256px", height: "40px" }} />
          ) : (
            <Text component="span">
              <Text component="span" c="var(--mantine-color-primary-6)">
                {userDetails?.username}
              </Text>
              &apos;s Friends
            </Text>
          )}
          {!isFriendsLoading && (
            <Text
              component="span"
              style={{
                fontSize: "18px",
                fontWeight: 400,
                color: "var(--color-text-500)",
                background: "var(--color-background-100)",
                padding: "4px 12px",
                borderRadius: "9999px",
              }}
            >
              {totalFriends}
            </Text>
          )}
        </Title>
      </Stack>

      <Box style={{ flexGrow: 1, minHeight: 0 }}>{renderFriendsContent()}</Box>
    </Stack>
  );
}
