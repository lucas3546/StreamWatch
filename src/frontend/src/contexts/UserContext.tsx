// src/context/UserContext.tsx
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { refreshToken } from "../services/accountService";

export interface User {
  nameid: string;
  name: string;
  email: string;
  role: "Admin" | "Mod" | "User";
  picture?: string;
}

interface DecodedToken extends User {
  exp: number;
}

interface UserContextType {
  user: User | null;
  setAccountUser: (token: string) => void;
  setJwt: (token: string) => void;
  refreshUser: (token: string) => void;
  loading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setLoading(true);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    let decoded: DecodedToken;

    const applyUserFromToken = (token: string) => {
      decoded = jwtDecode<DecodedToken>(token);
      setUser({
        nameid: decoded.nameid,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        picture: decoded.picture,
      });
    };

    const tryRefresh = async () => {
      const resp = await refreshToken();
      localStorage.setItem("jwt", resp.token);
      applyUserFromToken(resp.token);
    };

    try {
      decoded = jwtDecode<DecodedToken>(storedToken);
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 60) {
        tryRefresh();
      } else {
        applyUserFromToken(storedToken);
      }
    } catch {
      localStorage.removeItem("jwt");
      setLoading(false);
      return;
    }

    const intervalId = window.setInterval(async () => {
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 60) {
        try {
          console.log("Refreshing jwt");
          await tryRefresh();
        } catch {
          localStorage.removeItem("jwt");
        }
      }
    }, 10_000);

    setLoading(false);
    return () => clearInterval(intervalId);
  }, []);






  const setAccountUser = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        nameid: decoded.nameid,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        picture: decoded.picture,
      });
      localStorage.setItem("jwt", token);
    } catch (error) {
      console.error("Error decoding JWT", error);
    }
  };

  const refreshUser = (newToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      setUser({
        nameid: decoded.nameid,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        picture: decoded.picture,
      });
      localStorage.setItem("jwt", newToken);
    } catch (error) {
      console.error("Error decoding JWT", error);
    }
  };

  const setJwt = (token: string) => {
    localStorage.setItem("jwt", token);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
  };

  return (
    <UserContext.Provider
      value={{ user, setAccountUser, refreshUser, loading, setJwt, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
