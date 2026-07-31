"use client";

import { useQueryStates } from "nuqs";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";

import { prospectsFilters, serializeProspectsFilters } from "../search-params";

export function ExportButton({ total }: { total: number }) {
  const [filters] = useQueryStates(prospectsFilters);

  // La paginacion no aplica: el Excel lleva todo lo que cumple los filtros.
  const href = serializeProspectsFilters("/api/prospectos/export", {
    ...filters,
    pagina: 1,
  });

  return (
    <a
      href={href}
      download
      aria-disabled={total === 0}
      className={cn(
        "adala-accent flex h-[38px] items-center gap-2 rounded-xl px-4 text-[13px] font-semibold",
        total === 0 && "pointer-events-none opacity-50",
      )}
    >
      <Download className="size-[15px]" />
      Descargar Excel
      {total > 0 ? (
        <span className="font-mono text-xs opacity-80">({total})</span>
      ) : null}
    </a>
  );
}
