import * as React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import XMarkIcon from "@/components/ui/Icons/XMark";

const validationSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface EditDescriptionModalProps {
  gameTitle: string;
  currentDescription?: string;
  onClose: () => void;
  onSave: (description: string) => Promise<void>;
}

export default function EditDescriptionModal({
  gameTitle,
  currentDescription,
  onClose,
  onSave,
}: Readonly<EditDescriptionModalProps>) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      description: currentDescription ?? "",
    },
  });

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

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

  const onSubmit: SubmitHandler<ValidationSchema> = async data => {
    setIsSaving(true);
    try {
      await onSave(data.description ?? "");
      toast.success("Description updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update description");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 rounded-2xl shadow-2xl p-0 max-w-2xl w-full border border-background-200"
    >
      <div className="bg-white rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-background-200">
          <div>
            <h2 className="text-xl font-black text-text-900">Edit Note</h2>
            <p className="text-sm text-text-500 mt-1">{gameTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-background-100 transition-colors text-text-500 hover:text-text-700"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-text-700 mb-2">
                  Why is this game in this position?
                </label>
                <textarea
                  id="description"
                  {...methods.register("description")}
                  placeholder="Add your thoughts about this game's ranking..."
                  rows={8}
                  className="w-full bg-background-50 rounded-xl border border-background-200 p-4 text-sm text-text-700 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 transition-all resize-none custom-scrollbar"
                />
                {methods.formState.errors.description && (
                  <p className="mt-2 text-sm text-error-500">{methods.formState.errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-background-200">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving} className="px-6">
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={isSaving} className="px-6">
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2" /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </dialog>
  );
}
