import type { NextRequest } from "next/server";

import { serviceLabel } from "@/features/prospects/constants";
import { buildProspectsWorkbook, mexicoDateText } from "@/features/prospects/excel";
import { listProspectsForExport } from "@/features/prospects/queries";
import {
  PERIOD_LABELS,
  loadProspectsFilters,
} from "@/features/prospects/search-params";
import { getCurrentAdmin } from "@/lib/auth";

// exceljs es Node puro, no corre en el runtime edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // El proxy ya bloquea sin sesion; esto ademas exige estar en la allowlist.
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const filters = loadProspectsFilters(request.nextUrl.searchParams);
  const { prospects, total, truncated } = await listProspectsForExport(filters);

  const workbook = await buildProspectsWorkbook(prospects, {
    generadoPor: admin.email,
    total,
    truncated,
    periodo: PERIOD_LABELS[filters.periodo],
    servicio:
      filters.servicio === "todos" ? "Todos" : serviceLabel(filters.servicio),
    estado: filters.estado === "todos" ? "Todos" : filters.estado,
    busqueda: filters.q,
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const stamp = mexicoDateText(new Date().toISOString()).replace(/[: ]/g, "-");

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="prospectos-adala-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
