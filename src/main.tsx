import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import clientSetup from "./clientSetup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

clientSetup();

const queryClient = new QueryClient();
const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement) {
  throw new Error("Failed to find root element");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
