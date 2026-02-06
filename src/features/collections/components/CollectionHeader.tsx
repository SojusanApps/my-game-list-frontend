import * as React from "react";
import { Link } from "react-router-dom";
import { CollectionDetail, ModeEnum } from "@/client";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { TokenInfoType } from "@/types";

interface CollectionHeaderProps {
  collection: CollectionDetail;
  onEdit?: () => void;
  onAddGame?: () => void;
}

export const CollectionHeader = ({ collection, onEdit, onAddGame }: CollectionHeaderProps) => {
  const { user } = useAuth();

  const isOwner = React.useMemo(() => {
    if (!user) return false;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      return Number(decoded.user_id) === Number(collection.user.id);
    } catch {
      return false;
    }
  }, [user, collection.user.id]);

  const canEdit = React.useMemo(() => {
    if (isOwner) return true;
    if (!user) return false;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      const userId = Number(decoded.user_id);
      return collection.mode === ModeEnum.C && collection.collaborators.some(c => Number(c.id) === userId);
    } catch {
      return false;
    }
  }, [isOwner, user, collection.mode, collection.collaborators]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm font-bold text-text-500 uppercase tracking-widest">
            <Link
              to={`/profile/${collection.user.id}/collections`}
              className="hover:text-primary-600 transition-colors"
            >
              {collection.user.username}&apos;s Collections
            </Link>
            <span>•</span>
            <span>{new Date(collection.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-primary-500/80">{collection.visibility_display}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-text-900 tracking-tight">{collection.name}</h1>
          {collection.description && (
            <p className="text-text-600 max-w-2xl text-lg leading-relaxed">{collection.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <Button
              onClick={onAddGame}
              className="font-bold uppercase tracking-wider px-6 shadow-lg shadow-primary-200"
            >
              Add Game
            </Button>
          )}
          {isOwner && (
            <Button onClick={onEdit} variant="outline" className="font-bold uppercase tracking-wider px-6">
              Edit Collection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
