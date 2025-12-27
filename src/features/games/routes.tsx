import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameDetailPage from "./pages/GameDetailPage";
import GameListPage from "./pages/GameListPage";
import SearchEnginePage from "./pages/SearchEnginePage";
import RequireAuth from "@/features/auth/components/RequireAuth";

export const GamesRoutes = (
  <>
    <Route element={<RequireAuth />}>
      <Route path="home" element={<HomePage />} />
    </Route>
    <Route path="game/:id" element={<GameDetailPage />} />
    <Route path="game-list/:id" element={<GameListPage />} />
    <Route path="search" element={<SearchEnginePage />} />
  </>
);
