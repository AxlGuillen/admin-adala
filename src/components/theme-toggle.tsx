"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * Detecta la hidratacion sin setState dentro de un efecto (la regla
 * react-hooks/set-state-in-effect lo prohibe): en servidor devuelve false y
 * en cliente true, asi el primer render coincide y no hay mismatch.
 */
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Toggle claro/oscuro con la "gota": el tema nuevo se revela en un circulo
 * que crece desde el boton, via la View Transitions API. En navegadores sin
 * la API (o con reduccion de movimiento activa) simplemente cambia el tema.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // La gota nace en el centro del boton y crece hasta cubrir la esquina
    // mas lejana de la ventana.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      // flushSync: la clase .dark tiene que estar aplicada cuando la API
      // capture el frame nuevo, no un render despues.
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      // Si la transicion se aborta (p. ej. dos clics rapidos), no hay nada
      // que hacer: el tema ya cambio.
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg transition-colors",
        // Antes de hidratar no se sabe el tema: el boton se oculta sin mover
        // el layout y aparece con el icono correcto.
        !mounted && "opacity-0",
        className,
      )}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
