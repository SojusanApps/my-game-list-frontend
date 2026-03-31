import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { IconPencil, IconX, IconQuestionMark, IconInfoCircle, IconDotsVertical } from "@tabler/icons-react";
import { Box, Text, UnstyledButton, Tooltip, Menu, ActionIcon, Group } from "@mantine/core";
import { EditDescriptionModal } from "./EditDescriptionModal";
import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import cardStyles from "./GameCard.module.css";
import { TIERS } from "./TierListView";

interface GameCardProps {
  gameId: number;
  title: string;
  coverImageId?: string | null;
  className?: string;
  description?: string;
  isOwner?: boolean;
  onRemove?: () => void;
  onDescriptionChange?: (description: string) => void;
  onMoveToTier?: (tierId: string) => void;
  currentTier?: string;
}

export const GameCard = (props: GameCardProps) => {
  const {
    gameId,
    title,
    coverImageId,
    className,
    description,
    isOwner,
    onRemove,
    onDescriptionChange,
    onMoveToTier,
    currentTier,
  } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSaveDescription = (newDescription: string) => {
    onDescriptionChange?.(newDescription);
  };

  return (
    <>
      <Box
        className={cn(cardStyles.tierGameCard, className)}
        style={{ width: "100%", maxWidth: 140, aspectRatio: "3/4" }}
      >
        <Box className={cardStyles.tierGameCardBorder} style={{ width: "100%", height: "100%" }}>
          <SafeImage
            src={getIGDBImageURL(coverImageId ?? "", IGDBImageSize.COVER_BIG_264_374)}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", borderRadius: "12px" }}
          />
          <Box className={cardStyles.tierGameCardOverlay}>
            <Text
              component="span"
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "white",
                WebkitLineClamp: 2,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {title}
            </Text>
          </Box>
        </Box>

        {/* Description Icon - Top Left */}
        {description && (
          <Box style={{ position: "absolute", top: 8, left: 8, zIndex: 30 }}>
            <Tooltip label={description} position="right" multiline w={250}>
              <Box
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--mantine-color-blue-6)",
                  color: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  cursor: "help",
                }}
              >
                <IconQuestionMark style={{ width: 14, height: 14 }} stroke={3} />
              </Box>
            </Tooltip>
          </Box>
        )}

        {/* Action Buttons - Desktop Hover Reveal */}
        <Box className={cn(cardStyles.tierGameCardActions, cardStyles.desktopActions)}>
          <Tooltip label="View Details" position="left">
            <UnstyledButton
              component={Link}
              to={`/game/${gameId}`}
              className={cn(cardStyles.actionButton, cardStyles.detailsButton)}
            >
              <IconInfoCircle style={{ width: 14, height: 14 }} stroke={2.5} />
            </UnstyledButton>
          </Tooltip>

          {isOwner && onDescriptionChange && (
            <Tooltip label="Edit description" position="left">
              <UnstyledButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className={cn(cardStyles.actionButton, cardStyles.editButton)}
              >
                <IconPencil style={{ width: 14, height: 14 }} stroke={2.5} />
              </UnstyledButton>
            </Tooltip>
          )}

          {onRemove && (
            <Tooltip label="Remove from collection" position="left">
              <UnstyledButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className={cn(cardStyles.actionButton, cardStyles.removeButton)}
              >
                <IconX style={{ width: 14, height: 14 }} stroke={3} />
              </UnstyledButton>
            </Tooltip>
          )}
        </Box>

        {/* Action Buttons - Mobile */}
        <Box className={cn(cardStyles.tierGameCardActions, cardStyles.mobileActions)}>
          <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                variant="filled"
                color="dark"
                radius="xl"
                size="md"
                style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconInfoCircle size={14} />} component={Link} to={`/game/${gameId}`}>
                View Details
              </Menu.Item>

              {isOwner && onDescriptionChange && (
                <Menu.Item
                  leftSection={<IconPencil size={14} />}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  Edit Description
                </Menu.Item>
              )}

              {isOwner && onMoveToTier && (
                <>
                  <Menu.Divider />
                  <Menu.Label>Move to Tier</Menu.Label>
                  {TIERS.filter(t => t.id !== (currentTier || "UNRANKED")).map(t => (
                    <Menu.Item
                      key={t.id}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMoveToTier(t.id);
                      }}
                    >
                      <Group gap={8}>
                        <Box
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: t.color,
                            border: "1px solid var(--color-background-200)",
                          }}
                        />
                        <Text size="sm">Tier {t.label}</Text>
                      </Group>
                    </Menu.Item>
                  ))}
                </>
              )}

              {onRemove && (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconX size={14} />}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove();
                    }}
                  >
                    Remove
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Box>

      {isModalOpen && onDescriptionChange && (
        <EditDescriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialDescription={description}
          gameName={title}
          onSave={handleSaveDescription}
        />
      )}
    </>
  );
};
