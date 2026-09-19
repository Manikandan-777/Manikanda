"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({
  children,
  defaultMode,
}: {
  children: ReactNode;
  defaultMode: "light" | "dark" | "system";
}) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={defaultMode}
      enableSystem={defaultMode === "system"}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
