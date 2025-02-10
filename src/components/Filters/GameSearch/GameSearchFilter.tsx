import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import SelectInput from "../../Fields/FormInput/SelectInput";
import DateInput from "../../Fields/FormInput/DateInput";
import TextFieldInput from "../../Fields/FormInput/TextFieldInput";
import StatusCode from "../../../helpers/StatusCode";
import { GameService, CompanySimpleName, Genre, Platform } from "../../../client";

const validationSchema = z
  .object({
    title: z.string().optional(),
    release_date_after: z.coerce.date().optional().or(z.literal("")),
    release_date_before: z.coerce.date().optional().or(z.literal("")),
    publisher: z.string().optional(),
    developer: z.string().optional(),
    platform: z.string().optional(),
    genres: z.string().array().optional(),
    ordering: z
      .enum(["-created_at", "created_at", "-rank_position", "rank_position", "-popularity", "popularity"])
      .optional(),
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

export type ValidationSchema = z.infer<typeof validationSchema>;

function GameSearchFilter({
  onSubmitHandlerCallback,
}: Readonly<{ onSubmitHandlerCallback: SubmitHandler<ValidationSchema> }>) {
  const [companyList, setCompanyList] = React.useState<CompanySimpleName[]>([]);
  const [genreList, setGenreList] = React.useState<Genre[]>([]);
  const [platformList, setPlatformList] = React.useState<Platform[]>([]);
  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  React.useEffect(() => {
    const fetchCompanyListData = async () => {
      // TODO: There is too much companies to get all of them at once in a single select box.
      // Maybe a feature with a single text field that will start to fetch data after 3 characters to autocomplete.
      const { data, response } = await GameService.gameCompaniesList();
      if (response.status === StatusCode.OK && data) {
        if (data.results.length === 0) {
          return;
        }
        setCompanyList(data.results);
      }
    };

    const fetchGenreListData = async () => {
      const { data, response } = await GameService.gameGenresAllValuesList();
      if (response.status === StatusCode.OK && data) {
        if (data.length === 0) {
          return;
        }
        setGenreList(data);
      }
    };

    const fetchPlatformListData = async () => {
      const { data, response } = await GameService.gamePlatformsAllValuesList();
      if (response.status === StatusCode.OK && data) {
        if (data.length === 0) {
          return;
        }
        setPlatformList(data);
      }
    };

    fetchCompanyListData();
    fetchGenreListData();
    fetchPlatformListData();
  }, []);

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
          <SelectInput
            placeholder="Select Developer ..."
            id="developer"
            label="Developer"
            name="developer"
            selectOptions={companyList.map(companyItem => ({
              value: companyItem.name,
              label: companyItem.name,
            }))}
          />
          <SelectInput
            placeholder="Select Publisher ..."
            id="publisher"
            label="Publisher"
            name="publisher"
            selectOptions={companyList.map(companyItem => ({
              value: companyItem.name,
              label: companyItem.name,
            }))}
          />
          <SelectInput
            placeholder="Select Platform ..."
            id="platform"
            label="Platform"
            name="platform"
            selectOptions={platformList.map(platformItem => ({
              value: platformItem.name,
              label: platformItem.name,
            }))}
          />
          <SelectInput
            placeholder="Select Genres ..."
            id="genres"
            label="Genres"
            name="genres"
            multiple
            selectOptions={genreList.map(genreItem => ({
              value: genreItem.name,
              label: genreItem.name,
            }))}
          />
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
