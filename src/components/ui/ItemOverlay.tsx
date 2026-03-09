import * as React from "react";
import { Link } from "react-router-dom";
import { Group, Stack, Title, Box } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { SafeImage } from "./SafeImage";
import { getStatusConfig } from "@/features/games/utils/statusConfig";
import { getRatingColor } from "@/utils/ratingUtils";
import { cn } from "@/utils/cn";
import styles from "./ItemOverlay.module.css";

type ItemOverlayProps = {
  className?: string;
  style?: React.CSSProperties;
  itemPageUrl: string;
  itemCoverUrl?: string | null;
  name: string;
  variant?: "cover" | "logo";
  gameType?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  status?: string | null;
  actionSlot?: React.ReactNode | ((hovered: boolean) => React.ReactNode);
};

function ItemOverlay({
  className,
  style,
  name = "Name Placeholder",
  itemPageUrl,
  itemCoverUrl,
  variant = "cover",
  gameType,
  releaseDate,
  rating,
  status,
  actionSlot,
}: Readonly<ItemOverlayProps>): React.JSX.Element {
  const isLogo = variant === "logo";
  const { hovered, ref } = useHover<HTMLDivElement>();

  const releaseYear = React.useMemo(() => {
    if (!releaseDate) return null;
    try {
      const date = new Date(releaseDate);
      return Number.isNaN(date.getTime()) ? null : date.getFullYear();
    } catch {
      return null;
    }
  }, [releaseDate]);

  const ratingBg = React.useMemo(() => getRatingColor(rating), [rating]);

  return (
    <Box
      ref={ref}
      style={{
        aspectRatio: isLogo ? "3/2" : "264/374",
        ...style,
      }}
      className={cn(styles.card, className)}
    >
      <Link
        to={itemPageUrl}
        style={{ display: "block", width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
      >
        {/* Poster Image */}
        <Box
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <SafeImage
            containerStyle={{ width: "100%", height: "100%" }}
            src={itemCoverUrl || undefined}
            alt={name}
            loading="lazy"
            objectFit={isLogo ? "contain" : "cover"}
          />
        </Box>

        {/* Top Badges (Floating Chips) */}
        <Box
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            right: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <Stack gap={6}>
            {gameType && (
              <Box
                component="span"
                style={{
                  background: "rgba(79,70,229,0.9)",
                  color: "white",
                  fontSize: "8px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  width: "fit-content",
                }}
              >
                {gameType}
              </Box>
            )}
          </Stack>

          {rating !== null && rating !== undefined && (
            <Box
              style={{
                background: ratingBg,
                color: "black",
                fontSize: "10px",
                fontWeight: 900,
                padding: "2px 6px",
                borderRadius: "6px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {rating.toFixed(1)}
            </Box>
          )}

          {status && (
            <Box
              style={{
                fontSize: "10px",
                fontWeight: 900,
                padding: "2px 6px",
                borderRadius: "6px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                ...(getStatusConfig(status)?.badgeStyle
                  ? { border: "1px solid transparent", ...getStatusConfig(status)!.badgeStyle }
                  : { background: "rgba(30,30,40,0.9)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }),
              }}
            >
              {getStatusConfig(status)?.emoji}
            </Box>
          )}
        </Box>

        {/* Dynamic Info Anchor (Bottom) */}
        <Box
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.8) 60%, transparent 100%)",
            padding: "16px",
            paddingTop: "64px",
          }}
        >
          <Stack gap={6}>
            <Title
              order={2}
              lineClamp={2}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "white",
                letterSpacing: "-0.025em",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {name}
            </Title>

            <Group gap={8}>
              {releaseYear && (
                <Box
                  component="span"
                  style={{
                    fontSize: "9px",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {releaseYear}
                </Box>
              )}
              <Box
                style={{
                  height: "1px",
                  flex: 1,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
            </Group>
          </Stack>
        </Box>

        {/* Overlay Lens */}
        <Box
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            pointerEvents: "none",
          }}
        />
      </Link>
      {typeof actionSlot === "function" ? actionSlot(hovered) : actionSlot}
    </Box>
  );
}

export default ItemOverlay;
