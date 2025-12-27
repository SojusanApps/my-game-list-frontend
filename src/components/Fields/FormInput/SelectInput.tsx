import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";

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

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={optionToSelect}
      render={({ field }) => (
        <div className={className}>
          <label htmlFor={id} className="block text-text-700 text-sm font-bold mb-2">
            {label}
            {required === true ? "*" : ""}
          </label>
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
            className={cn("form-control select select-sm select-bordered w-full", errors[name] && "select-error")}
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
          {!!errors[name] && (
            <p className="text-red-500 text-xs italic">
              {`${Array.isArray(errors[name]) ? errors[name][0]?.message : errors[name]?.message}`}.
            </p>
          )}
        </div>
      )}
    />
  );
}

export default SelectInput;
