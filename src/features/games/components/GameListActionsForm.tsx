import React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import { notifications } from "@mantine/notifications";
import { Tooltip, Select, Group, Stack, Text } from "@mantine/core";

import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import { Button } from "@/components/ui/Button";
import { TokenInfoType } from "@/types";
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
import { useAuth } from "@/features/auth/context/AuthProvider";

const validationSchema = z.object({
  status: z.enum(StatusEnum),
  score: z.coerce
    .number()
    .min(1, { message: "The minimum score is 1" })
    .max(10, { message: "The maximum score is 10" })
    .nullable()
    .optional(),
  owned_on: z.array(z.string()).optional(),
});

type ValidationSchema = z.output<typeof validationSchema>;

function GameListActionsForm({ gameID }: Readonly<{ gameID: string | undefined }>) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const parsedGameId = idSchema.safeParse(gameID);

  let userInfo: TokenInfoType | undefined = undefined;
  if (user) {
    userInfo = jwtDecode<TokenInfoType>(user.token);
  }

  const { data: gameListDetails } = useGetGameListByFilters(
    parsedGameId.success && userInfo ? { game: parsedGameId.data, user: userInfo.user_id } : undefined,
    { enabled: parsedGameId.success && !!userInfo },
  );

  const { mutate: deleteGameListItem } = useDeleteGameList();
  const { mutate: createGameListItem } = useCreateGameList();
  const { mutate: partialUpdateGameListItem } = usePartialUpdateGameList();

  const form = useForm<ValidationSchema>({
    initialValues: {
      status: StatusEnum.PTP,
      score: undefined,
      owned_on: [],
    },
    validate: zod4Resolver(validationSchema),
  });

  React.useEffect(() => {
    if (gameListDetails?.id) {
      form.setValues({
        status: gameListDetails.status_code as StatusEnum,
        score: gameListDetails.score ?? undefined,
        owned_on: gameListDetails.owned_on.map(media => media.id.toString()),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameListDetails]);

  const addGameListItem = async (data: ValidationSchema) => {
    if (!parsedGameId.success || !userInfo) {
      notifications.show({ title: "Error", message: "Error during creating the game list", color: "red" });
      return;
    }
    createGameListItem(
      {
        status: data.status,
        score: data.score,
        game: parsedGameId.data,
        user: userInfo.user_id,
        owned_on: data.owned_on?.map(Number) ?? [],
      },
      {
        onSuccess: () =>
          notifications.show({ title: "Success", message: "Added to list successfully", color: "green" }),
        onError: error =>
          notifications.show({ title: "Error", message: error.message || "Failed to add to list", color: "red" }),
      },
    );
  };

  const updateGameListItem = async (data: ValidationSchema) => {
    if (!gameListDetails?.id) {
      notifications.show({ title: "Error", message: "Error during updating the game list", color: "red" });
      return;
    }

    partialUpdateGameListItem(
      {
        id: gameListDetails.id,
        body: {
          status: data.status,
          score: data.score,
          owned_on: data.owned_on?.map(Number) ?? [],
        },
      },
      {
        onSuccess: () => {
          notifications.show({ title: "Success", message: "Updated list successfully", color: "green" });
          setIsCollapsed(true);
        },
        onError: error =>
          notifications.show({ title: "Error", message: error.message || "Failed to update list", color: "red" }),
      },
    );
  };

  const onSubmitHandler = async (data: ValidationSchema) => {
    try {
      if (gameListDetails?.id) {
        await updateGameListItem(data);
      } else {
        await addGameListItem(data);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
      });
    }
  };

  const handleRemove = () => {
    if (gameListDetails?.id) {
      deleteGameListItem(gameListDetails.id, {
        onSuccess: () =>
          notifications.show({ title: "Success", message: "Removed from list successfully", color: "green" }),
        onError: error =>
          notifications.show({ title: "Error", message: error.message || "Failed to remove from list", color: "red" }),
      });
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--color-text-400)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 4,
  };

  if (gameListDetails?.id && isCollapsed) {
    return (
      <Stack gap={12}>
        <Text fw={800} fz="md" c="var(--color-text-900)" style={{ letterSpacing: "-0.02em" }}>
          My List Entry
        </Text>

        <Group align="flex-start" gap={24} wrap="wrap">
          <Stack gap={4}>
            <Text component="span" style={labelStyle}>
              Status
            </Text>
            <Text
              component="span"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--mantine-color-primary-7)",
                background: "var(--mantine-color-primary-0)",
                padding: "4px 14px",
                borderRadius: "9999px",
                border: "1px solid var(--mantine-color-primary-2)",
                whiteSpace: "nowrap",
              }}
            >
              {gameListDetails.status}
            </Text>
          </Stack>

          {gameListDetails.score && (
            <Stack gap={4}>
              <Text component="span" style={labelStyle}>
                Score
              </Text>
              <Text
                component="span"
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "var(--mantine-color-secondary-7, #92400e)",
                  background: "var(--mantine-color-secondary-0, #fffbeb)",
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  border: "1px solid var(--mantine-color-secondary-2, #fde68a)",
                  whiteSpace: "nowrap",
                }}
              >
                {gameListDetails.score} / 10
              </Text>
            </Stack>
          )}

          {gameListDetails.owned_on.length > 0 && (
            <Stack gap={4}>
              <Text component="span" style={labelStyle}>
                Owned On
              </Text>
              <Group gap={6} wrap="wrap">
                {gameListDetails.owned_on.map(media => (
                  <Text
                    component="span"
                    key={media.id}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--color-text-600)",
                      background: "var(--color-background-100)",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--color-background-300)",
                    }}
                  >
                    {media.name}
                  </Text>
                ))}
              </Group>
            </Stack>
          )}
        </Group>

        <Group justify="flex-end">
          <Tooltip label="Modify your list entry">
            <Button onClick={() => setIsCollapsed(false)} variant="outline" size="sm">
              Edit Entry
            </Button>
          </Tooltip>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap={16}>
      <Text fw={800} fz="md" c="var(--color-text-900)" style={{ letterSpacing: "-0.02em" }}>
        {gameListDetails?.id ? "Edit List Entry" : "Add to My List"}
      </Text>

      <form
        onSubmit={form.onSubmit(onSubmitHandler)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <Group align="flex-end" gap={12} wrap="wrap">
          <Select
            placeholder="Select a status..."
            required
            id="status"
            label="Status"
            name="status"
            size="md"
            style={{ minWidth: "180px", flex: "1 1 180px" }}
            searchable
            clearable
            data={code_to_value_mapping().map(codeToValue => ({
              value: codeToValue.code,
              label: codeToValue.value,
            }))}
            {...form.getInputProps("status")}
          />
          <Select
            placeholder="1 – 10"
            id="score"
            label="Your Score"
            name="score"
            size="md"
            style={{ minWidth: "110px", flex: "0 0 110px" }}
            searchable
            clearable
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => ({
              value: score.toString(),
              label: `${score} / 10`,
            }))}
            {...form.getInputProps("score")}
          />
          <AsyncMultiSelectAutocomplete
            placeholder="Search platforms / media..."
            id="owned_on"
            label="Owned On"
            name="owned_on"
            style={{ flex: "1 1 200px" }}
            useInfiniteQueryHook={useGetGameMediasInfiniteQuery}
            getOptionLabel={item => item.name}
            getOptionValue={item => item.id}
            {...form.getInputProps("owned_on")}
          />
        </Group>

        <Group justify="space-between" gap={8}>
          {gameListDetails?.id ? (
            <>
              <Tooltip label="Remove this game from your list">
                <Button type="button" onClick={handleRemove} variant="destructive" size="sm">
                  Remove from List
                </Button>
              </Tooltip>
              <Group gap={8}>
                <Tooltip label="Discard changes">
                  <Button type="button" onClick={() => setIsCollapsed(true)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </Tooltip>
                <Tooltip label="Save changes to your list entry">
                  <Button type="submit" size="sm">
                    Save Changes
                  </Button>
                </Tooltip>
              </Group>
            </>
          ) : (
            <Group justify="flex-end" style={{ width: "100%" }}>
              <Tooltip label="Add this game to your personal library">
                <Button type="submit" size="sm">
                  Add to My List
                </Button>
              </Tooltip>
            </Group>
          )}
        </Group>
      </form>
    </Stack>
  );
}

export default GameListActionsForm;
