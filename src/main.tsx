import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Confirmation, PreConfirmation } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./routes";
import { Header } from "./components/Header";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: Routes.pre_confirmation,
    Component: PreConfirmation,
  },
  {
    path: Routes.confirmation,
    Component: Confirmation,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Header />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
