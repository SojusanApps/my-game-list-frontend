/* eslint-disable jsx-a11y/prefer-tag-over-role */
import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import XMarkIcon from "@/components/ui/Icons/XMark";

type SelectOption = {
  value: string | number;
  label: string;
};

type CustomSelectProps = {
  id: string;
  name: string;
  required?: boolean;
  label: string;
  placeholder: string;
  options: SelectOption[];
  className?: string;
};

export default function CustomSelect({
  id,
  name,
  required = false,
  label,
  placeholder,
  options,
  className,
}: Readonly<CustomSelectProps>) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedValue = watch(name);
  const selectedOption = options.find(o => o.value.toString() === selectedValue?.toString());

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    setValue(name, option.value.toString(), { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, option: SelectOption) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(option);
    }
  };

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
          <Label htmlFor={id} id={`${id}-label`} required={required}>
            {label}
          </Label>
          <div className="relative">
            <div
              className={cn(
                "group flex items-center justify-between px-3 h-10 w-full rounded-md border border-background-300 bg-white cursor-pointer transition-all hover:border-background-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1",
                isOpen && "ring-2 ring-primary-500 ring-offset-1 border-transparent shadow-sm",
                errorMessage && "border-error-500 focus-within:ring-error-500",
              )}
            >
              <button
                type="button"
                id={id}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={`${id}-listbox`}
                aria-labelledby={`${id}-label`}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className="grow text-left h-full flex items-center bg-transparent focus:outline-none min-w-0 pr-2"
              >
                <span
                  className={cn(
                    "text-sm truncate w-full",
                    selectedOption ? "text-text-900 font-medium" : "text-text-400",
                  )}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {selectedOption && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label={`Clear selection for ${label}`}
                    className="p-0.5 rounded-full hover:bg-background-100 text-text-400 hover:text-text-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={e => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                  }}
                  className="focus:outline-none flex items-center"
                >
                  <ChevronDownIcon
                    className={cn("w-4 h-4 text-text-400 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="absolute z-100 mt-2 w-full bg-white rounded-xl shadow-2xl border border-background-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div
                  id={`${id}-listbox`}
                  role="listbox"
                  tabIndex={-1}
                  aria-labelledby={`${id}-label`}
                  className="max-h-60 overflow-y-auto p-1 flex flex-col gap-0.5 custom-scrollbar focus:outline-none"
                >
                  {options.map(option => (
                    <button
                      type="button"
                      key={option.value}
                      role="option"
                      aria-selected={selectedValue?.toString() === option.value.toString()}
                      onClick={() => handleSelect(option)}
                      onKeyDown={e => handleOptionKeyDown(e, option)}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between group focus:outline-none focus:bg-background-50",
                        selectedValue?.toString() === option.value.toString()
                          ? "bg-primary-50 text-primary-700 font-bold"
                          : "text-text-700 hover:bg-background-50",
                      )}
                    >
                      {option.label}
                      {selectedValue?.toString() === option.value.toString() && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}
