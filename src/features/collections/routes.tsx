import { Route } from "react-router-dom";
import CollectionsPage from "./pages/CollectionsPage";

export const CollectionsRoutes = (
  <>
    <Route path="profile/:id/collections" element={<CollectionsPage />} />
  </>
);
