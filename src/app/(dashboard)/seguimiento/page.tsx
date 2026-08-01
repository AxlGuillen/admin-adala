import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { KanbanBoard } from "@/features/seguimiento/components/kanban-board";
import { TimelineSheet } from "@/features/seguimiento/components/timeline-sheet";
import { getBoard, getTimeline } from "@/features/seguimiento/queries";
import { loadSeguimientoParams } from "@/features/seguimiento/search-params";

export const metadata: Metadata = { title: "Seguimiento" };

type PageProps = { searchParams: Promise<SearchParams> };

export default async function SeguimientoPage({ searchParams }: PageProps) {
  const { prospecto } = await loadSeguimientoParams(searchParams);

  const [{ columns, total }, timeline] = await Promise.all([
    getBoard(),
    // El historial abierto vive en la URL: el sheet se carga en el servidor.
    prospecto ? getTimeline(prospecto) : Promise.resolve(null),
  ]);

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <h1 className="text-[27px] leading-tight font-semibold tracking-[-0.025em]">
          Seguimiento
        </h1>
        <p className="text-muted-foreground mt-[3px] text-[13px]">
          Arrastra cada prospecto a su fase · {total}{" "}
          {total === 1 ? "prospecto" : "prospectos"} en el tablero
        </p>
      </div>

      <KanbanBoard initialColumns={columns} />

      <TimelineSheet timeline={timeline} />
    </div>
  );
}
