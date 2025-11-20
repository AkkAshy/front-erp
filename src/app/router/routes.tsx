import { createBrowserRouter } from "react-router-dom";
import { Attributes, Barcode, Payment, SettingsLayout, Sizes } from "@/pages/Settings";
import Login from "@/pages/Auth";
import Home from "@/pages/Home/ui";
import History from "@/pages/History/ui";
import Customers from "@/pages/Customers/ui";
import Inventory from "@/pages/Inventory/ui";
import Statistics from "@/pages/Statistics/ui";
import CashierStats from "@/pages/Statistics/ui/CashierStats";
import Category from "@/pages/Settings/ui/Category";
import MainSettings from "@/pages/Settings/ui/Main";
import Seller from "@/pages/Settings/ui/Seller";
import StoreManagement from "@/pages/Settings/ui/StoreManagement";

import { RegisterForm } from "@/features/Auth/Register/ui/RegisterForm";

import App from "../App";
import Profile from "@/pages/Profile";
import { PrivateRoute } from "@/entities/session/ui/PrivateRoute";
import { GuestRoute } from "@/entities/session/ui/GuestRoute";
import Tasks from "@/pages/Tasks";
import NotFoundPage from "@/shared/ui/NotFoundPage";

export const appRouter = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "statistics",
            element: <Statistics />,
          },
          {
            path: "cashier-stats",
            element: <CashierStats />,
          },
          {
            path: "customers",
            element: <Customers />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "inventory",
            element: <Inventory />,
          },
          {
            path: "tasks",
            element: <Tasks />,
          },
          {
            path: "settings",
            element: <SettingsLayout />,
            children: [
              {
                path: "main",
                element: <MainSettings />,
              },
              {
                path: "sizes",
                element: <Sizes />,
              },
              {
                path: "category",
                element: <Category />,
              },
              {
                path: "payment",
                element: <Payment />,
              },
              {
                path: "barcode",
                element: <Barcode />,
              },
              {
                path: "seller",
                element: <Seller />,
              },
              {
                path: "attributes",
                element: <Attributes />,
              },
              {
                path: "store-management",
                element: <StoreManagement />,
              },
            ],
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    // Гостевые маршруты - только для НЕавторизованных
    element: <GuestRoute />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
