import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";

type CheckboxInputProps = {
  id: string;
  name: string;
  label: string;
};

function CheckboxInput({ id, name, label }: Readonly<CheckboxInputProps>) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <div className="flex mt-2 w-auto">
          <input id={id} type="checkbox" {...field} className="form-control flex-none w-5" />
          <label htmlFor={id} className="block text-text-800 text-sm font-bold ml-2">
            {label}
          </label>
        </div>
      )}
    />
  );
}

export default CheckboxInput;
