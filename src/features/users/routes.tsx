import { Route } from "react-router-dom";
import UserProfilePage from "./pages/UserProfilePage";
import UserSettingsPage from "./pages/UserSettingsPage";

export const UserRoutes = (
  <>
    <Route path="profile/:id" element={<UserProfilePage />} />
    <Route path="settings" element={<UserSettingsPage />} />
  </>
);
