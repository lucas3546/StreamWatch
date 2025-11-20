// src/context/UserContext.tsx
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface User {
  nameid: string;
  name: string;
  email: string;
  role: string;
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
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);

        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("jwt");
          return;
        }

        setUser({
          nameid: decoded.nameid,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          picture: decoded.picture,
        });
      } catch {
        localStorage.removeItem("jwt");
      }
    }
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
    setUser(null);
    localStorage.removeItem("jwt");
  };

  return (
    <UserContext.Provider
      value={{ user, setAccountUser, refreshUser, setJwt, logout }}
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
