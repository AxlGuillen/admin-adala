"use client";

import { useQueryStates } from "nuqs";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  prospectsFilters,
  serializeProspectsFilters,
} from "../search-params";

export function ExportButton({ total }: { total: number }) {
  const [filters] = useQueryStates(prospectsFilters);

  // La paginacion no aplica: el Excel lleva todo lo que cumple los filtros.
  const href = serializeProspectsFilters("/api/prospectos/export", {
    ...filters,
    pagina: 1,
  });

  return (
    <Button asChild variant="outline" disabled={total === 0}>
      <a href={href} download>
        <Download />
        Descargar Excel
        {total > 0 ? (
          <span className="text-muted-foreground tabular-nums">({total})</span>
        ) : null}
      </a>
    </Button>
  );
}
