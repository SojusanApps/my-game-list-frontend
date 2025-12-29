import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import TextFieldInput from "@/components/ui/Form/TextFieldInput";

const validationSchema = z.object({
  name: z.string().optional(),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

import { Button } from "@/components/ui/Button";

function CompanySearchFilter({
  onSubmitHandlerCallback,
}: Readonly<{ onSubmitHandlerCallback: SubmitHandler<ValidationSchema> }>) {
  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandlerCallback)} noValidate className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-4">
            <TextFieldInput id="name" name="name" type="text" label="Company Name" placeholder="Search by name..." />
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

export default CompanySearchFilter;
