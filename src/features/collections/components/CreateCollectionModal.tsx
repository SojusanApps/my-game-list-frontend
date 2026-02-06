import * as React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { VisibilityEnum, ModeEnum, Friendship, CollectionDetail } from "@/client";
import { useCreateCollection, useFriendSearch, useUpdateCollection } from "../hooks/useCollectionQueries";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import TextFieldInput from "@/components/ui/Form/TextFieldInput";
import SelectInput from "@/components/ui/Form/SelectInput";
import CheckboxInput from "@/components/ui/Form/CheckboxInput";
import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import XMarkIcon from "@/components/ui/Icons/XMark";

const validationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  is_favorite: z.boolean(),
  visibility: z.enum(VisibilityEnum),
  mode: z.enum(ModeEnum),
  collaborators: z.array(z.string()),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface CreateCollectionModalProps {
  onClose: () => void;
  initialData?: CollectionDetail;
  mode?: "create" | "edit";
}

export default function CreateCollectionModal({
  onClose,
  initialData,
  mode = "create",
}: Readonly<CreateCollectionModalProps>) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const { mutate: createCollection, isPending: isCreatePending } = useCreateCollection();
  const { mutate: updateCollection, isPending: isUpdatePending } = useUpdateCollection();

  const isPending = isCreatePending || isUpdatePending;

  const [selectedCollaboratorObjects, setSelectedCollaboratorObjects] = React.useState<Friendship[]>([]);

  // When editing, populate selectedCollaboratorObjects based on initialData.collaborators
  React.useEffect(() => {
    if (mode === "edit" && initialData?.collaborators) {
      // Map Users to Friendship-like interface that AsyncMultiSelectAutocomplete expects
      const initialCollaborators = initialData.collaborators.map(user => ({
        friend: user,
        user: user, // Using the same user for both fields as a placeholder
        id: -1,
        created_at: "",
      }));
      setSelectedCollaboratorObjects(initialCollaborators as Friendship[]);
    }
  }, [mode, initialData]);

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      is_favorite: initialData?.is_favorite ?? false,
      visibility: initialData?.visibility ?? VisibilityEnum.PUB,
      mode: initialData?.mode ?? ModeEnum.S,
      collaborators: initialData?.collaborators?.map(u => u.id.toString()) ?? [],
    },
  });

  const { watch, setValue } = methods;
  const selectedMode = watch("mode");

  React.useEffect(() => {
    if (selectedMode === ModeEnum.S) {
      setValue("collaborators", []);
      setSelectedCollaboratorObjects([]);
    }
  }, [selectedMode, setValue]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

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

  const handleAddCollaborator = (friendship: Friendship) => {
    setSelectedCollaboratorObjects(prev => [...prev, friendship]);
  };

  const handleRemoveCollaborator = (friendship: Friendship) => {
    setSelectedCollaboratorObjects(prev => prev.filter(f => f.friend.id !== friendship.friend.id));
  };

  const removeCollaborator = (friendId: number) => {
    const currentCollaborators = watch("collaborators");
    setValue(
      "collaborators",
      currentCollaborators.filter(id => id !== friendId.toString()),
    );
    setSelectedCollaboratorObjects(prev => prev.filter(f => f.friend.id !== friendId));
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const onSubmit: SubmitHandler<any> = data => {
    const payload = {
      ...data,
      collaborators: data.collaborators.map(Number),
    };

    if (mode === "edit" && initialData) {
      updateCollection(
        { id: initialData.id, body: payload },
        {
          onSuccess: () => {
            toast.success("Collection updated successfully");
            onClose();
          },
          onError: error => {
            toast.error(error.message || "Failed to update collection");
          },
        },
      );
    } else {
      createCollection(payload, {
        onSuccess: () => {
          toast.success("Collection created successfully");
          onClose();
        },
        onError: error => {
          toast.error(error.message || "Failed to create collection");
        },
      });
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="bg-white rounded-3xl p-0 border-none shadow-2xl backdrop:bg-black/60 outline-none m-auto w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300"
      onCancel={onClose}
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-background-100 bg-background-50/50">
          <h2 className="text-2xl font-black text-text-900 tracking-tight">
            {mode === "create" ? "Create" : "Edit"} <span className="text-primary-600">Collection</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-200 rounded-full transition-colors text-text-400 hover:text-text-900"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <FormProvider {...methods}>
            <form id="create-collection-form" onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <TextFieldInput
                id="name-input"
                label="Collection Name"
                name="name"
                type="text"
                placeholder="My Awesome Collection"
                required
              />

              <TextFieldInput
                id="description-input"
                label="Description"
                name="description"
                type="text"
                placeholder="What is this collection about?"
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectInput
                  id="visibility-select"
                  label="Visibility"
                  name="visibility"
                  placeholder="Select visibility"
                  selectOptions={[
                    { value: VisibilityEnum.PUB, label: "Public" },
                    { value: VisibilityEnum.FRI, label: "Friends Only" },
                    { value: VisibilityEnum.PRI, label: "Private" },
                  ]}
                />
                <SelectInput
                  id="mode-select"
                  label="Mode"
                  name="mode"
                  placeholder="Select mode"
                  selectOptions={[
                    { value: ModeEnum.S, label: "Solo" },
                    { value: ModeEnum.C, label: "Collaborative" },
                  ]}
                />
              </div>

              {selectedMode === ModeEnum.C && (
                <div className="flex flex-col gap-4">
                  <AsyncMultiSelectAutocomplete<Friendship>
                    id="collaborators"
                    name="collaborators"
                    label="Collaborators"
                    placeholder="Search friends..."
                    useInfiniteQueryHook={useFriendSearch}
                    getOptionLabel={item => item.friend.username}
                    getOptionValue={item => item.friend.id}
                    hideTags
                    onAdd={handleAddCollaborator}
                    onRemove={handleRemoveCollaborator}
                    renderOption={item => (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                          <SafeImage src={item.friend.gravatar_url} alt={item.friend.username} />
                        </div>
                        <span className="font-medium">{item.friend.username}</span>
                      </div>
                    )}
                  />

                  {/* Selected Collaborators Special Area */}
                  {selectedCollaboratorObjects.length > 0 && (
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-background-50 border border-background-100 animate-in fade-in slide-in-from-top-2">
                      <p className="text-[10px] font-bold text-text-400 uppercase tracking-widest px-1">
                        Selected Collaborators
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollaboratorObjects.map(f => (
                          <div
                            key={f.friend.id}
                            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 bg-white rounded-full border border-background-200 shadow-xs group animate-in zoom-in-95 duration-200"
                          >
                            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-background-100">
                              <SafeImage src={f.friend.gravatar_url} alt={f.friend.username} />
                            </div>
                            <span className="text-xs font-bold text-text-700">{f.friend.username}</span>
                            <button
                              type="button"
                              onClick={() => removeCollaborator(f.friend.id)}
                              className="p-0.5 hover:bg-error-50 hover:text-error-600 rounded-full transition-colors text-text-400"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <CheckboxInput id="is_favorite_checkbox" label="Mark as Favorite" name="is_favorite" />
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-background-100 bg-background-50/50 flex flex-row gap-3">
          <Button type="button" variant="outline" fullWidth onClick={onClose} className="font-bold py-3">
            Cancel
          </Button>
          <Button
            form="create-collection-form"
            type="submit"
            fullWidth
            isLoading={isPending}
            className="font-black py-3 shadow-lg shadow-primary-200"
          >
            {mode === "create" ? "Create" : "Save Changes"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
