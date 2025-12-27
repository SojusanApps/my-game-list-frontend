import { Route } from "react-router-dom";
import { UserProfilePage, UserSettingsPage } from "./index";

export const UserRoutes = (
  <>
    <Route path="profile/:id" element={<UserProfilePage />} />
    <Route path="settings" element={<UserSettingsPage />} />
  </>
);
