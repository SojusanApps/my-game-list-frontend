import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import XMarkIcon from "@/components/ui/Icons/XMark";

interface ScreenshotModalProps {
  screenshot: string;
  onClose: () => void;
}

export default function ScreenshotModal({ screenshot, onClose }: Readonly<ScreenshotModalProps>) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

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

  return (
    <dialog
      ref={dialogRef}
      className="bg-transparent p-0 border-none shadow-none backdrop:bg-black/90 outline-none m-auto"
      onCancel={onClose}
      aria-label="Screenshot view"
    >
      <div className="relative flex items-center justify-center p-4 outline-none">
        <button
          onClick={onClose}
          className="fixed top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-white"
          aria-label="Close screenshot"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
        <SafeImage
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          src={getIGDBImageURL(screenshot, IGDBImageSize.SCREENSHOT_HUGE_1280_720)}
          alt="Enlarged screenshot"
        />
      </div>
    </dialog>
  );
}
