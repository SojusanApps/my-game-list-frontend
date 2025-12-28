import React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

import toast from "react-hot-toast";

import SelectInput from "@/components/ui/Form/SelectInput";
import MultiSelectAutocomplete from "@/components/ui/Form/MultiSelectAutocomplete";
import { Button } from "@/components/ui/Button";
import { TokenInfoType } from "@/types";
import { StatusEnum } from "@/client";
import code_to_value_mapping from "../utils/GameListStatuses";
import { idSchema } from "@/lib/validation";
import {
  useCreateGameList,
  useDeleteGameList,
  useGetGameListByFilters,
  useGetGameMediasAllValues,
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
type ValidationInput = z.input<typeof validationSchema>;

function GameListActionsForm({ gameID }: Readonly<{ gameID: string | undefined }>) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const parsedGameId = idSchema.safeParse(gameID);

  let userInfo: TokenInfoType | undefined = undefined;
  if (user) {
    userInfo = jwtDecode<TokenInfoType>(user.token);
  }

  const { data: gameMediaList, isLoading: isGameMediaLoading } = useGetGameMediasAllValues();
  const { data: gameListDetails } = useGetGameListByFilters(
    parsedGameId.success && userInfo ? { game: parsedGameId.data, user: userInfo.user_id } : undefined,
    { enabled: parsedGameId.success && !!userInfo },
  );

  const { mutate: deleteGameListItem } = useDeleteGameList();
  const { mutate: createGameListItem } = useCreateGameList();
  const { mutate: partialUpdateGameListItem } = usePartialUpdateGameList();

  const defaultValues: ValidationInput = {
    status: StatusEnum.PTP,
    score: undefined,
    owned_on: [],
  };

  const methods = useForm<ValidationInput, object, ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const { reset } = methods;

  React.useEffect(() => {
    if (gameListDetails?.id) {
      reset({
        status: gameListDetails.status_code as StatusEnum,
        score: gameListDetails.score ?? undefined,
        owned_on: gameListDetails.owned_on.map(media => media.id.toString()),
      });
    }
  }, [gameListDetails, reset]);

  const addGameListItem = async (data: ValidationSchema) => {
    if (!parsedGameId.success || !userInfo) {
      toast.error("Error during creating the game list");
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
        onSuccess: () => toast.success("Added to list successfully"),
        onError: error => toast.error(error.message || "Failed to add to list"),
      },
    );
  };

  const updateGameListItem = async (data: ValidationSchema) => {
    if (!gameListDetails?.id) {
      toast.error("Error during updating the game list");
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
          toast.success("Updated list successfully");
          setIsCollapsed(true);
        },
        onError: error => toast.error(error.message || "Failed to update list"),
      },
    );
  };

  const onSubmitHandler: SubmitHandler<ValidationSchema> = async (data: ValidationSchema) => {
    try {
      if (gameListDetails?.id) {
        await updateGameListItem(data);
      } else {
        await addGameListItem(data);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleRemove = () => {
    if (gameListDetails?.id) {
      deleteGameListItem(gameListDetails.id, {
        onSuccess: () => toast.success("Removed from list successfully"),
        onError: error => toast.error(error.message || "Failed to remove from list"),
      });
    }
  };

  if (gameListDetails?.id && isCollapsed) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full animate-in fade-in slide-in-from-top-1 duration-300">
        <div className="flex flex-wrap items-center gap-6 flex-1">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-text-400 uppercase tracking-widest">Status</span>
            <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
              {gameListDetails.status}
            </span>
          </div>

          {gameListDetails.score && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-text-400 uppercase tracking-widest">Your Score</span>
              <span className="text-sm font-black text-secondary-700 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-100 text-center">
                {gameListDetails.score} / 10
              </span>
            </div>
          )}

          {gameListDetails.owned_on.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-text-400 uppercase tracking-widest">Owned On</span>
              <div className="flex gap-1.5 flex-wrap">
                {gameListDetails.owned_on.map(media => (
                  <span
                    key={media.id}
                    className="text-[10px] font-bold text-text-600 bg-background-100 px-2 py-0.5 rounded border border-background-200"
                  >
                    {media.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="tooltip" data-tip="Modify your list entry">
          <Button
            onClick={() => setIsCollapsed(false)}
            variant="outline"
            size="sm"
            className="w-full md:w-32 h-10 font-bold border-primary-200 text-primary-600 hover:bg-primary-50"
          >
            Edit Entry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        noValidate
        className="flex flex-col md:flex-row gap-6 items-end w-full animate-in fade-in slide-in-from-top-1 duration-300"
      >
        <SelectInput
          placeholder="Select status ..."
          required
          id="status"
          label="Status"
          name="status"
          className="w-full md:w-44 shrink-0"
          selectOptions={code_to_value_mapping().map(codeToValue => ({
            value: codeToValue.code,
            label: codeToValue.value,
          }))}
          optionToSelect={gameListDetails?.id ? gameListDetails.status_code : undefined}
        />
        <SelectInput
          placeholder="Score ..."
          id="score"
          label="Score"
          name="score"
          className="w-full md:w-20 shrink-0"
          selectOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => ({
            value: score,
            label: score.toString(),
          }))}
          optionToSelect={gameListDetails?.id ? gameListDetails.score?.toString() : undefined}
        />
        {isGameMediaLoading ? (
          <div className="flex flex-col gap-2 w-full md:flex-1 min-w-50">
            <p className="text-sm font-bold text-text-700 mb-0.5">Owned on</p>
            <div className="h-10 bg-background-100 animate-pulse rounded-md border border-background-200" />
          </div>
        ) : (
          <MultiSelectAutocomplete
            placeholder="Search media ..."
            id="owned_on"
            label="Owned on"
            name="owned_on"
            className="w-full md:flex-1 min-w-50"
            options={
              gameMediaList?.map(media => ({
                value: media.id,
                label: media.name,
              })) ?? []
            }
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-32 shrink-0 h-full justify-end">
          {gameListDetails?.id ? (
            <>
              <div className="tooltip" data-tip="Save changes to your list entry">
                <Button type="submit" className="w-full h-10">
                  Update
                </Button>
              </div>
              <div className="tooltip" data-tip="Discard changes and hide form">
                <Button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  variant="outline"
                  className="w-full h-10 text-sm font-bold border-background-300 text-text-600 hover:bg-background-100 hover:text-text-900 transition-all"
                >
                  Cancel
                </Button>
              </div>
              <div className="tooltip" data-tip="Remove this game from your collection">
                <Button type="button" onClick={handleRemove} variant="destructive" className="w-full h-10">
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <div className="tooltip" data-tip="Add this game to your personal library">
              <Button type="submit" fullWidth className="h-10">
                Add to List
              </Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

export default GameListActionsForm;
