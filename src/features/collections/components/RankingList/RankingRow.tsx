import { Box, Group, NumberInput, Stack, Text, UnstyledButton } from "@mantine/core";
import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import rowStyles from "./RankingRow.module.css";

interface RankingRowProps {
  rank: number;
  totalItems: number;
  title: string;
  coverImageId?: string | null;
  description?: string;
  onDescriptionClick?: () => void;
  isOwner: boolean;
  onRemove?: () => void;
  isDragging?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onPositionChange?: (newPosition: number) => void;
}

function resolvePositionInput(value: number | string): number {
  return typeof value === "number" ? value : Number.parseInt(String(value), 10);
}

function isValidNewPosition(pos: number, rank: number, total: number): boolean {
  return !Number.isNaN(pos) && pos >= 1 && pos <= total && pos !== rank;
}

function resolveTooltipText(
  hasDescription: string | boolean | undefined,
  description: string | undefined,
  isOwner: boolean,
): string | undefined {
  if (hasDescription) return description;
  if (isOwner) return "Add/View note";
  return undefined;
}

export const RankingRow = React.memo(
  ({
    rank,
    totalItems,
    title,
    coverImageId,
    description,
    onDescriptionClick,
    isOwner,
    onRemove,
    isDragging,
    onMoveUp,
    onMoveDown,
    onPositionChange,
  }: Readonly<RankingRowProps>) => {
    const [isEditingPosition, setIsEditingPosition] = React.useState(false);
    const [positionInput, setPositionInput] = React.useState<number | string>(rank);

    const hasDescription = description && description.trim().length > 0;

    // Update position input when rank changes
    React.useEffect(() => {
      setPositionInput(rank);
    }, [rank]);

    const handlePositionSubmit = () => {
      const newPosition = resolvePositionInput(positionInput);
      if (isValidNewPosition(newPosition, rank, totalItems)) {
        onPositionChange?.(newPosition);
      }
      setIsEditingPosition(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handlePositionSubmit();
      } else if (e.key === "Escape") {
        setPositionInput(String(rank));
        setIsEditingPosition(false);
      }
    };

    const tooltipText = resolveTooltipText(hasDescription, description, isOwner);

    return (
      <Stack
        gap={12}
        className={rowStyles.rankingRow}
        style={{
          padding: 16,
          background: "white",
          borderRadius: 16,
          border: "1px solid var(--color-background-200)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          position: "relative",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <Group gap={16} align="center">
          {/* Rank display with controls */}
          <Group gap={8} align="center">
            {isOwner && (
              <Stack gap={4}>
                <UnstyledButton
                  onClick={onMoveUp}
                  disabled={rank === 1}
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    background: "var(--color-background-50)",
                    border: "1px solid var(--color-background-100)",
                    color: "var(--color-text-400)",
                  }}
                  title="Move up"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ width: 12, height: 12 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                      clipRule="evenodd"
                    />
                  </svg>
                </UnstyledButton>
                <UnstyledButton
                  onClick={onMoveDown}
                  disabled={rank === totalItems}
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    background: "var(--color-background-50)",
                    border: "1px solid var(--color-background-100)",
                    color: "var(--color-text-400)",
                  }}
                  title="Move down"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ width: 12, height: 12 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </UnstyledButton>
              </Stack>
            )}
            {isEditingPosition && isOwner ? (
              <NumberInput
                min={1}
                max={totalItems}
                value={positionInput}
                onChange={setPositionInput}
                onBlur={handlePositionSubmit}
                onKeyDown={handleKeyDown}
                hideControls
                styles={{
                  input: {
                    width: 56,
                    height: 40,
                    borderRadius: 12,
                    background: "var(--color-primary-50)",
                    border: "2px solid var(--color-primary-300)",
                    fontSize: 14,
                    fontWeight: 900,
                    color: "var(--color-primary-600)",
                    textAlign: "center",
                  },
                }}
              />
            ) : (
              <UnstyledButton
                onClick={() => isOwner && setIsEditingPosition(true)}
                disabled={!isOwner}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--color-background-50)",
                  fontSize: 14,
                  fontWeight: 900,
                  color: "var(--color-primary-600)",
                  flexShrink: 0,
                  border: "1px solid var(--color-background-100)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  cursor: isOwner ? "pointer" : "default",
                }}
                title={isOwner ? "Click to edit position" : undefined}
              >
                #{rank}
              </UnstyledButton>
            )}
          </Group>

          <Box
            style={{
              width: 48,
              height: 64,
              borderRadius: 8,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              border: "1px solid var(--color-background-100)",
            }}
          >
            <SafeImage
              src={getIGDBImageURL(coverImageId ?? "", IGDBImageSize.COVER_SMALL_90_128)}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text
              fw={900}
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                textTransform: "uppercase",
                letterSpacing: "-0.025em",
                fontSize: "clamp(14px,2vw,16px)",
                color: "var(--color-text-900)",
              }}
            >
              {title}
            </Text>
          </Box>

          <Group gap={8}>
            <UnstyledButton
              onClick={onDescriptionClick}
              disabled={!isOwner}
              style={{
                position: "relative",
                padding: 8,
                borderRadius: 12,
                transition: "all 150ms",
                border: "1px solid",
                background: hasDescription ? "var(--color-secondary-50)" : "var(--color-background-50)",
                borderColor: hasDescription ? "var(--color-secondary-100)" : "var(--color-background-100)",
                color: hasDescription ? "var(--color-secondary-600)" : "var(--color-text-400)",
                cursor: isOwner ? "pointer" : "default",
              }}
              data-tip={tooltipText}
              title={!hasDescription && !isOwner ? "No note" : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: 16, height: 16 }}
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              {hasDescription && (
                <Box style={{ position: "absolute", top: -4, right: -4, display: "flex", width: 8, height: 8 }}>
                  <Box
                    style={{
                      animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
                      position: "absolute",
                      display: "inline-flex",
                      width: "100%",
                      height: "100%",
                      borderRadius: "9999px",
                      background: "var(--color-secondary-400)",
                      opacity: 0.75,
                    }}
                  />
                  <Box
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      borderRadius: "9999px",
                      width: 8,
                      height: 8,
                      background: "var(--color-secondary-500)",
                    }}
                  />
                </Box>
              )}
            </UnstyledButton>

            {isOwner && onRemove && (
              <UnstyledButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className={rowStyles.rankingRowRemove}
                style={{
                  padding: 8,
                  borderRadius: 12,
                  background: "var(--color-error-50)",
                  border: "1px solid var(--color-error-100)",
                  color: "var(--color-error-400)",
                }}
                title="Remove from collection"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75V4H5a1 1 0 000 2h.25v8.25A2.75 2.75 0 008 17h4a2.75 2.75 0 002.75-2.75V6H15a1 1 0 100-2h-1V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4V3.75c0-.414.336-.75.75-.75h2.5c.414 0 .75.336.75.75V4H8zM6.75 6v8.25c0 .414.336.75.75.75h4c.414 0 .75-.336.75-.75V6h-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </UnstyledButton>
            )}

            {isOwner && (
              <Stack gap={4} className={rowStyles.rankingRowDrag} style={{ paddingInline: 8, cursor: "grab" }}>
                <Box style={{ width: 4, height: 4, borderRadius: "9999px", background: "var(--color-text-400)" }} />
                <Box style={{ width: 4, height: 4, borderRadius: "9999px", background: "var(--color-text-400)" }} />
                <Box style={{ width: 4, height: 4, borderRadius: "9999px", background: "var(--color-text-400)" }} />
              </Stack>
            )}
          </Group>
        </Group>
      </Stack>
    );
  },
);

RankingRow.displayName = "RankingRow";
