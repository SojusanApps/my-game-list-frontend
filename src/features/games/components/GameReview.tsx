import * as React from "react";
import { GameReview as GameReviewType } from "@/client";
import { SafeImage } from "@/components/ui/SafeImage";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/cn";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";

type GameReviewProps = {
  className?: string;
  gameReview: GameReviewType;
};

function GameReview({ className, gameReview }: Readonly<GameReviewProps>): React.JSX.Element {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [shouldTruncate, setShouldTruncate] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const CreatedAt = new Date(gameReview.created_at);

  const getScoreStyles = (score: number) => {
    if (score >= 8) return "bg-success-100 text-success-900 border-success-200";
    if (score >= 5) return "bg-secondary-100 text-secondary-900 border-secondary-200";
    return "bg-error-100 text-error-900 border-error-200";
  };

  const getScoreLabelStyles = (score: number) => {
    if (score >= 8) return "text-success-700";
    if (score >= 5) return "text-secondary-700";
    return "text-error-700";
  };

  React.useLayoutEffect(() => {
    if (contentRef.current) {
      // 160px is approx 6-7 lines
      if (contentRef.current.scrollHeight > 160) {
        setShouldTruncate(true);
      }
    }
  }, [gameReview.review]);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 p-6 rounded-2xl border border-background-300/50 bg-background-200/50 transition-all hover:bg-background-200 group shadow-xs",
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
            <SafeImage
              className="w-full h-full object-cover"
              src={gameReview?.user.gravatar_url || undefined}
              alt={gameReview?.user.username}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-bold text-text-900 truncate">{gameReview?.user.username}</p>
            <p className="text-xs text-text-500 font-medium italic">{CreatedAt.toLocaleDateString()}</p>
          </div>
        </div>

        {gameReview?.score && (
          <div
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 rounded-xl border shadow-xs transition-colors duration-300",
              getScoreStyles(gameReview.score),
            )}
          >
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5",
                getScoreLabelStyles(gameReview.score),
              )}
            >
              Score
            </span>
            <span className="text-xl font-black leading-none">{gameReview.score}</span>
          </div>
        )}
      </div>

      <div className="relative w-full">
        <div
          ref={contentRef}
          className={cn(
            "prose prose-slate prose-sm max-w-3xl mx-auto text-text-700 leading-relaxed bg-white/60 p-6 rounded-2xl border border-background-100 shadow-sm transition-all duration-500 ease-in-out overflow-hidden",
            shouldTruncate && !isExpanded ? "max-h-40" : "max-h-1250",
          )}
        >
          <ReactMarkdown>{gameReview?.review || ""}</ReactMarkdown>

          {shouldTruncate && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white/90 to-transparent pointer-events-none" />
          )}
        </div>

        {shouldTruncate && (
          <div className={cn("flex justify-center relative z-10", isExpanded ? "mt-6" : "-mt-3")}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-background-200 rounded-full text-xs font-bold text-primary-600 shadow-lg hover:bg-primary-50 hover:text-primary-700 transition-all active:scale-95 hover:-translate-y-0.5"
            >
              <span>{isExpanded ? "Show Less" : "Read Full Review"}</span>
              <ChevronDownIcon
                className={cn("w-3 h-3 transition-transform duration-300", isExpanded && "rotate-180")}
              />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default GameReview;
