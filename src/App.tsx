import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import Layout from "./components/Layout/Layout";
import LoginPage from "./features/auth/pages/LoginPage";
import HomePage from "./pages/Home/HomePage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import StartPage from "./pages/Start/StartPage";
import GameDetailPage from "./features/games/pages/GameDetailPage";
import GameListPage from "./features/games/pages/GameListPage";
import UserProfilePage from "./features/users/pages/UserProfilePage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import UserSettingsPage from "./features/users/pages/UserSettingsPage";
import NotFound from "./pages/NotFound/NotFound";
import SearchEnginePage from "./pages/SearchEngine/SearchEnginePage";
import RequireAuth from "./features/auth/components/RequireAuth";
import { AuthProvider } from "./features/auth/context/AuthProvider";

import { Toaster } from "react-hot-toast";

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
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
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;
