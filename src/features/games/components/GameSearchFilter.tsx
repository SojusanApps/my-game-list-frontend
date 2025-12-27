import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import SelectInput from "@/components/ui/Form/SelectInput";
import DateInput from "@/components/ui/Form/DateInput";
import TextFieldInput from "@/components/ui/Form/TextFieldInput";
import { useGetCompaniesList, useGetGenresAllValues, useGetPlatformsAllValues } from "../hooks/gameQueries";

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
    ordering: z.enum(ORDERING_OPTIONS).optional(),
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
  // TODO: There is too much companies to get all of them at once in a single select box.
  // Maybe a feature with a single text field that will start to fetch data after 3 characters to autocomplete.
  const { data: companyList, isLoading: isCompanyListLoading } = useGetCompaniesList();
  const { data: genreList, isLoading: isGenreListLoading } = useGetGenresAllValues();
  const { data: platformList, isLoading: isPlatformListLoading } = useGetPlatformsAllValues();
  const methods = useForm<ValidationInput, object, ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandlerCallback)} noValidate>
        <div className="flex flex-row flex-wrap gap-2">
          <TextFieldInput id="title" name="title" type="text" label="Title" placeholder="Enter title ..." />
          <DateInput
            id="release_date_after"
            name="release_date_after"
            label="Release date after"
            placeholder="Select date ..."
          />
          <DateInput
            id="release_date_before"
            name="release_date_before"
            label="Release date before"
            placeholder="Select date ..."
          />
          {isCompanyListLoading ? (
            <p>Loading...</p>
          ) : (
            <SelectInput
              placeholder="Select Developer ..."
              id="developer"
              label="Developer"
              name="developer"
              selectOptions={companyList!.results.map(companyItem => ({
                value: companyItem.name,
                label: companyItem.name,
              }))}
            />
          )}
          {isCompanyListLoading ? (
            <p>Loading...</p>
          ) : (
            <SelectInput
              placeholder="Select Publisher ..."
              id="publisher"
              label="Publisher"
              name="publisher"
              selectOptions={companyList!.results.map(companyItem => ({
                value: companyItem.name,
                label: companyItem.name,
              }))}
            />
          )}
          {isPlatformListLoading ? (
            <p>Loading...</p>
          ) : (
            <SelectInput
              placeholder="Select Platform ..."
              id="platform"
              label="Platform"
              name="platform"
              selectOptions={platformList!.map(platformItem => ({
                value: platformItem.name,
                label: platformItem.name,
              }))}
            />
          )}
          {isGenreListLoading ? (
            <p>Loading...</p>
          ) : (
            <SelectInput
              placeholder="Select Genres ..."
              id="genres"
              label="Genres"
              name="genres"
              multiple
              selectOptions={genreList!.map(genreItem => ({
                value: genreItem.name,
                label: genreItem.name,
              }))}
            />
          )}
          <SelectInput
            placeholder="Select ordering ..."
            id="ordering"
            label="Ordering"
            name="ordering"
            selectOptions={[
              { value: "created_at", label: "Created at" },
              { value: "-created_at", label: "Created at (Descending)" },
              { value: "rank_position", label: "Rank position" },
              { value: "-rank_position", label: "Rank position (Descending)" },
              { value: "popularity", label: "Popularity" },
              { value: "-popularity", label: "Popularity (Descending)" },
            ]}
          />
        </div>
        <button type="submit" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
          Filter
        </button>
      </form>
    </FormProvider>
  );
}

export default GameSearchFilter;
