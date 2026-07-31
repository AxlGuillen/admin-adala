"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * El diseno define variante clara y oscura. Sin este proveedor la clase `.dark`
 * nunca se aplica y la mitad oscura del sistema queda muerta.
 *
 * Sigue la preferencia del sistema operativo; no hay interruptor en la UI.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
