"use client";

// Konteks tema (light/dark) yang tersimpan di localStorage
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Always read from localStorage and set data-theme attribute on <html>
    const stored = localStorage.getItem("urbanride-theme") as Theme | null;
    const resolved: Theme = stored === "dark" ? "dark" : "light";
    setTheme(resolved);
    // Terapkan atribut data-theme ke elemen html agar CSS bekerja
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  // Fungsi toggle tema: ganti antara light dan dark, lalu simpan ke localStorage
  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      localStorage.setItem("urbanride-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

