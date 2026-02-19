import * as React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { Button } from "@/components/ui/Button";
import { Box, Group, Loader, Modal, Stack, Text, Title, Textarea, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const validationSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface EditDescriptionModalProps {
  gameTitle: string;
  currentDescription?: string;
  onClose: () => void;
  onSave: (description: string) => Promise<void>;
}

export default function EditDescriptionModal({
  gameTitle,
  currentDescription,
  onClose,
  onSave,
}: Readonly<EditDescriptionModalProps>) {
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<ValidationSchema>({
    initialValues: {
      description: currentDescription ?? "",
    },
    validate: zod4Resolver(validationSchema),
  });

  const onSubmit = async (data: ValidationSchema) => {
    setIsSaving(true);
    try {
      await onSave(data.description ?? "");
      notifications.show({ title: "Success", message: "Description updated successfully", color: "green" });
      onClose();
    } catch (error) {
      notifications.show({ title: "Error", message: "Failed to update description", color: "red" });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      padding={0}
      radius="lg"
      size="xl"
      overlayProps={{ backgroundOpacity: 0.5 }}
    >
      <Box style={{ background: "white", borderRadius: 16 }}>
        <Group
          justify="space-between"
          align="center"
          style={{ padding: 24, borderBottom: "1px solid var(--color-background-200)" }}
        >
          <Box>
            <Title order={2} fz="xl" fw={900} c="var(--color-text-900)">
              Edit Note
            </Title>
            <Text size="sm" c="var(--color-text-500)" mt={4}>
              {gameTitle}
            </Text>
          </Box>
          <UnstyledButton onClick={onClose} style={{ padding: 8, borderRadius: 12 }} aria-label="Close modal">
            <IconX style={{ width: 20, height: 20 }} />
          </UnstyledButton>
        </Group>

        <Box component="form" onSubmit={form.onSubmit(onSubmit)} p={24}>
          <Stack gap={16}>
            <Textarea
              label="Why is this game in this position?"
              placeholder="Add your thoughts about this game's ranking..."
              rows={8}
              style={{ width: "100%" }}
              {...form.getInputProps("description")}
            />
          </Stack>

          <Group
            justify="flex-end"
            gap={12}
            style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--color-background-200)" }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
              style={{ paddingInline: 24 }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSaving} style={{ paddingInline: 24 }}>
              {isSaving ? (
                <>
                  <Loader size="xs" style={{ marginRight: 8 }} /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
}
