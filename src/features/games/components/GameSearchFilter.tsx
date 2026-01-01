import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import CustomSelect from "@/components/ui/Form/CustomSelect";
import YearSelect from "@/components/ui/Form/YearSelect";
import TextFieldInput from "@/components/ui/Form/TextFieldInput";
import { Button } from "@/components/ui/Button";
import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import AsyncAutocomplete from "@/components/ui/Form/AsyncAutocomplete";
import {
  useGetGenresInfiniteQuery,
  useGetPlatformsInfiniteQuery,
  useGetCompaniesInfiniteQuery,
  useGetGameEnginesInfiniteQuery,
  useGetGameModesInfiniteQuery,
  useGetGameStatusesInfiniteQuery,
  useGetGameTypesInfiniteQuery,
  useGetPlayerPerspectivesInfiniteQuery,
} from "../hooks/gameQueries";
import { Company, Platform, Genre, GameEngine, GameMode, GameStatus, GameType, PlayerPerspective } from "@/client";
const ORDERING_OPTIONS = [
  "-created_at",
  "created_at",
  "-rank_position",
  "rank_position",
  "-popularity",
  "popularity",
] as const;

const validationSchema = z
  .object({
    title: z.string().optional(),
    release_date_after: z.coerce.date().optional().or(z.literal("")),
    release_date_before: z.coerce.date().optional().or(z.literal("")),
    publisher: z.string().optional(),
    developer: z.string().optional(),
    platforms: z.string().array().optional(),
    genres: z.string().array().optional(),
    game_engines: z.string().array().optional(),
    game_modes: z.string().array().optional(),
    game_status: z.string().array().optional(),
    game_type: z.string().array().optional(),
    player_perspectives: z.string().array().optional(),
    ordering: z.enum(ORDERING_OPTIONS).optional().or(z.literal("")),
  })
  .refine(
    data => {
      if (data.release_date_after === undefined || data.release_date_after === "") {
        return true;
      }
      if (data.release_date_before === undefined || data.release_date_before === "") {
        return true;
      }
      return data.release_date_before > data.release_date_after;
    },
    {
      message: "The before date cannot be earlier than the after date.",
      path: ["release_date_before"],
    },
  );

export type ValidationSchema = z.output<typeof validationSchema>;
export type ValidationInput = z.input<typeof validationSchema>;

function GameSearchFilter({
  onSubmitHandlerCallback,
}: Readonly<{ onSubmitHandlerCallback: SubmitHandler<ValidationSchema> }>) {
  const methods = useForm<ValidationInput, object, ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandlerCallback)} noValidate className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {/* Group 1: Core Search & Ordering */}
          <div className="flex flex-col gap-4">
            <TextFieldInput id="title" name="title" type="text" label="Game Title" placeholder="Search by name..." />
            <CustomSelect
              placeholder="Select ordering ..."
              id="ordering"
              label="Sort Results By"
              name="ordering"
              options={[
                { value: "created_at", label: "Created at" },
                { value: "-created_at", label: "Created at (Descending)" },
                { value: "rank_position", label: "Rank position" },
                { value: "-rank_position", label: "Rank position (Descending)" },
                { value: "popularity", label: "Popularity" },
                { value: "-popularity", label: "Popularity (Descending)" },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <YearSelect
                id="release_date_after"
                name="release_date_after"
                label="Release After"
                placeholder="Year..."
              />
              <YearSelect
                id="release_date_before"
                name="release_date_before"
                label="Release Before"
                placeholder="Year..."
              />
            </div>
          </div>

          {/* Group 2: Entities & Genres */}
          <div className="flex flex-col gap-4">
            <AsyncAutocomplete
              id="developer"
              name="developer"
              label="Developer"
              placeholder="Search developer..."
              useInfiniteQueryHook={useGetCompaniesInfiniteQuery}
              getOptionLabel={(company: Company) => company.name}
              getOptionValue={(company: Company) => company.name}
            />

            <AsyncAutocomplete
              id="publisher"
              name="publisher"
              label="Publisher"
              placeholder="Search publisher..."
              useInfiniteQueryHook={useGetCompaniesInfiniteQuery}
              getOptionLabel={(company: Company) => company.name}
              getOptionValue={(company: Company) => company.name}
            />

            <AsyncMultiSelectAutocomplete
              placeholder="Search genres..."
              id="genres"
              label="Genres"
              name="genres"
              useInfiniteQueryHook={useGetGenresInfiniteQuery}
              getOptionLabel={(genre: Genre) => genre.name}
              getOptionValue={(genre: Genre) => genre.name}
            />

            <AsyncMultiSelectAutocomplete
              placeholder="Search platforms..."
              id="platforms"
              label="Platforms"
              name="platforms"
              useInfiniteQueryHook={useGetPlatformsInfiniteQuery}
              getOptionLabel={(platform: Platform) => platform.name}
              getOptionValue={(platform: Platform) => platform.name}
            />
          </div>

          {/* Group 3: Game Properties */}
          <div className="flex flex-col gap-4">
            <AsyncMultiSelectAutocomplete
              placeholder="Search game types..."
              id="game_type"
              label="Game Types"
              name="game_type"
              useInfiniteQueryHook={useGetGameTypesInfiniteQuery}
              getOptionLabel={(type: GameType) => type.type}
              getOptionValue={(type: GameType) => type.type}
            />
            <AsyncMultiSelectAutocomplete
              placeholder="Search game statuses..."
              id="game_status"
              label="Game Statuses"
              name="game_status"
              useInfiniteQueryHook={useGetGameStatusesInfiniteQuery}
              getOptionLabel={(status: GameStatus) => status.status}
              getOptionValue={(status: GameStatus) => status.status}
            />
            <AsyncMultiSelectAutocomplete
              placeholder="Search engines..."
              id="game_engines"
              label="Game Engines"
              name="game_engines"
              useInfiniteQueryHook={useGetGameEnginesInfiniteQuery}
              getOptionLabel={(engine: GameEngine) => engine.name}
              getOptionValue={(engine: GameEngine) => engine.name}
            />
            <AsyncMultiSelectAutocomplete
              placeholder="Search modes..."
              id="game_modes"
              label="Game Modes"
              name="game_modes"
              useInfiniteQueryHook={useGetGameModesInfiniteQuery}
              getOptionLabel={(mode: GameMode) => mode.name}
              getOptionValue={(mode: GameMode) => mode.name}
            />
            <AsyncMultiSelectAutocomplete
              placeholder="Search perspectives..."
              id="player_perspectives"
              label="Player Perspectives"
              name="player_perspectives"
              useInfiniteQueryHook={useGetPlayerPerspectivesInfiniteQuery}
              getOptionLabel={(perspective: PlayerPerspective) => perspective.name}
              getOptionValue={(perspective: PlayerPerspective) => perspective.name}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t border-background-100">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-64 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Apply Filters
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default GameSearchFilter;
