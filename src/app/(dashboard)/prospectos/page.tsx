import { Suspense } from "react";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { Skeleton } from "@/components/ui/skeleton";
import { ExportButton } from "@/features/prospects/components/export-button";
import { ProspectStatsCards } from "@/features/prospects/components/prospect-stats";
import { ProspectsFilters } from "@/features/prospects/components/prospects-filters";
import { ProspectsPagination } from "@/features/prospects/components/prospects-pagination";
import { ProspectsTable } from "@/features/prospects/components/prospects-table";
import {
  getProspectStats,
  getStateOptions,
  listProspects,
} from "@/features/prospects/queries";
import { loadProspectsFilters } from "@/features/prospects/search-params";

export const metadata: Metadata = { title: "Prospectos" };

type PageProps = { searchParams: Promise<SearchParams> };

export default async function ProspectosPage({ searchParams }: PageProps) {
  const filters = await loadProspectsFilters(searchParams);

  const [{ prospects, total, page, pageCount }, stats, states] =
    await Promise.all([
      listProspects(filters),
      getProspectStats(),
      getStateOptions(),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prospectos</h1>
          <p className="text-muted-foreground text-sm">
            Contactos que llegaron por el formulario de la landing.
          </p>
        </div>
        {/* El contador deja claro que la descarga respeta los filtros activos. */}
        <Suspense fallback={<Skeleton className="h-9 w-44" />}>
          <ExportButton total={total} />
        </Suspense>
      </div>

      <ProspectStatsCards stats={stats} />

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ProspectsFilters states={states} />
      </Suspense>

      <ProspectsTable prospects={prospects} />

      <ProspectsPagination page={page} pageCount={pageCount} total={total} />
    </div>
  );
}
