import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

import SelectInput from "../../Fields/FormInput/SelectInput";
import StatusCode from "../../../helpers/StatusCode";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import GameListStatuses from "../../../helpers/GameListStatuses";
import { GameListType } from "../../../models/GameList";
import { TokenInfoType, LocalStorageUserType } from "../../../helpers/CustomTypes";

const validationSchema = z.object({
  status: z.enum([GameListStatuses.ALL[0], ...GameListStatuses.ALL.slice(1)]),
  score: z.coerce
    .number()
    .min(1, { message: "The minimum score is 1" })
    .max(10, { message: "The maximum score is 10" })
    .optional(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function GameListActionsForm({ gameID }: Readonly<{ gameID: string | undefined }>) {
  const axiosPrivate = useAxiosPrivate();
  const [gameListDetails, setGameListDetails] = React.useState<GameListType | null>(null);
  let userInfo: TokenInfoType;
  const localStorageUser = localStorage.getItem("user");
  if (localStorageUser) {
    const userInstance: LocalStorageUserType = JSON.parse(localStorageUser);
    userInfo = jwtDecode<TokenInfoType>(userInstance.token);
  }

  const defaultValues: ValidationSchema = {
    status: "",
    score: undefined,
  };

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  React.useEffect(() => {
    const fetchGameListData = async () => {
      const response = await axiosPrivate.get(`/game/game-lists/?game=${gameID}&user=${userInfo.user_id}`);
      if (response.status === StatusCode.OK) {
        if (response.data.results.length === 0) {
          return;
        }
        const gameListDetailsData = response.data.results[0];
        setGameListDetails(gameListDetailsData);
        methods.setValue("status", gameListDetailsData.status_code);
        methods.setValue("score", gameListDetailsData.score);
      }
    };

    fetchGameListData();
  }, []);

  const addGameListItem = async (data: ValidationSchema) => {
    const response = await axiosPrivate.post("/game/game-lists/", {
      status: data.status,
      score: data.score,
      game: gameID,
      user: userInfo.user_id,
    });
    if (response.status !== StatusCode.CREATED) {
      alert("Error during addition to the list");
      return;
    }
    const responseData = response.data;
    setGameListDetails(responseData);
  };

  const updateGameListItem = async (data: ValidationSchema) => {
    const response = await axiosPrivate.patch(`/game/game-lists/${gameListDetails!.id}/`, {
      status: data.status,
      score: data.score,
    });
    if (response.status !== StatusCode.OK) {
      alert("Error during updating the game list");
      return;
    }
    const responseData = response.data;
    setGameListDetails(responseData);
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
        const response = await axiosPrivate.delete(`game/game-lists/${gameListDetails.id}`);
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
          selectOptions={GameListStatuses.CODE_TO_VALUE_MAPPING.map(codeToValue => ({
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
