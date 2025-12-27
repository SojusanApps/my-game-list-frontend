import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";

type CheckboxInputProps = {
  id: string;
  name: string;
  label: string;
  className?: string;
};

function CheckboxInput({ id, name, label, className }: Readonly<CheckboxInputProps>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field: { value, onChange, ...field } }) => (
        <div className={cn("mt-2", className)}>
          <div className="flex items-center gap-2">
            <input
              id={id}
              type="checkbox"
              checked={!!value}
              onChange={e => onChange(e.target.checked)}
              {...field}
              className={cn("checkbox checkbox-sm", errorMessage && "checkbox-error")}
            />
            <Label htmlFor={id} className="mb-0 cursor-pointer">
              {label}
            </Label>
          </div>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

export default CheckboxInput;
