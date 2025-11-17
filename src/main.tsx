import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./app/styles/reset.scss";

import { appRouter } from "./app/router/routes.tsx";
import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./app/providers/QueryProvider";
import { StoreProvider } from "./app/providers/StoreProvider/StoreProvider.tsx";
import { App as AntdApp } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <QueryProvider>
        <AntdApp>
          <RouterProvider router={appRouter} />
        </AntdApp>
      </QueryProvider>
    </StoreProvider>
  </StrictMode>
);
