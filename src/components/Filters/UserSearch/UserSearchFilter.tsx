import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import TextFieldInput from "../../Fields/FormInput/TextFieldInput";

const validationSchema = z
  .object({
    username: z.string().optional(),
  });

export type ValidationSchema = z.infer<typeof validationSchema>;

function UserSearchFilter({
  onSubmitHandlerCallback,
}: Readonly<{ onSubmitHandlerCallback: SubmitHandler<ValidationSchema> }>) {
  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandlerCallback)} noValidate>
        <div className="flex flex-row flex-wrap gap-2">
          <TextFieldInput id="username" name="username" type="text" label="Username" placeholder="Enter username ..." />
        </div>
        <button type="submit" className="bg-primary-950 text-white p-2 rounded-lg mx-auto mt-2">
          Filter
        </button>
      </form>
    </FormProvider>
  );
}

export default UserSearchFilter;
