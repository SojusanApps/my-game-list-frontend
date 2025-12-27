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
              "form-control w-full px-3 py-1.5 text-text-700 rounded-lg border border-solid border-gray-300 focus:border-yellow-600 focus:outline-hidden transition-colors",
              errorMessage && "border-red-500 focus:border-red-500",
            )}
          />
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

export default TextFieldInput;
