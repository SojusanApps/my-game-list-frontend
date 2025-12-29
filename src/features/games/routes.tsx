import { Route } from "react-router-dom";
import { HomePage, GameDetailPage, GameListPage, SearchEnginePage, CompanyDetailPage } from "./index";
import RequireAuth from "@/features/auth/components/RequireAuth";

export const GamesRoutes = (
  <>
    <Route element={<RequireAuth />}>
      <Route path="home" element={<HomePage />} />
    </Route>
    <Route path="game/:id" element={<GameDetailPage />} />
    <Route path="company/:id" element={<CompanyDetailPage />} />
    <Route path="game-list/:id" element={<GameListPage />} />
    <Route path="search" element={<SearchEnginePage />} />
  </>
);
