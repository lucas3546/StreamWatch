import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import DefaultLayout from "./layouts/DefaultLayout.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import StoragePage from "./pages/StoragePage.tsx";
import AccountPage from "./pages/Account/AccountPage.tsx";
import ChangeAvatarPage from "./pages/Account/ChangeAvatarPage.tsx";
import CreateRoomPage from "./pages/Rooms/CraeteRoomPage.tsx";
import RoomsPage from "./pages/Rooms/RoomsPage.tsx";
import RoomPage from "./pages/Rooms/RoomPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { SignalRProvider } from "./contexts/SignalRProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    element: (
      <SignalRProvider>
        <UserProvider>
          <DefaultLayout />
        </UserProvider>
      </SignalRProvider>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <RoomsPage /> },
      { path: "/rooms/create", element: <CreateRoomPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/account/change-avatar", element: <ChangeAvatarPage /> },
      { path: "/account", element: <AccountPage /> },
      { path: "/storage", element: <StoragePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/room/:roomId", element: <RoomPage /> },
      { path: "/rooms/:category/:order?", element: <RoomsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
