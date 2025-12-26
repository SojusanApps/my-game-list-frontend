import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

import SelectInput from "@/components/Fields/FormInput/SelectInput";
import { TokenInfoType, LocalStorageUserType } from "@/helpers/CustomTypes";
import { StatusEnum } from "@/client";
import code_to_value_mapping from "@/helpers/GameListStatuses";
import {
  useCreateGameList,
  useDeleteGameList,
  useGetGameListByFilters,
  useGetGameMediasAllValues,
  usePartialUpdateGameList,
} from "@/hooks/gameQueries";

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
  let userInfo: TokenInfoType | undefined = undefined;
  const localStorageUser = localStorage.getItem("user");
  if (localStorageUser) {
    const userInstance: LocalStorageUserType = JSON.parse(localStorageUser);
    userInfo = jwtDecode<TokenInfoType>(userInstance.token);
  }

  const { data: gameMediaList, isLoading: isGameMediaLoading } = useGetGameMediasAllValues();
  const { data: gameListDetails } = useGetGameListByFilters(
    gameID ? { game: +gameID, user: userInfo?.user_id } : undefined,
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
    if (!gameID || !userInfo) {
      alert("Error during creating the game list");
      return;
    }
    createGameListItem({
      status: data.status,
      score: data.score,
      game: +gameID,
      user: userInfo.user_id,
      owned_on: data.owned_on?.map(Number) ?? [],
    });
  };

  const updateGameListItem = async (data: ValidationSchema) => {
    if (!gameListDetails?.id) {
      alert("Error during updating the game list");
      return;
    }

    partialUpdateGameListItem({
      id: gameListDetails.id,
      body: {
        status: data.status,
        score: data.score,
        owned_on: data.owned_on?.map(Number) ?? [],
      },
    });
  };

  const onSubmitHandler: SubmitHandler<ValidationSchema> = async (data: ValidationSchema) => {
    try {
      if (gameListDetails?.id) {
        await updateGameListItem(data);
      } else {
        await addGameListItem(data);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleRemove = () => {
    if (gameListDetails?.id) {
      deleteGameListItem(gameListDetails.id);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandler)} noValidate className="flex flex-col gap-2">
        <SelectInput
          placeholder="Select status ..."
          required
          id="status"
          label="Status"
          name="status"
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
          selectOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => ({
            value: score,
            label: score.toString(),
          }))}
          optionToSelect={gameListDetails?.id ? gameListDetails.score?.toString() : undefined}
        />
        {isGameMediaLoading ? (
          <p>Loading...</p>
        ) : (
          <SelectInput
            placeholder="Owned on ..."
            id="owned_on"
            label="Owned on"
            name="owned_on"
            selectOptions={
              gameMediaList?.map(media => ({
                value: media.id,
                label: media.name,
              })) ?? []
            }
            optionToSelect={
              gameListDetails?.id ? gameListDetails.owned_on.map(media => media.id.toString()) : undefined
            }
            multiple
          />
        )}
        {gameListDetails?.id ? (
          <div className="flex flex-row">
            <button type="submit" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
              Update
            </button>
            <button type="button" onClick={handleRemove} className="bg-error-950 text-white p-2 rounded-lg mx-auto">
              Remove
            </button>
          </div>
        ) : (
          <button type="submit" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
            Add to List
          </button>
        )}
      </form>
    </FormProvider>
  );
}

export default GameListActionsForm;
