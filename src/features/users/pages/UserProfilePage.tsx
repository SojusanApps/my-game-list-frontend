import * as React from "react";
import { useParams, Link, Navigate } from "react-router-dom";

import { useGetUserDetails } from "../hooks/userQueries";
import { useCurrentUserId } from "@/features/auth";
import FriendshipButtons from "../components/FriendshipButtons";
import UserProfileInformation from "../components/UserProfileInformation";
import UserFriendsList from "../components/UserFriendsList";
import UserStatistics from "../components/UserStatistics";
import GameListUpdate from "../components/GameListUpdate";
import { Box, Grid, Group, Skeleton, Stack, Title } from "@mantine/core";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";
import { Button } from "@/components/ui/Button";

export default function UserProfilePage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);
  const userId = parsedId.success ? parsedId.data : undefined;

  const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserDetails(userId);
  const currentUserId = useCurrentUserId();

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const validUserId = parsedId.data;

  const pageTitle = isUserDetailsLoading ? "Loading Profile..." : `${userDetails?.username}'s Profile`;

  return (
    <Box py={48} style={{ minHeight: "100vh" }}>
      <Grid gutter={24} maw={1152} mx="auto" px={16}>
        <PageMeta title={pageTitle} />

        {isUserDetailsLoading ? (
          <>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap={16}>
                <Skeleton w="100%" h={192} style={{ borderRadius: 12 }} />
                <Skeleton w="100%" h={40} style={{ borderRadius: 8 }} />
                <Skeleton w="100%" h={40} style={{ borderRadius: 8 }} />
                <Skeleton w="100%" h={128} style={{ borderRadius: 12 }} />
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap={16}>
                <Skeleton w="33%" h={32} style={{ borderRadius: 8 }} />
                <Skeleton w="100%" h={192} style={{ borderRadius: 12 }} />
                <Skeleton w="100%" h={256} style={{ borderRadius: 12 }} />
              </Stack>
            </Grid.Col>
          </>
        ) : (
          <>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap={16}>
                <Box
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    border: "1px solid var(--color-background-200)",
                  }}
                >
                  <SafeImage
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                    src={userDetails?.gravatar_url || undefined}
                    alt="User avatar"
                  />
                </Box>

                <FriendshipButtons currentUserId={currentUserId} userId={validUserId} />

                <Link to={`/game-list/${validUserId}`} style={{ width: "100%", textDecoration: "none" }}>
                  <Button fullWidth variant="default">
                    Game List
                  </Button>
                </Link>

                <Link to={`/profile/${validUserId}/collections`} style={{ width: "100%", textDecoration: "none" }}>
                  <Button fullWidth variant="outline">
                    Collections
                  </Button>
                </Link>

                <UserProfileInformation userDetails={userDetails} />
                <UserFriendsList userDetails={userDetails} />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap={24}>
                <Title order={1} fz={30} fw={700} c="var(--color-text-900)">
                  {userDetails?.username}
                </Title>

                <Box
                  component="section"
                  style={{
                    background: "white",
                    borderRadius: 12,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    border: "1px solid var(--color-background-200)",
                    padding: 24,
                  }}
                >
                  <Title order={2} fz={18} fw={700} c="var(--color-text-900)" mb={16}>
                    Statistics
                  </Title>
                  <UserStatistics userDetails={userDetails} />
                </Box>

                <Box
                  component="section"
                  style={{
                    background: "white",
                    borderRadius: 12,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    border: "1px solid var(--color-background-200)",
                    padding: 24,
                  }}
                >
                  <Group
                    justify="space-between"
                    align="center"
                    pb={16}
                    mb={16}
                    style={{ borderBottom: "1px solid var(--color-background-200)" }}
                  >
                    <Title order={2} fz={18} fw={700} c="var(--color-text-900)">
                      Last game updates
                    </Title>
                    <Link
                      to={`/game-list/${userDetails?.id}`}
                      style={{ fontSize: 13, fontWeight: 500, color: "var(--mantine-color-primary-6)" }}
                    >
                      View History
                    </Link>
                  </Group>

                  <Stack gap={12}>
                    {userDetails?.latest_game_list_updates.map(latestGameListUpdate => (
                      <GameListUpdate key={latestGameListUpdate.id} latestGameListUpdate={latestGameListUpdate} />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Grid.Col>
          </>
        )}
      </Grid>
    </Box>
  );
}
