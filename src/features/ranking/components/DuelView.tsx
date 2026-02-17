import * as React from "react";
import { Button } from "@/components/ui/Button";
import { DuelGameCard } from "./DuelGameCard";
import type { CurrentDuel, DuelChoice } from "../types";

interface DuelViewProps {
  duel: CurrentDuel;
  onChoice: (choice: DuelChoice) => void;
  onSkip: () => void;
}

export const DuelView = React.memo(function DuelView({ duel, onChoice, onSkip }: Readonly<DuelViewProps>) {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "1":
          e.preventDefault();
          onChoice("A");
          break;
        case "ArrowRight":
        case "2":
          e.preventDefault();
          onChoice("B");
          break;
        case "Enter":
        case "3":
          e.preventDefault();
          onChoice("tie");
          break;
        case "s":
          e.preventDefault();
          onSkip();
          break;
      }
    };

    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [onChoice, onSkip]);

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-300">
      {/* Cards */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full justify-center">
        <DuelGameCard item={duel.itemA} side="left" onClick={() => onChoice("A")} />

        {/* VS divider */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background-50 border-2 border-background-200 shadow-inner">
            <span className="text-xl font-black text-text-400 tracking-tighter">VS</span>
          </div>
        </div>

        <DuelGameCard item={duel.itemB} side="right" onClick={() => onChoice("B")} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => onChoice("A")} className="font-bold uppercase tracking-wider px-8">
            <span>Choose Left</span>{" "}
            <kbd className="ml-2 text-[10px] opacity-60 bg-white/20 px-1.5 py-0.5 rounded">←</kbd>
          </Button>
          <Button onClick={() => onChoice("tie")} variant="outline" className="font-bold uppercase tracking-wider px-6">
            <span>Tie</span>{" "}
            <kbd className="ml-2 text-[10px] opacity-60 bg-background-100 px-1.5 py-0.5 rounded">Enter</kbd>
          </Button>
          <Button onClick={() => onChoice("B")} className="font-bold uppercase tracking-wider px-8">
            <span>Choose Right</span>{" "}
            <kbd className="ml-2 text-[10px] opacity-60 bg-white/20 px-1.5 py-0.5 rounded">→</kbd>
          </Button>
        </div>

        <Button onClick={onSkip} variant="ghost" size="sm" className="text-text-400">
          <span>Skip this pair</span>{" "}
          <kbd className="ml-1 text-[10px] opacity-60 bg-background-100 px-1.5 py-0.5 rounded">S</kbd>
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-text-400 text-center">
        Use keyboard: <strong>← / 1</strong> left &middot; <strong>→ / 2</strong> right &middot;{" "}
        <strong>Enter / 3</strong> tie &middot; <strong>S</strong> skip
      </p>
    </div>
  );
});

DuelView.displayName = "DuelView";
