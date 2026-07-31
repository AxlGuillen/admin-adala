import ExcelJS from "exceljs";

import { EXPORT_LIMIT, serviceLabel } from "./constants";
import type { Prospect } from "./queries";

const TIME_ZONE = "America/Mexico_City";

/**
 * Excel no guarda zona horaria y `created_at` viene en UTC. Devolvemos texto en
 * hora de Ciudad de Mexico con formato `yyyy-mm-dd hh:mm`, que se ordena
 * alfabeticamente igual que cronologicamente y no se presta a confusion.
 */
export function mexicoDateText(iso: string | null) {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

const COLUMNS = [
  { header: "Fecha de registro", key: "fecha", width: 18 },
  { header: "Nombre", key: "nombre", width: 28 },
  { header: "Telefono", key: "telefono", width: 14 },
  { header: "Email", key: "email", width: 30 },
  { header: "Estado", key: "estado", width: 20 },
  { header: "Ciudad", key: "ciudad", width: 20 },
  { header: "Servicio", key: "servicio", width: 24 },
  { header: "Detalle", key: "detalle", width: 40 },
  { header: "Acepta marketing", key: "marketing", width: 16 },
  { header: "Origen", key: "utmSource", width: 16 },
  { header: "Medio", key: "utmMedium", width: 16 },
  { header: "Campana", key: "utmCampaign", width: 26 },
  { header: "Contenido", key: "utmContent", width: 22 },
  // Columnas vacias para que el equipo lleve el seguimiento a mano mientras el
  // modulo de seguimiento no existe.
  { header: "Estatus", key: "estatus", width: 16 },
  { header: "Responsable", key: "responsable", width: 18 },
  { header: "Notas", key: "notas", width: 44 },
];

export type ExportMeta = {
  generadoPor: string;
  total: number;
  truncated: boolean;
  periodo: string;
  servicio: string;
  estado: string;
  busqueda: string;
};

export async function buildProspectsWorkbook(
  prospects: Prospect[],
  meta: ExportMeta,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Panel Adala";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Prospectos", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.columns = COLUMNS;

  for (const prospect of prospects) {
    sheet.addRow({
      fecha: mexicoDateText(prospect.created_at),
      nombre: prospect.full_name,
      // Como texto: si Excel lo lee como numero se come el cero inicial.
      telefono: prospect.phone,
      email: prospect.email ?? "",
      estado: prospect.state_mx,
      ciudad: prospect.city,
      servicio: serviceLabel(prospect.service_type),
      detalle: prospect.other_description ?? "",
      marketing: prospect.accepts_marketing ? "Si" : "No",
      utmSource: prospect.utm_source ?? "",
      utmMedium: prospect.utm_medium ?? "",
      utmCampaign: prospect.utm_campaign ?? "",
      utmContent: prospect.utm_content ?? "",
      estatus: "",
      responsable: "",
      notas: "",
    });
  }

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2A78D6" },
  };
  header.alignment = { vertical: "middle" };
  header.height = 22;
  sheet.getColumn("telefono").alignment = { horizontal: "left" };

  if (prospects.length > 0) {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: COLUMNS.length },
    };
  }

  // Hoja aparte con el contexto de la descarga: que filtros se aplicaron y si
  // el archivo trae todo. La hoja de datos se queda limpia para filtrar.
  const info = workbook.addWorksheet("Info");
  info.columns = [
    { header: "Campo", key: "campo", width: 26 },
    { header: "Valor", key: "valor", width: 60 },
  ];
  info.getRow(1).font = { bold: true };

  const infoRows: Array<[string, string]> = [
    ["Generado", mexicoDateText(new Date().toISOString())],
    ["Zona horaria", TIME_ZONE],
    ["Generado por", meta.generadoPor],
    ["Filas en el archivo", String(prospects.length)],
    ["Total que cumple filtros", String(meta.total)],
    ["Periodo", meta.periodo],
    ["Servicio", meta.servicio],
    ["Estado", meta.estado],
    ["Busqueda", meta.busqueda || "(sin busqueda)"],
  ];
  if (meta.truncated) {
    infoRows.push([
      "AVISO",
      `El archivo esta recortado a las ${EXPORT_LIMIT} filas mas recientes. Acota los filtros para exportar el resto.`,
    ]);
  }
  for (const [campo, valor] of infoRows) {
    info.addRow({ campo, valor });
  }

  return workbook;
}
