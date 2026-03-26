import * as React from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Collection, CollectionCollectionsListData } from "@/client";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useCollectionsInfiniteQuery } from "../hooks/useCollectionQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { GridList } from "@/components/ui/GridList";
import { Skeleton, Stack, Group, Box, Title, Text, Select, UnstyledButton } from "@mantine/core";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { Button } from "@/components/ui/Button";
import CollectionCard from "../components/CollectionCard";
import CreateCollectionModal from "../components/CreateCollectionModal";
import { useIsOwner } from "@/features/auth";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";

const routeApi = getRouteApi("/profile_/$id/collections");

export default function CollectionsPage(): React.JSX.Element {
  const { id } = routeApi.useParams();
  const userId = Number(id);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: userDetails, isLoading: isUserLoading } = useGetUserDetails(userId);

  const effectiveUserId = userId || userDetails?.id;
  const isOwner = useIsOwner(effectiveUserId);

  const skeletonIds = React.useMemo(() => Array.from({ length: 8 }).map((_, i) => `skeleton-${i}`), []);

  const [isFavoriteFilter, setIsFavoriteFilter] = React.useState<boolean | null>(null);
  const [visibilityFilter, setVisibilityFilter] = React.useState<string | null>(null);
  const [modeFilter, setModeFilter] = React.useState<string | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  const queryFilters = React.useMemo(() => {
    const filters: Required<CollectionCollectionsListData>["query"] = {};
    if (isFavoriteFilter !== null) filters.is_favorite = isFavoriteFilter;
    if (visibilityFilter !== null) filters.visibility = [visibilityFilter as "FRI" | "PRI" | "PUB"];
    if (modeFilter !== null) filters.mode = [modeFilter as "C" | "S"];
    if (typeFilter !== null) filters.type = [typeFilter as "NOR" | "RNK" | "TIE"];
    return filters;
  }, [isFavoriteFilter, visibilityFilter, modeFilter, typeFilter]);

  const {
    data: collectionsResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectionsInfiniteQuery(userId, queryFilters);

  const pageTitle = isUserLoading ? "Loading Collections..." : `${userDetails?.username}'s Collections`;

  const allItems = collectionsResults?.pages.flatMap(page => page.results) || [];

  const favoriteFilters = [
    { id: null, label: "All", emoji: "📂" },
    { id: true, label: "Favorites", emoji: "❤️" },
  ];

  return (
    <Box py={48} style={{ minHeight: "100vh" }}>
      <PageMeta title={pageTitle} />
      <Stack gap={40} maw={1280} mx="auto" px={16}>
        <Stack align="center" gap={32}>
          <Stack align="center">
            <Title
              order={1}
              fz={{ base: 30, md: 36 }}
              fw={900}
              c="var(--color-text-900)"
              ta="center"
              style={{ letterSpacing: "-0.025em" }}
            >
              <span style={{ color: "var(--mantine-color-primary-6)" }}>{userDetails?.username}</span>
              {"'s Collections"}
            </Title>
            {isOwner && (
              <Text
                span
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  color: "var(--mantine-color-primary-5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: "8px",
                  padding: "4px 12px",
                  background: "var(--mantine-color-primary-0)",
                  borderRadius: "9999px",
                  border: "1px solid var(--mantine-color-primary-1)",
                }}
              >
                Owner View
              </Text>
            )}
          </Stack>

          <Stack w="100%" gap={16}>
            <CollapsibleSection title="Filters">
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "24px",
                  paddingBlock: "16px",
                }}
              >
                {/* Favorite Filters */}
                <Stack gap={12}>
                  <Text
                    span
                    style={{
                      fontSize: "10px",
                      fontWeight: 900,
                      color: "var(--color-text-400)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginLeft: "4px",
                    }}
                  >
                    Type
                  </Text>
                  <Group wrap="wrap" gap={8}>
                    {favoriteFilters.map(filter => (
                      <UnstyledButton
                        key={String(filter.id)}
                        onClick={() => setIsFavoriteFilter(filter.id)}
                        style={{
                          padding: "8px 20px",
                          fontSize: "12px",
                          fontWeight: 900,
                          borderRadius: "12px",
                          border: "1px solid",
                          transition: "all 300ms",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          ...(isFavoriteFilter === filter.id
                            ? {
                                background: "var(--mantine-color-primary-6)",
                                color: "white",
                                borderColor: "var(--mantine-color-primary-6)",
                                boxShadow: "0 4px 6px -1px rgba(99,102,241,0.3)",
                              }
                            : {
                                background: "white",
                                color: "var(--color-text-500)",
                                borderColor: "var(--color-background-200)",
                              }),
                        }}
                      >
                        <Text span style={{ marginRight: "8px" }}>
                          {filter.emoji}
                        </Text>
                        {filter.label}
                      </UnstyledButton>
                    ))}
                  </Group>
                </Stack>

                {/* Visibility Filter */}
                <Select
                  id="visibility-filter"
                  label="Visibility"
                  value={visibilityFilter}
                  onChange={setVisibilityFilter}
                  clearable
                  placeholder="Any Visibility"
                  data={[
                    { value: "PUB", label: "Public" },
                    { value: "FRI", label: "Friends" },
                    { value: "PRI", label: "Private" },
                  ]}
                />

                {/* Mode Filter */}
                <Select
                  id="mode-filter"
                  label="Mode"
                  value={modeFilter}
                  onChange={setModeFilter}
                  clearable
                  placeholder="Any Mode"
                  data={[
                    { value: "S", label: "Solo" },
                    { value: "C", label: "Collaborative" },
                  ]}
                />

                {/* Type Filter */}
                <Select
                  id="type-filter"
                  label="Type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  clearable
                  placeholder="Any Type"
                  data={[
                    { value: "NOR", label: "Normal" },
                    { value: "RNK", label: "Ranking" },
                    { value: "TIE", label: "Tier List" },
                  ]}
                />
              </Box>
            </CollapsibleSection>

            {isOwner && (
              <Group justify="center">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  style={{
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    borderRadius: 12,
                  }}
                >
                  + Create New Collection
                </Button>
              </Group>
            )}
          </Stack>
        </Stack>

        <Box
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid var(--color-background-200)",
            padding: "24px",
            minHeight: "850px",
          }}
        >
          {isLoading && !isFetchingNextPage ? (
            <GridList columnCount={5}>
              {skeletonIds.map(skeletonId => (
                <Skeleton key={skeletonId} style={{ aspectRatio: "3/4", width: "100%", borderRadius: "24px" }} />
              ))}
            </GridList>
          ) : (
            <VirtualGridList
              items={allItems}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              columnCount={5}
              rowHeight={450}
              renderItem={(collection: Collection) => <CollectionCard key={collection.id} collection={collection} />}
            />
          )}
          {errorFetchingData && (
            <Box
              style={{
                background: "var(--color-error-50)",
                border: "1px solid var(--color-error-200)",
                borderRadius: "12px",
                padding: "16px",
                marginTop: "16px",
              }}
            >
              <Text c="var(--color-error-600)" ta="center" fw={500}>
                Error: {errorFetchingData.message}
              </Text>
            </Box>
          )}
          {!isLoading && allItems.length === 0 && (
            <Stack align="center" justify="center" gap={16} style={{ paddingBlock: "80px", textAlign: "center" }}>
              <Box
                style={{
                  width: "80px",
                  height: "80px",
                  background: "var(--color-background-50)",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text span fz={36}>
                  📂
                </Text>
              </Box>
              <Title order={3} fz="lg" fw={700} c="var(--color-text-900)">
                No collections found
              </Title>
              <Text c="var(--color-text-500)" maw={320}>
                This user hasn&apos;t created any collections yet.
              </Text>
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  style={{ marginTop: 24, fontWeight: 700 }}
                >
                  Create your first collection
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      {isModalOpen && <CreateCollectionModal onClose={() => setIsModalOpen(false)} />}
    </Box>
  );
}
