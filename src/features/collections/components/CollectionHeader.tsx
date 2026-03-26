import * as React from "react";
import { Link } from "@tanstack/react-router";
import { CollectionDetail, ModeEnum } from "@/client";
import { Button } from "@/components/ui/Button";
import { useCurrentUserId, useIsOwner } from "@/features/auth";
import { Stack, Group, Title, Text, Flex } from "@mantine/core";

interface CollectionHeaderProps {
  collection: CollectionDetail;
  onEdit?: () => void;
  onAddGame?: () => void;
  onPairwiseRank?: () => void;
}

export const CollectionHeader = ({ collection, onEdit, onAddGame, onPairwiseRank }: CollectionHeaderProps) => {
  const isOwner = useIsOwner(collection.user.id);
  const currentUserId = useCurrentUserId();

  const canEdit = React.useMemo(() => {
    if (isOwner) return true;
    if (!currentUserId) return false;
    return collection.mode === ModeEnum.C && collection.collaborators.some(c => Number(c.id) === currentUserId);
  }, [isOwner, currentUserId, collection.mode, collection.collaborators]);

  return (
    <Stack gap="md" w="100%">
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap="md"
      >
        <Stack gap={8}>
          <Group gap={12} fz="sm" fw={700} c="var(--color-text-500)" tt="uppercase" style={{ letterSpacing: "0.1em" }}>
            <Link
              to={"/profile/$id/collections"}
              params={{ id: collection.user.id.toString() }}
              className="hover:text-primary-600 transition-colors"
            >
              {collection.user.username}&apos;s Collections
            </Link>
            <Text span>•</Text>
            <Text span>{new Date(collection.created_at).toLocaleDateString()}</Text>
            <Text span>•</Text>
            <Text span c="var(--color-primary-500)">
              {collection.visibility_display}
            </Text>
          </Group>
          <Title
            order={1}
            fz={{ base: 30, md: 48 }}
            fw={900}
            c="var(--color-text-900)"
            style={{ letterSpacing: "-0.025em" }}
          >
            {collection.name}
          </Title>
          {collection.description && (
            <Text c="var(--color-text-600)" maw={672} fz="lg" style={{ lineHeight: 1.6 }}>
              {collection.description}
            </Text>
          )}
        </Stack>

        <Group gap={12} wrap="wrap">
          {canEdit && onPairwiseRank && (
            <Button
              onClick={onPairwiseRank}
              variant="outline"
              style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", paddingInline: "24px" }}
            >
              ⚔️ Pairwise Rank
            </Button>
          )}
          {canEdit && (
            <Button
              onClick={onAddGame}
              style={{
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                paddingInline: "24px",
                boxShadow: "0 10px 15px -3px rgba(99,102,241,0.2)",
              }}
            >
              Add Game
            </Button>
          )}
          {isOwner && (
            <Button
              onClick={onEdit}
              variant="outline"
              style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", paddingInline: "24px" }}
            >
              Edit Collection
            </Button>
          )}
        </Group>
      </Flex>
    </Stack>
  );
};
