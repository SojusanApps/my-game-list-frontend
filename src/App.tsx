import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { Toaster } from "react-hot-toast";

import "./index.css";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./features/auth";
import { PageMeta } from "./components/ui/PageMeta";

// Feature Routes
import { AuthRoutes } from "./features/auth/routes";
import { GamesRoutes } from "./features/games/routes";
import { UserRoutes } from "./features/users/routes";
import { NotificationRoutes } from "./features/notifications/routes";
import { CollectionsRoutes } from "./features/collections/routes";
import { MiscRoutes } from "./features/misc/routes";

function App(): React.JSX.Element {
  return (
    <HelmetProvider>
      <PageMeta />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {AuthRoutes}
              {GamesRoutes}
              {UserRoutes}
              {NotificationRoutes}
              {CollectionsRoutes}
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
