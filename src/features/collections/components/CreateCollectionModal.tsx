import * as React from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { VisibilityEnum, ModeEnum, TypeEnum, Friendship, CollectionDetail } from "@/client";
import { useCreateCollection, useFriendSearch, useUpdateCollection } from "../hooks/useCollectionQueries";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { TextInput, Select, Checkbox, ActionIcon, Modal, Stack, Group, Box, Title, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";

const validationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  is_favorite: z.boolean(),
  visibility: z.enum(VisibilityEnum),
  mode: z.enum(ModeEnum),
  type: z.enum(TypeEnum),
  collaborators: z.array(z.string()),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface CreateCollectionModalProps {
  onClose: () => void;
  initialData?: CollectionDetail;
  mode?: "create" | "edit";
}

export default function CreateCollectionModal({
  onClose,
  initialData,
  mode = "create",
}: Readonly<CreateCollectionModalProps>) {
  const { mutate: createCollection, isPending: isCreatePending } = useCreateCollection();
  const { mutate: updateCollection, isPending: isUpdatePending } = useUpdateCollection();

  const isPending = isCreatePending || isUpdatePending;

  const [selectedCollaboratorObjects, setSelectedCollaboratorObjects] = React.useState<Friendship[]>([]);

  // When editing, populate selectedCollaboratorObjects based on initialData.collaborators
  React.useEffect(() => {
    if (mode === "edit" && initialData?.collaborators) {
      const initialCollaborators = initialData.collaborators.map(user => ({
        friend: user,
        user: user,
        id: -1,
        created_at: "",
      }));
      setSelectedCollaboratorObjects(initialCollaborators as Friendship[]);
    }
  }, [mode, initialData]);

  const form = useForm<ValidationSchema>({
    initialValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      is_favorite: initialData?.is_favorite ?? false,
      visibility: initialData?.visibility ?? VisibilityEnum.PUB,
      mode: initialData?.mode ?? ModeEnum.S,
      type: initialData?.type ?? TypeEnum.NOR,
      collaborators: initialData?.collaborators?.map(u => u.id.toString()) ?? [],
    },
    validate: schemaResolver(validationSchema),
  });

  const selectedMode = form.values.mode;

  React.useEffect(() => {
    if (selectedMode === ModeEnum.S) {
      form.setFieldValue("collaborators", []);
      setSelectedCollaboratorObjects([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode]);

  const handleAddCollaborator = (friendship: Friendship) => {
    setSelectedCollaboratorObjects(prev => [...prev, friendship]);
  };

  const handleRemoveCollaborator = (friendship: Friendship) => {
    setSelectedCollaboratorObjects(prev => prev.filter(f => f.friend.id !== friendship.friend.id));
  };

  const removeCollaborator = (friendId: number) => {
    const currentCollaborators = form.values.collaborators;
    form.setFieldValue(
      "collaborators",
      currentCollaborators.filter(id => id !== friendId.toString()),
    );
    setSelectedCollaboratorObjects(prev => prev.filter(f => f.friend.id !== friendId));
  };

  const onSubmit = (data: ValidationSchema) => {
    const payload = {
      ...data,
      collaborators: data.collaborators.map(Number),
    };

    if (mode === "edit" && initialData) {
      updateCollection(
        { id: initialData.id, body: payload },
        {
          onSuccess: () => {
            notifications.show({ title: "Success", message: "Collection updated successfully", color: "green" });
            onClose();
          },
          onError: error => {
            notifications.show({
              title: "Error",
              message: error.message || "Failed to update collection",
              color: "red",
            });
          },
        },
      );
    } else {
      createCollection(payload, {
        onSuccess: () => {
          notifications.show({ title: "Success", message: "Collection created successfully", color: "green" });
          onClose();
        },
        onError: error => {
          notifications.show({ title: "Error", message: error.message || "Failed to create collection", color: "red" });
        },
      });
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
    >
      <Stack gap={0} style={{ height: "100%", maxHeight: "90vh" }}>
        {/* Header */}
        <Group
          justify="space-between"
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid var(--color-background-100)",
            background: "rgba(248,250,252,0.5)",
          }}
        >
          <Title order={2} fz={24} fw={900} c="var(--color-text-900)" style={{ letterSpacing: "-0.025em" }}>
            {mode === "create" ? "Create" : "Edit"}{" "}
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

        {/* Body */}
        <Box style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <form id="create-collection-form" onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap="lg">
              <TextInput
                id="name-input"
                label="Collection Name"
                name="name"
                placeholder="My Awesome Collection"
                required
                {...form.getInputProps("name")}
              />

              <TextInput
                id="description-input"
                label="Description"
                name="description"
                placeholder="What is this collection about?"
                {...form.getInputProps("description")}
              />

              <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Select
                  id="visibility-select"
                  label="Visibility"
                  name="visibility"
                  placeholder="Select visibility"
                  searchable
                  clearable
                  data={[
                    { value: VisibilityEnum.PUB, label: "Public" },
                    { value: VisibilityEnum.FRI, label: "Friends Only" },
                    { value: VisibilityEnum.PRI, label: "Private" },
                  ]}
                  {...form.getInputProps("visibility")}
                />
                <Select
                  id="mode-select"
                  label="Mode"
                  name="mode"
                  placeholder="Select mode"
                  searchable
                  clearable
                  data={[
                    { value: ModeEnum.S, label: "Solo" },
                    { value: ModeEnum.C, label: "Collaborative" },
                  ]}
                  {...form.getInputProps("mode")}
                />
              </Box>

              <Select
                id="type-select"
                label="Collection Type"
                name="type"
                placeholder="Select type"
                searchable
                clearable
                data={[
                  { value: TypeEnum.NOR, label: "Normal" },
                  { value: TypeEnum.RNK, label: "Ranking" },
                  { value: TypeEnum.TIE, label: "Tier List" },
                ]}
                {...form.getInputProps("type")}
              />

              {selectedMode === ModeEnum.C && (
                <Stack gap="md">
                  <AsyncMultiSelectAutocomplete<Friendship>
                    id="collaborators"
                    name="collaborators"
                    label="Collaborators"
                    placeholder="Search friends..."
                    useInfiniteQueryHook={useFriendSearch}
                    getOptionLabel={item => item.friend.username}
                    getOptionValue={item => item.friend.id}
                    hideTags
                    onAdd={handleAddCollaborator}
                    onRemove={handleRemoveCollaborator}
                    renderOption={item => (
                      <Group gap={12}>
                        <Box
                          style={{ width: 24, height: 24, borderRadius: "9999px", overflow: "hidden", flexShrink: 0 }}
                        >
                          <SafeImage src={item.friend.gravatar_url} alt={item.friend.username} />
                        </Box>
                        <Text span fw={500}>
                          {item.friend.username}
                        </Text>
                      </Group>
                    )}
                    {...form.getInputProps("collaborators")}
                  />

                  {/* Selected Collaborators Special Area */}
                  {selectedCollaboratorObjects.length > 0 && (
                    <Stack
                      gap="xs"
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        background: "var(--color-background-50)",
                        border: "1px solid var(--color-background-100)",
                      }}
                    >
                      <Text
                        fz={10}
                        fw={700}
                        c="var(--color-text-400)"
                        style={{ textTransform: "uppercase", letterSpacing: "0.1em", paddingInline: 4 }}
                      >
                        Selected Collaborators
                      </Text>
                      <Group wrap="wrap" gap={8}>
                        {selectedCollaboratorObjects.map(f => (
                          <Group
                            key={f.friend.id}
                            gap={8}
                            style={{
                              paddingLeft: 6,
                              paddingRight: 10,
                              paddingBlock: 6,
                              background: "white",
                              borderRadius: "9999px",
                              border: "1px solid var(--color-background-200)",
                            }}
                          >
                            <Box
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "9999px",
                                overflow: "hidden",
                                flexShrink: 0,
                                boxShadow: "0 0 0 1px var(--color-background-100)",
                              }}
                            >
                              <SafeImage src={f.friend.gravatar_url} alt={f.friend.username} />
                            </Box>
                            <Text span fz="xs" fw={700} c="var(--color-text-700)">
                              {f.friend.username}
                            </Text>
                            <ActionIcon
                              type="button"
                              onClick={() => removeCollaborator(f.friend.id)}
                              variant="subtle"
                              size="xs"
                              style={{ borderRadius: "9999px", color: "var(--color-text-400)" }}
                            >
                              <IconX style={{ width: 14, height: 14 }} />
                            </ActionIcon>
                          </Group>
                        ))}
                      </Group>
                    </Stack>
                  )}
                </Stack>
              )}

              <Checkbox
                id="is_favorite_checkbox"
                label="Mark as Favorite"
                name="is_favorite"
                {...form.getInputProps("is_favorite", { type: "checkbox" })}
              />
            </Stack>
          </form>
        </Box>

        {/* Footer */}
        <Group
          gap={12}
          style={{
            padding: "24px 32px",
            borderTop: "1px solid var(--color-background-100)",
            background: "rgba(248,250,252,0.5)",
          }}
        >
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            style={{ fontWeight: 700, paddingBlock: 12 }}
          >
            Cancel
          </Button>
          <Button
            form="create-collection-form"
            type="submit"
            fullWidth
            isLoading={isPending}
            style={{ fontWeight: 900, paddingBlock: 12 }}
          >
            {mode === "create" ? "Create" : "Save Changes"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
