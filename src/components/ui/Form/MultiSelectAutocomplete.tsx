import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";
import XMarkIcon from "@/components/ui/Icons/XMark";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";

type SelectOption = {
  value: string | number;
  label: string;
};

type MultiSelectAutocompleteProps = {
  id: string;
  name: string;
  required?: boolean;
  label: string;
  placeholder: string;
  options: SelectOption[];
  className?: string;
  horizontalScroll?: boolean;
};

export default function MultiSelectAutocomplete({
  id,
  name,
  required = false,
  label,
  placeholder,
  options,
  className,
  horizontalScroll = false,
}: Readonly<MultiSelectAutocompleteProps>) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedValues = watch(name) || [];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string | number) => {
    const stringValue = value.toString();
    const newValues = selectedValues.includes(stringValue)
      ? selectedValues.filter((v: string) => v !== stringValue)
      : [...selectedValues, stringValue];
    setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
  };

  const removeOption = (e: React.MouseEvent, value: string | number) => {
    e.stopPropagation();
    toggleOption(value);
  };

  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault(); // Prevent accidental form submission
      toggleOption(filteredOptions[0].value);
      setSearchTerm("");
    }
  };

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
          <div className="relative">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex items-center gap-2 px-3 min-h-10 w-full rounded-md border border-background-300 bg-white cursor-text transition-all focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1",
                isOpen && "ring-2 ring-primary-500 ring-offset-1 border-transparent",
                errorMessage && "border-error-500 focus-within:ring-error-500",
                horizontalScroll ? "h-10" : "flex-wrap py-2",
              )}
            >
              <div
                className={cn(
                  "flex gap-2 items-center flex-1 min-w-0 h-full",
                  horizontalScroll ? "overflow-x-auto no-scrollbar" : "flex-wrap",
                )}
              >
                {selectedValues.map((val: string) => {
                  const option = options.find(o => o.value.toString() === val);
                  return (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-[10px] font-bold animate-in fade-in zoom-in duration-200 whitespace-nowrap shrink-0"
                    >
                      {option?.label || val}
                      <button
                        type="button"
                        onClick={e => removeOption(e, val)}
                        className="hover:text-primary-900 transition-colors"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <input
                  type="text"
                  placeholder={selectedValues.length === 0 ? placeholder : ""}
                  className="flex-1 bg-transparent border-none outline-hidden text-sm min-w-30 placeholder:text-text-400 h-full"
                  value={searchTerm}
                  onKeyDown={handleKeyDown}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                />
              </div>
              <ChevronDownIcon
                className={cn("w-4 h-4 text-text-400 transition-transform shrink-0 ml-1", isOpen && "rotate-180")}
              />
            </div>

            {isOpen && (
              <div className="absolute z-100 mt-2 w-full bg-white rounded-xl shadow-2xl border border-background-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <ul className="max-h-60 overflow-y-auto p-1 flex flex-col gap-0.5">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                      <li
                        key={option.value}
                        onClick={() => toggleOption(option.value)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between group",
                          selectedValues.includes(option.value.toString())
                            ? "bg-primary-50 text-primary-700 font-bold"
                            : "text-text-700 hover:bg-background-50",
                        )}
                      >
                        {option.label}
                        {selectedValues.includes(option.value.toString()) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-primary" />
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-4 text-center text-text-400 text-xs italic">No options found</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}
