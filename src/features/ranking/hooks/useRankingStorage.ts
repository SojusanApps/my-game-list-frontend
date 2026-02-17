import { useCallback, useMemo } from "react";
import type { RankingProfile, RankingStorageAdapter } from "../types";

const STORAGE_KEY_PREFIX = "pairwise-ranking-";

/** localStorage-backed implementation of RankingStorageAdapter. */
class LocalStorageAdapter implements RankingStorageAdapter {
  private key(collectionId: number): string {
    return `${STORAGE_KEY_PREFIX}${collectionId}`;
  }

  load(collectionId: number): RankingProfile | null {
    try {
      const raw = localStorage.getItem(this.key(collectionId));
      if (!raw) return null;
      return JSON.parse(raw) as RankingProfile;
    } catch {
      return null;
    }
  }

  save(collectionId: number, profile: RankingProfile): void {
    try {
      localStorage.setItem(this.key(collectionId), JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save ranking profile:", error);
    }
  }

  remove(collectionId: number): void {
    try {
      localStorage.removeItem(this.key(collectionId));
    } catch {
      // Ignore removal errors
    }
  }
}

const adapter = new LocalStorageAdapter();

/**
 * Hook providing read/write access to a pairwise ranking profile for a collection.
 * Uses localStorage under the hood via an adapter that can be swapped later.
 */
export function useRankingStorage(collectionId: number) {
  const loadProfile = useCallback((): RankingProfile | null => {
    return adapter.load(collectionId);
  }, [collectionId]);

  const saveProfile = useCallback(
    (profile: RankingProfile): void => {
      adapter.save(collectionId, { ...profile, updatedAt: new Date().toISOString() });
    },
    [collectionId],
  );

  const deleteProfile = useCallback((): void => {
    adapter.remove(collectionId);
  }, [collectionId]);

  const hasExistingProfile = useMemo((): boolean => {
    return adapter.load(collectionId) !== null;
  }, [collectionId]);

  return { loadProfile, saveProfile, deleteProfile, hasExistingProfile };
}
