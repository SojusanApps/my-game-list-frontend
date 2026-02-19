import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { IconPencil, IconQuestionMark } from "@tabler/icons-react";
import { Box, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { EditDescriptionModal } from "./EditDescriptionModal";
import { cn } from "@/utils/cn";
import cardStyles from "./GameCard.module.css";

interface GameCardProps {
  title: string;
  coverImageId?: string | null;
  className?: string;
  description?: string;
  isOwner?: boolean;
  onRemove?: () => void;
  onDescriptionChange?: (description: string) => void;
}

export const GameCard = (props: GameCardProps) => {
  const { title, coverImageId, className, description, isOwner, onRemove, onDescriptionChange } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSaveDescription = (newDescription: string) => {
    onDescriptionChange?.(newDescription);
  };

  return (
    <>
      <Box className={cn(cardStyles.tierGameCard, className)} style={{ width: 96, aspectRatio: "3/4" }}>
        <Box className={cardStyles.tierGameCardBorder} style={{ width: "100%", height: "100%" }}>
          <SafeImage
            src={getIGDBImageURL(coverImageId ?? "", IGDBImageSize.COVER_BIG_264_374)}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
          />
          <Box className={cardStyles.tierGameCardOverlay}>
            <Text
              component="span"
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: "white",
                WebkitLineClamp: 2,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </Text>
          </Box>
        </Box>

        {/* Description Icons - Top Left */}
        <Box style={{ position: "absolute", top: 4, left: 4, zIndex: 30, display: "flex", gap: 4 }}>
          {/* Question Mark Icon (visible when description exists) */}
          {description && (
            <Tooltip label={description} position="right">
              <Box
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--mantine-color-blue-6)",
                  color: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              >
                <IconQuestionMark style={{ width: 12, height: 12 }} />
              </Box>
            </Tooltip>
          )}

          {/* Pencil Icon (visible for owners, shown on hover) */}
          {isOwner && onDescriptionChange && (
            <UnstyledButton
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className={cardStyles.tierGameCardPencil}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--color-primary-500)",
                color: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                flexShrink: 0,
              }}
              title="Edit description"
            >
              <IconPencil style={{ width: 12, height: 12 }} />
            </UnstyledButton>
          )}
        </Box>

        {/* Remove Button - Top Right */}
        {onRemove && (
          <UnstyledButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className={cardStyles.tierGameCardRemove}
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              zIndex: 30,
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-error-500)",
              color: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            title="Remove from collection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ width: 12, height: 12 }}
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75V4H5a1 1 0 000 2h.25v8.25A2.75 2.75 0 008 17h4a2.75 2.75 0 002.75-2.75V6H15a1 1 0 100-2h-1V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4V3.75c0-.414.336-.75.75-.75h2.5c.414 0 .75.336.75.75V4H8zM6.75 6v8.25c0 .414.336.75.75.75h4c.414 0 .75-.336.75-.75V6h-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </UnstyledButton>
        )}
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
