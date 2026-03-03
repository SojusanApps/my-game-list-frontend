import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { TokenInfoType } from "@/types";

export const useCurrentUserId = () => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return null;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      return Number(decoded.user_id);
    } catch {
      return null;
    }
  }, [user]);
};

export const useIsOwner = (ownerId?: number | string | null) => {
  const currentUserId = useCurrentUserId();

  return useMemo(() => {
    if (currentUserId === null || (!ownerId && ownerId !== 0)) return false;
    return currentUserId === Number(ownerId);
  }, [currentUserId, ownerId]);
};
