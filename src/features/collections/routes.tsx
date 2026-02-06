import { Route } from "react-router-dom";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionPage from "./pages/CollectionPage";

export const CollectionsRoutes = (
  <>
    <Route path="profile/:id/collections" element={<CollectionsPage />} />
    <Route path="collection/:id" element={<CollectionPage />} />
  </>
);
