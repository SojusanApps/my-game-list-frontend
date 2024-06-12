import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import SelectInput from "../../Fields/FormInput/SelectInput";
import DateInput from "../../Fields/FormInput/DateInput";
import TextFieldInput from "../../Fields/FormInput/TextFieldInput";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { DeveloperSimpleType } from "../../../models/Developer";
import { PublisherSimpleType } from "../../../models/Publisher";
import { GenreType } from "../../../models/Genre";
import { PlatformType } from "../../../models/Platform";
import StatusCode from "../../../helpers/StatusCode";

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
  const axiosPrivate = useAxiosPrivate();
  const [developerList, setDeveloperList] = React.useState<DeveloperSimpleType[]>([]);
  const [publisherList, setPublisherList] = React.useState<PublisherSimpleType[]>([]);
  const [genreList, setGenreList] = React.useState<GenreType[]>([]);
  const [platformList, setPlatformList] = React.useState<PlatformType[]>([]);
  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  React.useEffect(() => {
    const fetchDeveloperListData = async () => {
      const response = await axiosPrivate.get("/game/developers/all-values");
      if (response.status === StatusCode.OK) {
        if (response.data.length === 0) {
          return;
        }
        setDeveloperList(response.data);
      }
    };

    const fetchPublisherListData = async () => {
      const response = await axiosPrivate.get("/game/publishers/all-values");
      if (response.status === StatusCode.OK) {
        if (response.data.length === 0) {
          return;
        }
        setPublisherList(response.data);
      }
    };

    const fetchGenreListData = async () => {
      const response = await axiosPrivate.get("/game/genres/all-values");
      if (response.status === StatusCode.OK) {
        if (response.data.length === 0) {
          return;
        }
        setGenreList(response.data);
      }
    };

    const fetchPlatformListData = async () => {
      const response = await axiosPrivate.get("/game/platforms/all-values");
      if (response.status === StatusCode.OK) {
        if (response.data.length === 0) {
          return;
        }
        setPlatformList(response.data);
      }
    };

    fetchDeveloperListData();
    fetchPublisherListData();
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
            selectOptions={developerList.map(developerItem => ({
              value: developerItem.name,
              label: developerItem.name,
            }))}
          />
          <SelectInput
            placeholder="Select Publisher ..."
            id="publisher"
            label="Publisher"
            name="publisher"
            selectOptions={publisherList.map(publisherItem => ({
              value: publisherItem.name,
              label: publisherItem.name,
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
