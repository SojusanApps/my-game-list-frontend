import * as React from "react";
import { Modal, Text, Group, Box, Title, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Button } from "./Button";

export interface ConfirmModalProps {
  opened: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  opened,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "var(--color-primary-600)",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose,
}: Readonly<ConfirmModalProps>) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      padding={0}
      radius="lg"
      size="sm"
      centered
      overlayProps={{ backgroundOpacity: 0.5 }}
    >
      <Box style={{ background: "white", borderRadius: 16 }}>
        <Group
          justify="space-between"
          align="center"
          style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-background-200)" }}
        >
          <Title order={3} fz="lg" fw={800} c="var(--color-text-900)">
            {title}
          </Title>
          <UnstyledButton onClick={onClose} style={{ padding: 6, borderRadius: 8 }} aria-label="Close modal">
            <IconX style={{ width: 18, height: 18, color: "var(--color-text-500)" }} />
          </UnstyledButton>
        </Group>

        <Box p={24}>
          {typeof message === "string" ? (
            <Text c="var(--color-text-500)" size="sm" style={{ lineHeight: 1.5 }}>
              {message}
            </Text>
          ) : (
            message
          )}

          <Group justify="flex-end" gap={12} mt={28}>
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              isLoading={isLoading}
              style={{
                backgroundColor: isDestructive ? "var(--color-error-500)" : confirmColor,
              }}
            >
              {confirmLabel}
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
}
