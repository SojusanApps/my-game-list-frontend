import type React from "react";
import { StatusEnum } from "@/client";

export interface StatusConfig {
  label: string;
  emoji: string;
  badgeStyle: React.CSSProperties;
}

export const STATUS_CONFIG: Record<StatusEnum, StatusConfig> = {
  [StatusEnum.P]: {
    label: "Playing",
    emoji: "🎮",
    badgeStyle: {
      background: "var(--color-success-200)",
      color: "var(--color-success-900)",
      borderColor: "var(--color-success-300)",
    },
  },
  [StatusEnum.C]: {
    label: "Completed",
    emoji: "🏆",
    badgeStyle: {
      background: "var(--color-primary-200)",
      color: "var(--color-primary-900)",
      borderColor: "var(--color-primary-300)",
    },
  },
  [StatusEnum.PTP]: {
    label: "Plan to Play",
    emoji: "🗓️",
    badgeStyle: {
      background: "var(--color-background-400)",
      color: "var(--color-text-900)",
      borderColor: "var(--color-background-500)",
    },
  },
  [StatusEnum.OH]: {
    label: "On Hold",
    emoji: "⏸️",
    badgeStyle: {
      background: "var(--color-secondary-200)",
      color: "var(--color-secondary-900)",
      borderColor: "var(--color-secondary-300)",
    },
  },
  [StatusEnum.D]: {
    label: "Dropped",
    emoji: "🗑️",
    badgeStyle: {
      background: "var(--color-error-200)",
      color: "var(--color-error-900)",
      borderColor: "var(--color-error-300)",
    },
  },
};

export const getStatusConfig = (status: StatusEnum | string | undefined): StatusConfig | undefined => {
  if (!status) return undefined;
  return STATUS_CONFIG[status as StatusEnum];
};
