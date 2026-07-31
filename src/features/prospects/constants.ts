/**
 * Estos valores son los mismos que valida la policy de INSERT de la landing
 * (`Public contact form insert (validated)` en adala_prospects). Si se agrega
 * un servicio nuevo hay que tocarlo en los dos lados o el form lo rechaza.
 */
export const SERVICE_TYPES = {
  "work-visa": "Visa de trabajo",
  "tourist-visa": "Visa de turista",
  "immigration-waiver": "Perdon migratorio",
  "family-reunification": "Reunificacion familiar",
  naturalization: "Naturalizacion",
  "dual-nationality": "Doble nacionalidad",
  "marriage-petition": "Peticion por matrimonio",
  other: "Otro",
} as const;

export type ServiceType = keyof typeof SERVICE_TYPES;

export const SERVICE_TYPE_VALUES = Object.keys(SERVICE_TYPES) as ServiceType[];

/** La columna es `text`, asi que un valor viejo o inesperado no debe romper la UI. */
export function serviceLabel(value: string) {
  return SERVICE_TYPES[value as ServiceType] ?? value;
}

export const PAGE_SIZE = 25;

/** Tope de filas por descarga de Excel. Si se alcanza, el archivo lo declara. */
export const EXPORT_LIMIT = 5000;
