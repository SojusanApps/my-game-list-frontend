import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import XMarkIcon from "@/components/ui/Icons/XMark";
import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import { useCollectionsInfiniteQuery, useAddCollectionItem } from "../hooks/useCollectionQueries";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { TokenInfoType } from "@/types";
import { Collection } from "@/client";

const validationSchema = z.object({
  collections: z.array(z.string()).min(1, "Select at least one collection"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface AddToCollectionModalProps {
  onClose: () => void;
  gameId: number;
}

export default function AddToCollectionModal({ onClose, gameId }: Readonly<AddToCollectionModalProps>) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const { user } = useAuth();

  const currentUserId = React.useMemo(() => {
    if (!user) return undefined;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      return decoded.user_id;
    } catch {
      return undefined;
    }
  }, [user]);

  const { mutateAsync: addCollectionItem, isPending } = useAddCollectionItem();

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      collections: [],
    },
  });

  // Wrapper hook for AsyncMultiSelectAutocomplete
  const useMyCollectionsSearch = (searchTerm: string) => {
    // Assuming 'search' or 'name' filter exists. Passing 'name' as per verification.
    return useCollectionsInfiniteQuery(currentUserId, { name: searchTerm });
  };

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const onSubmit = async (data: ValidationSchema) => {
    try {
      await Promise.all(
        data.collections.map(collectionId =>
          addCollectionItem({
            collection: Number(collectionId),
            game: gameId,
            order: 0,
          }),
        ),
      );
      toast.success("Added to collections successfully");
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add to some collections";
      toast.error(errorMessage);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="bg-white rounded-3xl p-0 border-none shadow-2xl backdrop:bg-black/60 outline-none m-auto w-full max-w-lg overflow-visible animate-in fade-in zoom-in duration-300"
      onCancel={onClose}
    >
      <div className="flex flex-col h-full overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-background-100 bg-background-50/50 rounded-t-3xl">
          <h2 className="text-2xl font-black text-text-900 tracking-tight">
            Add to <span className="text-primary-600">Collection</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-200 rounded-full transition-colors text-text-400 hover:text-text-900"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 rounded-b-3xl">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <AsyncMultiSelectAutocomplete
                id="collections"
                name="collections"
                label="Select Collections"
                placeholder="Search your collections..."
                useInfiniteQueryHook={useMyCollectionsSearch}
                getOptionLabel={(collection: Collection) => collection.name}
                getOptionValue={(collection: Collection) => collection.id}
                required
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Adding..." : "Add to Selected Collections"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </dialog>
  );
}
