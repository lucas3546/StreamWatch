import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import DefaultLayout from "./layouts/DefaultLayout.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import StoragePage from "./pages/StoragePage.tsx";
import AccountPage from "./pages/Account/AccountPage.tsx";
import ChangeAvatarPage from "./pages/Account/ChangeAvatarPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/account/change-avatar"
              element={<ChangeAvatarPage />}
            />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/storage" element={<StoragePage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </DefaultLayout>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
