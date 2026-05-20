import type React from "react";
import { StatusEnum } from "@/client";
import i18n from "@/lib/i18n";

export interface StatusConfig {
  label: string;
  emoji: string;
  badgeStyle: React.CSSProperties;
}

export const STATUS_CONFIG: Record<StatusEnum, StatusConfig> = {
  [StatusEnum.P]: {
    label: i18n.t("games:status.playing"),
    emoji: "🎮",
    badgeStyle: {
      background: "var(--color-success-200)",
      color: "var(--color-success-900)",
      borderColor: "var(--color-success-300)",
    },
  },
  [StatusEnum.C]: {
    label: i18n.t("games:status.completed"),
    emoji: "🏆",
    badgeStyle: {
      background: "var(--color-primary-200)",
      color: "var(--color-primary-900)",
      borderColor: "var(--color-primary-300)",
    },
  },
  [StatusEnum.PTP]: {
    label: i18n.t("games:status.planToPlay"),
    emoji: "🗓️",
    badgeStyle: {
      background: "var(--color-background-400)",
      color: "var(--color-text-900)",
      borderColor: "var(--color-background-500)",
    },
  },
  [StatusEnum.OH]: {
    label: i18n.t("games:status.onHold"),
    emoji: "⏸️",
    badgeStyle: {
      background: "var(--color-secondary-200)",
      color: "var(--color-secondary-900)",
      borderColor: "var(--color-secondary-300)",
    },
  },
  [StatusEnum.D]: {
    label: i18n.t("games:status.dropped"),
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
