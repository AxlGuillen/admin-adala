"use client";

import { useTransition } from "react";
import { useQueryState } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { prospectsFilters } from "../search-params";

export function ProspectsPagination({
  page,
  pageCount,
  total,
}: {
  page: number;
  pageCount: number;
  total: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [, setPagina] = useQueryState("pagina", {
    ...prospectsFilters.pagina,
    shallow: false,
    startTransition,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        {total} {total === 1 ? "prospecto" : "prospectos"} · pagina {page} de{" "}
        {pageCount}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isPending}
          onClick={() => setPagina(page - 1)}
        >
          <ChevronLeft /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount || isPending}
          onClick={() => setPagina(page + 1)}
        >
          Siguiente <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
