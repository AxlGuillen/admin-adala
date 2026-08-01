import { createLoader, parseAsString } from "nuqs/server";

/**
 * El prospecto abierto en el panel de historial vive en la URL (`?prospecto=`),
 * igual que los filtros de la lista: el link se puede compartir y el timeline
 * se carga en el servidor, sin fetch desde el cliente.
 */
export const seguimientoParams = {
  prospecto: parseAsString.withDefault(""),
};

export const loadSeguimientoParams = createLoader(seguimientoParams);
