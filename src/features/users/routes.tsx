import { Route } from "react-router-dom";
import { UserProfilePage, UserSettingsPage, UserFriendsPage } from "./index";

export const UserRoutes = (
  <>
    <Route path="profile/:id" element={<UserProfilePage />} />
    <Route path="profile/:id/friends" element={<UserFriendsPage />} />
    <Route path="settings" element={<UserSettingsPage />} />
  </>
);
