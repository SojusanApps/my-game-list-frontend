import React from "react";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import Layout from "@/components/layout/Layout";
import { PageMeta } from "@/components/ui/PageMeta";
import { AuthContextType } from "@/features/auth/context/AuthProvider";
import { QueryClient } from "@tanstack/react-query";
import { NotFound } from "@/features/misc";

export interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <HelmetProvider>
      <PageMeta />
      <Layout />
      <TanStackRouterDevtools />
    </HelmetProvider>
  ),
  notFoundComponent: NotFound,
});
