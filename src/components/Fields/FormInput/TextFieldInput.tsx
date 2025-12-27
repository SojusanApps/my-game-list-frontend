import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";

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

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <div className={className}>
          <label htmlFor={id} className="block text-text-700 text-sm font-bold mb-2">
            {label}
            {required === true ? "*" : ""}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...field}
            className={cn(
              "form-control w-full px-3 py-1.5 text-text-700 rounded-lg border border-solid border-gray-300 focus:border-yellow-600 focus:outline-hidden",
              errors[name] && "border-red-500",
            )}
          />
          {!!errors[name] && <p className="text-red-500 text-xs italic">{`${errors[name]?.message}`}.</p>}
        </div>
      )}
    />
  );
}

export default TextFieldInput;
