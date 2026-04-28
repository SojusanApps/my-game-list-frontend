import * as React from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { Button } from "@/components/ui/Button";
import { ActionIcon, Modal, Stack, Group, Box, Title, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import { useCollectionsInfiniteQuery, useAddCollectionItem } from "../hooks/useCollectionQueries";
import { useCurrentUserId } from "@/features/auth";
import { Collection } from "@/client";

const validationSchema = z.object({
  collections: z.array(z.string()).min(1, "Select at least one collection"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface AddToCollectionModalProps {
  onClose: () => void;
  gameId: number;
}

export default function AddToCollectionModal({ onClose, gameId }: Readonly<AddToCollectionModalProps>) {
  const currentUserId = useCurrentUserId();

  const { mutateAsync: addCollectionItem, isPending } = useAddCollectionItem();

  const form = useForm<ValidationSchema>({
    initialValues: {
      collections: [],
    },
    validate: schemaResolver(validationSchema),
  });

  // Wrapper hook for AsyncMultiSelectAutocomplete
  const useMyCollectionsSearch = (searchTerm: string) => {
    return useCollectionsInfiniteQuery(currentUserId || undefined, { name: searchTerm });
  };

  const onSubmit = async (data: ValidationSchema) => {
    try {
      await Promise.all(
        data.collections.map(collectionId =>
          addCollectionItem({
            collection: Number(collectionId),
            game: gameId,
          }),
        ),
      );
      notifications.show({ title: "Success", message: "Added to collections successfully", color: "green" });
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add to some collections";
      notifications.show({ title: "Error", message: errorMessage, color: "red" });
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      padding={0}
      radius="xl"
      size="lg"
      overlayProps={{ backgroundOpacity: 0.6 }}
      styles={{ content: { overflow: "visible" }, body: { overflow: "visible" } }}
    >
      <Stack gap={0} style={{ height: "100%", overflow: "visible" }}>
        {/* Header */}
        <Group
          justify="space-between"
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid var(--color-background-100)",
            background: "rgba(248,250,252,0.5)",
            borderRadius: "24px 24px 0 0",
          }}
        >
          <Title order={2} fz={24} fw={900} c="var(--color-text-900)" style={{ letterSpacing: "-0.025em" }}>
            Add to{" "}
            <Text span c="var(--color-primary-600)">
              Collection
            </Text>
          </Title>
          <ActionIcon
            onClick={onClose}
            variant="subtle"
            size="lg"
            style={{ borderRadius: "9999px", color: "var(--color-text-400)" }}
          >
            <IconX style={{ width: 24, height: 24 }} />
          </ActionIcon>
        </Group>

        <Box style={{ padding: "32px", borderRadius: "0 0 24px 24px" }}>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap="lg">
              <AsyncMultiSelectAutocomplete
                id="collections"
                name="collections"
                label="Select Collections"
                placeholder="Search your collections..."
                useInfiniteQueryHook={useMyCollectionsSearch}
                getOptionLabel={(collection: Collection) => collection.name}
                getOptionValue={(collection: Collection) => collection.id}
                required
                {...form.getInputProps("collections")}
              />

              <Group justify="flex-end" pt={16}>
                <Button type="submit" disabled={isPending} style={{ width: "100%" }}>
                  {isPending ? "Adding..." : "Add to Selected Collections"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Modal>
  );
}
