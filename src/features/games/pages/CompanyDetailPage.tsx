import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useGetCompanyDetail } from "../hooks/gameQueries";
import { Skeleton } from "@/components/ui/Skeleton";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import { cn } from "@/utils/cn";
import { SafeImage } from "@/components/ui/SafeImage";

function CollapsibleSection({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-white hover:bg-background-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text-900">{title}</h2>
          {count !== undefined && (
            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <ChevronDownIcon
          className={cn("w-5 h-5 text-text-400 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-6 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const companyId = parsedId.data;
  const { data: companyDetails, isLoading: isCompanyLoading } = useGetCompanyDetail(companyId);

  const developedGamesList = companyDetails?.games_developed || [];
  const publishedGamesList = companyDetails?.games_published || [];

  const developedCount = developedGamesList.length;
  const publishedCount = publishedGamesList.length;

  const pageTitle = isCompanyLoading ? "Loading Company..." : companyDetails?.name;

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
      <PageMeta title={pageTitle} />

      {isCompanyLoading ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="w-32 h-32 rounded-xl shrink-0" />
            <div className="flex flex-col gap-4 w-full">
              <Skeleton className="w-1/2 h-10 rounded-lg" />
              <Skeleton className="w-full h-24 rounded-xl" />
            </div>
          </div>
          <Skeleton className="w-full h-16 rounded-xl" />
          <Skeleton className="w-full h-16 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-background-200 overflow-hidden">
            <div className="h-32 bg-linear-to-r from-primary-700 to-primary-950" />
            <div className="px-8 pb-8 -mt-16">
              <div className="flex flex-col md:flex-row gap-8 items-end">
                <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white bg-white p-6 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                  <SafeImage
                    className="w-full h-full"
                    objectFit="contain"
                    src={
                      companyDetails?.company_logo_id
                        ? `${getIGDBImageURL(companyDetails.company_logo_id, IGDBImageSize.LOGO_MED_284_160)}`
                        : undefined
                    }
                    alt={companyDetails?.name}
                  />
                </div>

                <div className="flex flex-col gap-3 pb-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                      Company
                    </span>
                    <span className="text-text-400 text-[10px] font-bold uppercase tracking-widest">
                      ID: {companyDetails?.id}
                    </span>
                  </div>
                  <h1 className="text-5xl font-black text-text-900 tracking-tight leading-none">
                    {companyDetails?.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <CollapsibleSection title="Games Developed" count={developedCount} defaultOpen={false}>
            {developedGamesList.length > 0 ? (
              <VirtualGridList
                items={developedGamesList}
                hasNextPage={false}
                isFetchingNextPage={false}
                fetchNextPage={() => {}}
                className="h-150"
                renderItem={game => (
                  <ItemOverlay
                    itemPageUrl={`/game/${game.id}`}
                    itemCoverUrl={
                      game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
                    }
                    name={game.title}
                  />
                )}
              />
            ) : (
              <p className="text-text-500 italic">No games developed found.</p>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Games Published" count={publishedCount} defaultOpen={false}>
            {publishedGamesList.length > 0 ? (
              <VirtualGridList
                items={publishedGamesList}
                hasNextPage={false}
                isFetchingNextPage={false}
                fetchNextPage={() => {}}
                className="h-150"
                renderItem={game => (
                  <ItemOverlay
                    itemPageUrl={`/game/${game.id}`}
                    itemCoverUrl={
                      game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
                    }
                    name={game.title}
                  />
                )}
              />
            ) : (
              <p className="text-text-500 italic">No games published found.</p>
            )}
          </CollapsibleSection>
        </>
      )}
    </div>
  );
}
