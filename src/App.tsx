import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import TopBar from "./components/TopBar/TopBar";
import LoginPage from "./pages/Login/LoginPage";
import HomePage from "./pages/Home/HomePage";
import RegisterPage from "./pages/Register/RegisterPage";
import StartPage from "./pages/Start/StartPage";
import GameDetailPage from "./pages/GameDetail/GameDetailPage";
import GameListPage from "./pages/GameList/GameListPage";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import UserSettingsPage from "./pages/UserSettings/UserSettingsPage";
import NotFound from "./pages/NotFound/NotFound";
import SearchEnginePage from "./pages/SearchEngine/SearchEnginePage";
import RequireAuth from "./helpers/RequireAuth";

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route index element={<StartPage />} />
        <Route element={<RequireAuth />}>
          <Route path="home" element={<HomePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="game/:id" element={<GameDetailPage />} />
        <Route path="game-list/:id" element={<GameListPage />} />
        <Route path="profile/:id" element={<UserProfilePage />} />
        <Route path="settings" element={<UserSettingsPage />} />
        <Route path="search" element={<SearchEnginePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
