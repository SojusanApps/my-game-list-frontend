import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/theme";
import App, { router } from "./App";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";
import clientSetup from "./clientSetup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

clientSetup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1_000 * 60 * 5, // 5 minutes
      gcTime: 1_000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement) {
  throw new Error("Failed to find root element");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="bottom-right" autoClose={4000} />
      <QueryClientProvider client={queryClient}>
        <App />
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel router={router} />,
            },
          ]}
        />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
);
