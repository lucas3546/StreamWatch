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

  const setJwt = (token: string) => {
    localStorage.setItem("jwt", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwt");
  };

  return (
    <UserContext.Provider value={{ user, setAccountUser, setJwt, logout }}>
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
