import { Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import NotFound from "./pages/NotFound";

export const MiscRoutes = (
  <>
    <Route index element={<StartPage />} />
    <Route path="*" element={<NotFound />} />
  </>
);
