import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";

type SelectOption = {
  value: string | number;
  label: string;
};

type SelectInputInputProps = {
  id: string;
  name: string;
  required?: boolean;
  label: string;
  placeholder: string;
  selectOptions: SelectOption[];
  optionToSelect?: string | string[];
  multiple?: boolean;
  className?: string;
};

function SelectInput({
  id,
  name,
  required = false,
  label,
  placeholder,
  selectOptions,
  optionToSelect = undefined,
  multiple = false,
  className,
}: Readonly<SelectInputInputProps>) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [selectedValue, setSelectedValue] = React.useState<string | undefined | string[]>(optionToSelect);

  React.useEffect(() => {
    setSelectedValue(optionToSelect);
  }, [optionToSelect]);

  const error = errors[name];
  const errorMessage = (Array.isArray(error) ? error[0]?.message : error?.message) as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={optionToSelect}
      render={({ field }) => (
        <div className={className}>
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
          <select
            id={id}
            {...field}
            value={selectedValue ?? optionToSelect ?? (multiple ? [] : "")}
            onChange={event => {
              field.onChange(event);
              if (multiple) {
                const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
                setSelectedValue(selectedValues);
                setValue(name, selectedValues);
              } else {
                setSelectedValue(event.target.value);
              }
            }}
            className={cn(
              "form-control select select-sm select-bordered w-full",
              errorMessage && "select-error border-red-500",
            )}
            multiple={multiple}
          >
            <option disabled value="">
              {placeholder}
            </option>
            {selectOptions.map(selectOption => (
              <option key={selectOption.value} value={selectOption.value}>
                {selectOption.label}
              </option>
            ))}
          </select>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

export default SelectInput;
