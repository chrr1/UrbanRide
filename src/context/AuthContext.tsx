"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (email?: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const saved = localStorage.getItem("urbanride-auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(parsed.user || { name: "Mahasiswa", email: "chrs@gmail.com" });
        }
      } catch (e) {
        console.error("Failed to parse saved auth:", e);
      }
    }
  }, []);

  const login = (email: string = "chrs@gmail.com", name: string = "Mahasiswa") => {
    const profile: UserProfile = {
      name: name.trim() || "Mahasiswa",
      email: email.trim() || "chrs@gmail.com",
    };
    setIsLoggedIn(true);
    setUser(profile);
    localStorage.setItem(
      "urbanride-auth",
      JSON.stringify({ isLoggedIn: true, user: profile })
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("urbanride-auth");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
