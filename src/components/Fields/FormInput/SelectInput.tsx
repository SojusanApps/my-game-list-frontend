import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";

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
  optionToSelect?: string;
};

function SelectInput({
  id,
  name,
  required = false,
  label,
  placeholder,
  selectOptions,
  optionToSelect = undefined,
}: Readonly<SelectInputInputProps>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(optionToSelect);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={optionToSelect}
      render={({ field }) => (
        <div>
          <label htmlFor={id} className="block text-text-700 text-sm font-bold mb-2">
            {label}
            {required === true ? "*" : ""}
          </label>
          <select
            id={id}
            {...field}
            value={selectedValue ?? optionToSelect ?? ""}
            onChange={event => {
              field.onChange(event);
              setSelectedValue(event.target.value);
            }}
            className="form-control select select-sm select-bordered w-full"
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
          {!!errors[name] && <p className="text-red-500 text-xs italic">{`${errors[name]?.message}`}.</p>}
        </div>
      )}
    />
  );
}

export default SelectInput;
