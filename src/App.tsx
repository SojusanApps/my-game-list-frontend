import React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { useQueryClient } from "@tanstack/react-query";

import "./index.css";
import { AuthProvider, useAuth } from "./features/auth";
import { PageMeta } from "./components/ui/PageMeta";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
    auth: undefined!,
  },
  defaultPreload: "intent",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

function App(): React.JSX.Element {
  return (
    <HelmetProvider>
      <PageMeta />
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
