import { StatusEnum } from "@/client";

export interface StatusConfig {
  label: string;
  emoji: string;
  styles: string;
  activeStyles: string;
}

export const STATUS_CONFIG: Record<StatusEnum, StatusConfig> = {
  [StatusEnum.P]: {
    label: "Playing",
    emoji: "🎮",
    styles: "hover:bg-success-100 text-success-700 border-success-200",
    activeStyles: "bg-success-200 text-success-900 border-success-300",
  },
  [StatusEnum.C]: {
    label: "Completed",
    emoji: "🏆",
    styles: "hover:bg-primary-100 text-primary-700 border-primary-200",
    activeStyles: "bg-primary-200 text-primary-900 border-primary-300",
  },
  [StatusEnum.PTP]: {
    label: "Plan to Play",
    emoji: "🗓️",
    styles: "hover:bg-background-300 text-text-500 border-background-300",
    activeStyles: "bg-background-400 text-text-900 border-background-500",
  },
  [StatusEnum.OH]: {
    label: "On Hold",
    emoji: "⏸️",
    styles: "hover:bg-secondary-100 text-secondary-700 border-secondary-200",
    activeStyles: "bg-secondary-200 text-secondary-900 border-secondary-300",
  },
  [StatusEnum.D]: {
    label: "Dropped",
    emoji: "🗑️",
    styles: "hover:bg-error-100 text-error-700 border-error-200",
    activeStyles: "bg-error-200 text-error-900 border-error-300",
  },
};

export const getStatusConfig = (status: StatusEnum | string | undefined): StatusConfig | undefined => {
  if (!status) return undefined;
  return STATUS_CONFIG[status as StatusEnum];
};
