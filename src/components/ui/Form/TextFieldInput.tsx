import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";

type TextFieldInputProps = {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  label: string;
  placeholder: string;
  className?: string;
};

function TextFieldInput({ id, name, type, required, label, placeholder, className }: Readonly<TextFieldInputProps>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <div className={className}>
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...field}
            className={cn(
              "flex h-10 w-full rounded-md border border-background-300 bg-white px-3 py-2 text-sm text-text-900 placeholder:text-text-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              errorMessage && "border-error-500 focus:ring-error-500",
            )}
          />
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

export default TextFieldInput;
