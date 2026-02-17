import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({ dark: false, toggle: () => undefined });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <div className={dark ? "app dark" : "app"}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
