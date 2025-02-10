import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

import SelectInput from "../../Fields/FormInput/SelectInput";
import StatusCode from "../../../helpers/StatusCode";
import { TokenInfoType, LocalStorageUserType } from "../../../helpers/CustomTypes";
import { GameList, GameService, StatusEnum } from "../../../client";
import code_to_value_mapping from "../../../helpers/GameListStatuses";

const validationSchema = z.object({
  status: z.enum([StatusEnum.C, ...Object.values(StatusEnum).slice(1)]),
  score: z.coerce
    .number()
    .min(1, { message: "The minimum score is 1" })
    .max(10, { message: "The maximum score is 10" })
    .nullable()
    .optional(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function GameListActionsForm({ gameID }: Readonly<{ gameID: string | undefined }>) {
  const [gameListDetails, setGameListDetails] = React.useState<GameList | null>(null);
  let userInfo: TokenInfoType;
  const localStorageUser = localStorage.getItem("user");
  if (localStorageUser) {
    const userInstance: LocalStorageUserType = JSON.parse(localStorageUser);
    userInfo = jwtDecode<TokenInfoType>(userInstance.token);
  }

  const defaultValues: ValidationSchema = {
    status: StatusEnum.PTP,
    score: undefined,
  };

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  React.useEffect(() => {
    const fetchGameListData = async () => {
      if (!gameID) {
        return;
      }
      const { data, response } = await GameService.gameGameListsList({
        query: {
          game: +gameID,
          user: userInfo.user_id,
        }
      });
      if (response.status === StatusCode.OK && data) {
        if (data.results.length === 0) {
          return;
        }
        const gameListDetailsData = data.results[0];
        setGameListDetails(gameListDetailsData);
        methods.setValue("status", gameListDetailsData.status_code as StatusEnum);
        methods.setValue("score", gameListDetailsData.score);
      }
    };

    fetchGameListData();
  }, []);

  const getGameListItem = async (gameListId: number) => {
    const {data: gameListData, response: getResponse} = await GameService.gameGameListsRetrieve({
      path: {id: gameListId}
    });
    if (getResponse.status !== StatusCode.OK || !gameListData) {
      alert("Error during fetching the game list");
      return;
    }
    return gameListData;
  }

  const addGameListItem = async (data: ValidationSchema) => {
    if (!gameID) {
      return;
    }
    const {data: gameListCreateData, response: createResponse} = await GameService.gameGameListsCreate({
      body: {
        status: data.status as StatusEnum,
        score: data.score,
        game: +gameID,
        user: userInfo.user_id,
        owned_on: [],
        // dummy data for the readonly fields to make typescript happy
        id: 0,
        created_at: "",
        last_modified_at: ""
      }
    })
    if (createResponse.status !== StatusCode.CREATED || !gameListCreateData) {
      alert("Error during addition to the list");
      return;
    }

    const gameListData = await getGameListItem(gameListCreateData.id);
    if (!gameListData) {
      return;
    }

    setGameListDetails(gameListData);
  };

  const updateGameListItem = async (data: ValidationSchema) => {
    const {data: updateData, response: updateResponse} = await GameService.gameGameListsPartialUpdate({
      path: {id: gameListDetails!.id},
      body: {
        status: data.status as StatusEnum,
        score: data.score
      }
    });
    if (updateResponse.status !== StatusCode.OK || !updateData) {
      alert("Error during updating the game list");
      return;
    }
    const gameListData = await getGameListItem(updateData.id);
    if (!gameListData) {
      return;
    }
    setGameListDetails(gameListData);
  };

  const onSubmitHandler: SubmitHandler<ValidationSchema> = async (data: ValidationSchema) => {
    try {
      if (gameListDetails) {
        await updateGameListItem(data);
      } else {
        await addGameListItem(data);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleRemove = () => {
    if (gameListDetails) {
      const removeGameListItem = async () => {
        const {response} = await GameService.gameGameListsDestroy({path: {id: gameListDetails.id}});
        if (response.status !== StatusCode.NO_CONTENT) {
          alert("Error during removal from the list");
          return;
        }
        setGameListDetails(null);
      };

      removeGameListItem();
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
          optionToSelect={gameListDetails?.status_code}
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
          optionToSelect={gameListDetails?.score?.toString()}
        />
        {gameListDetails ? (
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
