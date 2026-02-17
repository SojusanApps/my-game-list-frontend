import * as React from "react";
import { useForm, FormProvider, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import XMarkIcon from "@/components/ui/Icons/XMark";
import { cn } from "@/utils/cn";

const validationSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface EditDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDescription?: string;
  gameName: string;
  onSave: (description: string) => void;
}

export const EditDescriptionModal = ({
  isOpen,
  onClose,
  initialDescription = "",
  gameName,
  onSave,
}: Readonly<EditDescriptionModalProps>) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      description: initialDescription,
    },
  });

  const { register, formState } = methods;
  const { errors } = formState;
  const descriptionValue = useWatch({
    control: methods.control,
    name: "description",
    defaultValue: "",
  });

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, [onClose]);

  const onSubmit: SubmitHandler<ValidationSchema> = data => {
    onSave(data.description);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-3xl shadow-2xl backdrop:bg-black/60 p-0 w-full max-w-xl animate-in fade-in zoom-in duration-200"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-background-200">
            <h2 className="text-xl font-bold text-text-900">Edit Description</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-background-100 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-text-700 mb-2">Game: {gameName}</p>
              <p className="text-xs text-text-500 mb-4">Why is this game in this tier?</p>
            </div>

            <div>
              <textarea
                {...register("description")}
                placeholder="Explain your tier placement..."
                rows={6}
                className={cn(
                  "w-full bg-background-50 rounded-xl border border-background-300 p-4 text-sm text-text-700 placeholder:text-text-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none custom-scrollbar",
                  errors.description && "border-error-500 focus:ring-error-500",
                )}
              />
              {errors.description && <p className="text-xs text-error-500 mt-1">{errors.description.message}</p>}
            </div>

            <div className="text-right text-xs text-text-500">{descriptionValue.length} / 500 characters</div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-background-200 bg-background-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Description</Button>
          </div>
        </form>
      </FormProvider>
    </dialog>
  );
};
