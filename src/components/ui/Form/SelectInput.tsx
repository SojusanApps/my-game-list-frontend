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
          <div className="relative">
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
                "flex h-10 w-full rounded-md border border-background-300 bg-white px-3 py-2 text-sm text-text-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer appearance-none",
                errorMessage && "border-error-500 focus:ring-error-500",
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
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-text-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

export default SelectInput;
