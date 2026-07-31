import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Version del hook de shadcn reescrita con useSyncExternalStore.
 *
 * El original hacia setState dentro de un useEffect, lo que dispara un render
 * en cascada y lo marca como error la regla react-hooks/set-state-in-effect
 * del config de Next 16. Si se regenera el componente `sidebar` con la CLI,
 * revisa que este archivo no se haya sobrescrito.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    // En el servidor no hay viewport: se asume escritorio y el cliente corrige
    // en la hidratacion.
    () => false,
  )
}
