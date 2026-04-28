import React from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";

import { notifications } from "@mantine/notifications";
import { Modal, Select, Group, Stack, Textarea, NumberInput, Box } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import { Button } from "@/components/ui/Button";
import { StatusEnum } from "@/client";
import code_to_value_mapping from "../utils/GameListStatuses";
import { idSchema } from "@/lib/validation";
import {
  useCreateGameList,
  useDeleteGameList,
  useGetGameListByFilters,
  useGetGameMediasInfiniteQuery,
  usePartialUpdateGameList,
} from "../hooks/gameQueries";
import { useCurrentUserId } from "@/features/auth";
import { parseDate, formatDate } from "@/utils/dateUtils";
import { getRatingColor } from "@/utils/ratingUtils";

const validationSchema = z.object({
  status: z.enum(StatusEnum),
  score: z.coerce
    .number()
    .min(1, { message: "The minimum score is 1" })
    .max(10, { message: "The maximum score is 10" })
    .nullish(),
  owned_on: z.array(z.string()).optional(),
  description: z.string().max(200, "Maximum 200 characters").nullish(),
  started_at: z.date().nullish(),
  completed_at: z.date().nullish(),
  playtime: z.coerce.number().min(0, "Playtime cannot be negative").nullish(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface GameListModalProps {
  gameId: string | number;
  opened: boolean;
  onClose: () => void;
}

export function GameListModal({ gameId, opened, onClose }: Readonly<GameListModalProps>) {
  const currentUserId = useCurrentUserId();
  const parsedGameIdResult = idSchema.safeParse(gameId);
  const parsedGameId = parsedGameIdResult.success ? parsedGameIdResult.data : undefined;

  const { data: gameListDetails } = useGetGameListByFilters(
    parsedGameId && currentUserId ? { game: parsedGameId, user: currentUserId } : undefined,
    { enabled: !!parsedGameId && !!currentUserId && opened },
  );

  const { mutateAsync: deleteGameListItem, isPending: isDeleting } = useDeleteGameList();
  const { mutateAsync: createGameListItem, isPending: isCreating } = useCreateGameList();
  const { mutateAsync: partialUpdateGameListItem, isPending: isUpdating } = usePartialUpdateGameList();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<ValidationSchema>({
    initialValues: {
      status: StatusEnum.PTP,
      score: null,
      owned_on: [],
      description: "",
      started_at: null,
      completed_at: null,
      playtime: null,
    },
    validate: schemaResolver(validationSchema),
  });

  // Populate form when data arrives or modal opens
  React.useEffect(() => {
    if (opened) {
      if (gameListDetails?.id) {
        form.setValues({
          status: gameListDetails.status_code as StatusEnum,
          score: gameListDetails.score ?? null,
          owned_on: gameListDetails.owned_on.map(media => media.id.toString()),
          description: gameListDetails.description ?? "",
          started_at: parseDate(gameListDetails.started_at, "YYYY-MM-DD"),
          completed_at: parseDate(gameListDetails.completed_at, "YYYY-MM-DD"),
          playtime: gameListDetails.playtime ?? null,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameListDetails, opened]);

  // Autopopulate dates when status changes
  React.useEffect(() => {
    if (form.isDirty("status")) {
      if (form.values.status === StatusEnum.P && !form.values.started_at) {
        form.setFieldValue("started_at", new Date());
      } else if (form.values.status === StatusEnum.C && !form.values.completed_at) {
        form.setFieldValue("completed_at", new Date());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.status]);

  const onSubmitHandler = async (data: ValidationSchema) => {
    if (!parsedGameId || !currentUserId) {
      notifications.show({ title: "Error", message: "Invalid context", color: "red" });
      return;
    }

    const payload = {
      status: data.status,
      score: data.score,
      owned_on: data.owned_on?.map(Number) ?? [],
      description: data.description || undefined,
      started_at: formatDate(data.started_at, "YYYY-MM-DD"),
      completed_at: formatDate(data.completed_at, "YYYY-MM-DD"),
      playtime: data.playtime,
    };

    try {
      if (gameListDetails?.id) {
        await partialUpdateGameListItem({
          id: gameListDetails.id,
          body: payload,
        });
        notifications.show({ title: "Success", message: "Updated list successfully", color: "green" });
      } else {
        await createGameListItem({
          ...payload,
          game: parsedGameId,
          user: currentUserId,
        });
        notifications.show({ title: "Success", message: "Added to list successfully", color: "green" });
      }
      onClose();
    } catch (error: unknown) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
      });
    }
  };

  const handleRemove = async () => {
    if (gameListDetails?.id) {
      try {
        await deleteGameListItem(gameListDetails.id);
        notifications.show({ title: "Success", message: "Removed from list successfully", color: "green" });
        onClose();
      } catch (error: unknown) {
        notifications.show({
          title: "Error",
          message: error instanceof Error ? error.message : "Failed to remove",
          color: "red",
        });
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={gameListDetails?.id ? "Edit List Entry" : "Add to My List"}
      size="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <form onSubmit={form.onSubmit(onSubmitHandler)} noValidate>
        <Stack gap={16}>
          <Group align="flex-start" grow>
            <Select
              required
              id="status"
              label="Status"
              name="status"
              searchable
              data={code_to_value_mapping().map(item => ({
                value: item.code,
                label: item.value,
              }))}
              {...form.getInputProps("status")}
            />
            <Select
              id="score"
              label="Your Score"
              name="score"
              searchable
              clearable
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => ({
                value: s.toString(),
                label: s.toString(),
              }))}
              renderOption={({ option }) => (
                <Box
                  style={{
                    background: getRatingColor(Number(option.value)),
                    color: "black",
                    fontSize: "12px",
                    fontWeight: 900,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    display: "inline-block",
                  }}
                >
                  {option.label}
                </Box>
              )}
              value={form.values.score ? form.values.score.toString() : null}
              onChange={val => form.setFieldValue("score", val ? Number(val) : null)}
              error={form.errors.score}
              leftSection={
                form.values.score ? (
                  <Box
                    style={{
                      background: getRatingColor(form.values.score),
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      marginLeft: 10,
                    }}
                  />
                ) : null
              }
            />
          </Group>

          <AsyncMultiSelectAutocomplete
            placeholder="Search platforms / media..."
            id="owned_on"
            label="Owned On"
            name="owned_on"
            useInfiniteQueryHook={useGetGameMediasInfiniteQuery}
            getOptionLabel={item => item.name}
            getOptionValue={item => item.id.toString()}
            {...form.getInputProps("owned_on")}
          />

          <Group align="flex-start" grow>
            <DateInput
              label="Started At"
              placeholder="Pick date"
              clearable
              valueFormat="YYYY-MM-DD"
              {...form.getInputProps("started_at")}
            />
            <DateInput
              label="Completed At"
              placeholder="Pick date"
              clearable
              valueFormat="YYYY-MM-DD"
              {...form.getInputProps("completed_at")}
            />
            <NumberInput
              label="Playtime (hours)"
              placeholder="0"
              min={0}
              allowNegative={false}
              {...form.getInputProps("playtime")}
            />
          </Group>

          <Textarea
            label="Note"
            placeholder="What do you think about the game?"
            maxLength={200}
            rows={3}
            {...form.getInputProps("description")}
          />

          <Group justify={gameListDetails?.id ? "space-between" : "flex-end"} mt="md">
            {gameListDetails?.id && (
              <Button type="button" onClick={handleRemove} variant="destructive" isLoading={isDeleting}>
                Remove
              </Button>
            )}
            <Group>
              <Button type="button" onClick={onClose} variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {gameListDetails?.id ? "Save Changes" : "Add to List"}
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
