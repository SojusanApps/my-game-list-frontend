import type React from "react";
import { StatusEnum } from "@/client";
import i18n from "@/lib/i18n";

export interface StatusConfig {
  label: string;
  emoji: string;
  badgeStyle: React.CSSProperties;
}

const BADGE_STYLES: Record<StatusEnum, React.CSSProperties> = {
  [StatusEnum.P]: {
    background: "var(--color-success-200)",
    color: "var(--color-success-900)",
    borderColor: "var(--color-success-300)",
  },
  [StatusEnum.C]: {
    background: "var(--color-primary-200)",
    color: "var(--color-primary-900)",
    borderColor: "var(--color-primary-300)",
  },
  [StatusEnum.PTP]: {
    background: "var(--color-background-400)",
    color: "var(--color-text-900)",
    borderColor: "var(--color-background-500)",
  },
  [StatusEnum.OH]: {
    background: "var(--color-secondary-200)",
    color: "var(--color-secondary-900)",
    borderColor: "var(--color-secondary-300)",
  },
  [StatusEnum.D]: {
    background: "var(--color-error-200)",
    color: "var(--color-error-900)",
    borderColor: "var(--color-error-300)",
  },
};

const STATUS_EMOJIS: Record<StatusEnum, string> = {
  [StatusEnum.P]: "🎮",
  [StatusEnum.C]: "🏆",
  [StatusEnum.PTP]: "🗓️",
  [StatusEnum.OH]: "⏸️",
  [StatusEnum.D]: "🗑️",
};

const STATUS_TRANSLATION_KEYS: Record<StatusEnum, string> = {
  [StatusEnum.P]: "games:status.playing",
  [StatusEnum.C]: "games:status.completed",
  [StatusEnum.PTP]: "games:status.planToPlay",
  [StatusEnum.OH]: "games:status.onHold",
  [StatusEnum.D]: "games:status.dropped",
};

/** Returns a fresh StatusConfig reading the current i18n language at call time. */
export const getStatusConfig = (status: StatusEnum | string | undefined): StatusConfig | undefined => {
  if (!status || !(status in STATUS_TRANSLATION_KEYS)) {
    return undefined;
  }
  const key = status as StatusEnum;
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label: i18n.t(STATUS_TRANSLATION_KEYS[key] as any),
    emoji: STATUS_EMOJIS[key],
    badgeStyle: BADGE_STYLES[key],
  };
};

/** Convenience record for places that iterate all statuses — reads translations fresh each access. */
export const STATUS_CONFIG: Record<StatusEnum, StatusConfig> = new Proxy({} as Record<StatusEnum, StatusConfig>, {
  get(_target, prop: string) {
    return getStatusConfig(prop);
  },
});
