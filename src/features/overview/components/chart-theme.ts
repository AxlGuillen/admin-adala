import type { ChartConfig } from "@/components/ui/chart";

/**
 * Un solo color de serie para todo el overview: cada grafica muestra una sola
 * medida (prospectos), asi que el color no codifica identidad y no hace falta
 * una paleta categorica.
 *
 * Los dos pasos estan validados contra las superficies reales de la app
 * (--card: #ffffff en claro, #171717 en oscuro): banda de luminosidad, piso de
 * croma y contraste >= 3:1 en ambos modos.
 */
export const PROSPECTS_CHART_CONFIG = {
  prospectos: {
    label: "Prospectos",
    theme: { light: "#2a78d6", dark: "#3987e5" },
  },
} satisfies ChartConfig;

/** Barras <= 24px y rejilla de un paso sobre la superficie, nunca punteada. */
export const MAX_BAR_SIZE = 24;
