// app/context/AuthContext.tsx
"use client";
// 1. Define what a User object looks like
interface User {
  email: string;
  name: string;
  token: string;
}

// 2. Define the shape of the Context
interface AuthContextType {
  user: User | null; // User can be the object OR null
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem("mock_user", JSON.stringify(userData));
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("mock_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);