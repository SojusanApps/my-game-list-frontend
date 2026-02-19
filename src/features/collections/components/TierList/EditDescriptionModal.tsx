import * as React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Box, Group, Modal, Stack, Text, Title, Textarea, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const validationSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface EditDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDescription?: string;
  gameName: string;
  onSave: (description: string) => void;
}

export const EditDescriptionModal = ({
  isOpen,
  onClose,
  initialDescription = "",
  gameName,
  onSave,
}: Readonly<EditDescriptionModalProps>) => {
  const form = useForm<ValidationSchema>({
    initialValues: {
      description: initialDescription,
    },
    validate: zod4Resolver(validationSchema),
  });

  const onSubmit = (data: ValidationSchema) => {
    onSave(data.description);
    onClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      padding={0}
      radius="xl"
      size="xl"
      overlayProps={{ backgroundOpacity: 0.6 }}
    >
      <Box component="form" onSubmit={form.onSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Group
          justify="space-between"
          align="center"
          style={{ padding: 24, borderBottom: "1px solid var(--color-background-200)" }}
        >
          <Title order={2} fz="xl" fw={700} c="var(--color-text-900)">
            Edit Description
          </Title>
          <UnstyledButton onClick={onClose} style={{ padding: 8, borderRadius: "9999px" }} aria-label="Close">
            <IconX style={{ width: 20, height: 20 }} />
          </UnstyledButton>
        </Group>

        {/* Body */}
        <Stack gap={16} p={24}>
          <Box>
            <Text fz="sm" fw={600} c="var(--color-text-700)" mb={8}>
              Game: {gameName}
            </Text>
            <Text size="xs" c="var(--color-text-500)" mb={16}>
              Why is this game in this tier?
            </Text>
          </Box>

          <Textarea
            placeholder="Explain your tier placement..."
            rows={6}
            style={{ width: "100%" }}
            {...form.getInputProps("description")}
          />

          <Text ta="right" size="xs" c="var(--color-text-500)">
            {form.values.description.length} / 500 characters
          </Text>
        </Stack>

        {/* Footer */}
        <Group
          justify="flex-end"
          gap={12}
          style={{
            padding: 24,
            borderTop: "1px solid var(--color-background-200)",
            background: "var(--color-background-50)",
          }}
        >
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Description</Button>
        </Group>
      </Box>
    </Modal>
  );
};
