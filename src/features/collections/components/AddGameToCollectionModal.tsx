import * as React from "react";
import { useGetGamesList } from "@/features/games/hooks/gameQueries";
import { GameSimpleList } from "@/client";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import SearchIcon from "@/components/ui/Icons/Search";
import XMarkIcon from "@/components/ui/Icons/XMark";
import { useDebounce } from "@/utils/hooks";
import { SafeImage } from "@/components/ui/SafeImage";
import { useAddCollectionItem } from "../hooks/useCollectionQueries";
import toast from "react-hot-toast";

interface AddGameToCollectionModalProps {
  onClose: () => void;
  collectionId: number;
}

export default function AddGameToCollectionModal({
  onClose,
  collectionId,
}: Readonly<AddGameToCollectionModalProps>): React.JSX.Element {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [search, setSearch] = React.useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: gamesDetails, isLoading: isSearchLoading } = useGetGamesList(
    { title: debouncedSearch },
    { enabled: debouncedSearch.length > 1 },
  );

  const { mutate: addItem, isPending: isAdding } = useAddCollectionItem();

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleAddGame = (game: GameSimpleList) => {
    addItem(
      {
        collection: collectionId,
        game: game.id,
        order: 0, // Backend handles order usually, but type requires it? Check type.
      },
      {
        onSuccess: () => {
          toast.success(`Added ${game.title} to collection`);
          // Kept open for multiple adds as per user request
        },
        onError: error => {
          toast.error(error.message || "Failed to add game");
        },
      },
    );
  };

  const renderContent = () => {
    if (isSearchLoading) {
      return <div className="py-12 text-center text-text-400 animate-pulse font-medium">Searching our library...</div>;
    }

    if (search.length > 1 && gamesDetails?.results) {
      if (gamesDetails.results.length === 0) {
        return (
          <div className="py-12 text-center text-text-400 font-medium">
            No games found matching &quot;{search}&quot;
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          {gamesDetails.results.map(game => (
            <button
              key={game.id}
              onClick={() => handleAddGame(game)}
              disabled={isAdding}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary-50 active:scale-[0.98] transition-all duration-200 group text-left w-full border border-transparent hover:border-primary-100"
            >
              <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-sm shrink-0 bg-background-200">
                <SafeImage
                  src={
                    game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.THUMB_90_90) : undefined
                  }
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-text-900 group-hover:text-primary-700 transition-colors">
                  {game.title}
                </span>
                {game.release_date && (
                  <span className="text-xs text-text-500 font-medium tracking-wide">
                    {new Date(game.release_date).getFullYear()}
                  </span>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 font-bold text-sm bg-primary-100 px-3 py-1 rounded-full">
                Add
              </div>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-400 gap-4">
        <SearchIcon className="w-12 h-12 opacity-20" />
        <p className="font-medium">Type to search for games</p>
      </div>
    );
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
            Add <span className="text-primary-600">Game</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-200 rounded-full transition-colors text-text-400 hover:text-text-900"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input Area */}
        <div className="p-8 pb-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search for a game to add..."
              className="w-full bg-background-50 border border-background-200 text-text-900 placeholder:text-text-400 rounded-xl py-4 pl-12 pr-4 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-lg"
              autoComplete="off"
              onChange={handleInputChange}
              value={search}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <SearchIcon className="w-6 h-6 text-text-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">{renderContent()}</div>
      </div>
    </dialog>
  );
}
