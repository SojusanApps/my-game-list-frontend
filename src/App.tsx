import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import "./index.css";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./features/auth/context/AuthProvider";

// Feature Routes
import { AuthRoutes } from "./features/auth/routes";
import { GamesRoutes } from "./features/games/routes";
import { UserRoutes } from "./features/users/routes";
import { NotificationRoutes } from "./features/notifications/routes";
import { MiscRoutes } from "./features/misc/routes";

function App(): React.JSX.Element {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {AuthRoutes}
              {GamesRoutes}
              {UserRoutes}
              {NotificationRoutes}
              {MiscRoutes}
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" reverseOrder={false} />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;