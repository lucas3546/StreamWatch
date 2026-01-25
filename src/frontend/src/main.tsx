import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DefaultLayout from "./layouts/DefaultLayout.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import StoragePage from "./pages/StoragePage.tsx";
import AccountPage from "./pages/Account/AccountPage.tsx";
import CreateRoomPage from "./pages/Rooms/CraeteRoomPage.tsx";
import RoomsPage from "./pages/Rooms/RoomsPage.tsx";
import RoomPage from "./pages/Rooms/RoomPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { SignalRProvider } from "./contexts/SignalRProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import FriendsPage from "./pages/FriendsPage.tsx";
import { ToastContainer } from "react-toastify";
import ProfilePage from "./pages/ProfilePage.tsx";
import BanPage from "./pages/BanPage.tsx";
import ProtectedRoutes from "./components/routes/ProtectedRoutes.tsx";
import ReportPage from "./pages/ReportPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import RoleProtectedRoutes from "./components/routes/RoleProtectedRoutes.tsx";
import TermsConditionsPage from "./pages/TermsConditionsPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
const router = createBrowserRouter([
  {
    element: (
      <SignalRProvider>
        <ToastContainer></ToastContainer>
        <UserProvider>
          <DefaultLayout />
        </UserProvider>
      </SignalRProvider>
    ),
    children: [
      {
        //PUBLIC ROUTES
        path: "/",
        element: <RoomsPage key="/" category="All" order="Recent" />,
      },
      {
        path: "/home",
        element: <RoomsPage key="home" category="All" order="Recent" />,
      },
      {
        path: "/trending",
        element: <RoomsPage key="trending" category="All" order="MostUsers" />,
      },
      {
        path: "/categories/:categoryName",
        element: <RoomsPage key={location.pathname} order="Recent" />,
      },

      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      {path: "/terms-and-conditions", element: <TermsConditionsPage />},
      {path: "/privacy-policy", element: <PrivacyPolicyPage />},
      {
        //PROTECTED ROUTES
        element: <ProtectedRoutes></ProtectedRoutes>,
        children: [
          { path: "/rooms/create", element: <CreateRoomPage /> },
          { path: "/friends", element: <FriendsPage /> },
          { path: "/room/:roomId", element: <RoomPage /> },
          { path: "/account", element: <AccountPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/profile/:accountId", element: <ProfilePage /> },
          { path: "/storage", element: <StoragePage /> },
        ],
      },
      {
        element: <RoleProtectedRoutes allowedRoles={["Mod", "Admin"]}></RoleProtectedRoutes>,
        children: [
          { path: "/reports/", element: <ReportsPage /> },
          { path: "/report/:reportId", element: <ReportPage /> },
        ]
      }
    ],
  },
  {
    path: "/banned",
    element: <BanPage></BanPage>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
