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
} from "../hooks/gameQueries";
import { Company, Platform, Genre } from "@/client";
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
    platform: z.string().optional(),
    genres: z.string().array().optional(),
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
          {/* Group 1: Core Search */}
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
          </div>

          {/* Group 2: Entity & Platform */}
          <div className="flex flex-col gap-4">
            <AsyncAutocomplete
              id="developer"
              name="developer"
              label="Developer (Single)"
              placeholder="Search developer..."
              useInfiniteQueryHook={useGetCompaniesInfiniteQuery}
              getOptionLabel={(company: Company) => company.name}
              getOptionValue={(company: Company) => company.name}
            />

            <AsyncAutocomplete
              id="publisher"
              name="publisher"
              label="Publisher (Single)"
              placeholder="Search publisher..."
              useInfiniteQueryHook={useGetCompaniesInfiniteQuery}
              getOptionLabel={(company: Company) => company.name}
              getOptionValue={(company: Company) => company.name}
            />

            <AsyncAutocomplete
              id="platform"
              name="platform"
              label="Platform (Single)"
              placeholder="Search platform..."
              useInfiniteQueryHook={useGetPlatformsInfiniteQuery}
              getOptionLabel={(platform: Platform) => platform.name}
              getOptionValue={(platform: Platform) => platform.name}
            />
          </div>

          {/* Group 3: Dates & Genres */}
          <div className="flex flex-col gap-4">
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

            <AsyncMultiSelectAutocomplete
              placeholder="Search genres..."
              id="genres"
              label="Genres (Multiple)"
              name="genres"
              useInfiniteQueryHook={useGetGenresInfiniteQuery}
              getOptionLabel={(genre: Genre) => genre.name}
              getOptionValue={(genre: Genre) => genre.name}
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
