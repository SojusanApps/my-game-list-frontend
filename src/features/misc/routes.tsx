import { Route } from "react-router-dom";
import { StartPage, NotFound } from "./index";

export const MiscRoutes = (
  <>
    <Route index element={<StartPage />} />
    <Route path="*" element={<NotFound />} />
  </>
);
