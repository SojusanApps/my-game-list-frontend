import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { IconPencil, IconX, IconQuestionMark, IconInfoCircle } from "@tabler/icons-react";
import { Box, Text, UnstyledButton, Tooltip } from "@mantine/core";
import { EditDescriptionModal } from "./EditDescriptionModal";
import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import cardStyles from "./GameCard.module.css";

interface GameCardProps {
  gameId: number;
  title: string;
  coverImageId?: string | null;
  className?: string;
  description?: string;
  isOwner?: boolean;
  onRemove?: () => void;
  onDescriptionChange?: (description: string) => void;
}

export const GameCard = (props: GameCardProps) => {
  const { gameId, title, coverImageId, className, description, isOwner, onRemove, onDescriptionChange } = props;
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

        {/* Action Buttons - Top Right Hover Reveal */}
        <Box className={cardStyles.tierGameCardActions}>
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
