import { Route } from "react-router-dom";
import NotificationsPage from "./pages/NotificationsPage";
import RequireAuth from "@/features/auth/components/RequireAuth";

export const NotificationRoutes = (
  <>
    <Route element={<RequireAuth />}>
      <Route path="notifications" element={<NotificationsPage />} />
    </Route>
  </>
);
