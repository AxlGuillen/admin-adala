"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { moveProspect } from "../actions";
import {
  TRACKING_STATUSES,
  TRACKING_STATUS_VALUES,
  type TrackingStatus,
} from "../constants";
import type { BoardCard, BoardColumns } from "../queries";
import { seguimientoParams } from "../search-params";
import { KanbanCard } from "./kanban-card";

export function KanbanBoard({ initialColumns }: { initialColumns: BoardColumns }) {
  const [dragging, setDragging] = useState<BoardCard | null>(null);
  const [overColumn, setOverColumn] = useState<TrackingStatus | null>(null);
  const [, startTransition] = useTransition();

  // useOptimistic pinta el movimiento al instante y, al terminar la
  // transicion, vuelve solo a lo que diga el servidor: si la action funciono,
  // revalidatePath ya trajo columnas con el cambio; si fallo, la tarjeta
  // regresa a su columna sin codigo de revert.
  const [columns, applyMove] = useOptimistic(
    initialColumns,
    (current, move: { card: BoardCard; to: TrackingStatus }) => {
      const next = { ...current };
      next[move.card.estado] = current[move.card.estado].filter(
        (c) => c.id !== move.card.id,
      );
      next[move.to] = [
        {
          ...move.card,
          estado: move.to,
          ultimaActividad: new Date().toISOString(),
        },
        ...current[move.to],
      ];
      return next;
    },
  );

  // shallow: false para que el servidor cargue el historial del prospecto.
  const [, setProspecto] = useQueryState("prospecto", {
    ...seguimientoParams.prospecto,
    shallow: false,
  });

  function handleMove(card: BoardCard, to: TrackingStatus) {
    if (card.estado === to) return;

    startTransition(async () => {
      applyMove({ card, to });
      const result = await moveProspect({ prospectId: card.id, toStatus: to });
      if (result.error) toast.error(result.error);
    });
  }

  function openTimeline(card: BoardCard) {
    void setProspecto(card.id);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {TRACKING_STATUS_VALUES.map((status) => {
        const cards = columns[status];
        const isOver = overColumn === status && dragging?.estado !== status;

        return (
          <section
            key={status}
            aria-label={TRACKING_STATUSES[status].label}
            onDragOver={(event) => {
              // Sin preventDefault el navegador no permite soltar aqui.
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setOverColumn(status);
            }}
            onDragLeave={(event) => {
              // Solo limpia al salir de la columna, no al pasar sobre una tarjeta.
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setOverColumn((current) => (current === status ? null : current));
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging) handleMove(dragging, status);
              setDragging(null);
              setOverColumn(null);
            }}
            className={cn(
              "adala-glass-soft flex w-[272px] shrink-0 flex-col rounded-2xl p-2 transition-shadow",
              isOver && "ring-2 ring-[var(--ring)]",
            )}
          >
            <header className="flex items-center gap-2 px-2 pt-1.5 pb-2.5">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ background: TRACKING_STATUSES[status].dot }}
              />
              <span className="text-[13px] font-semibold">
                {TRACKING_STATUSES[status].label}
              </span>
              <span className="text-faint ml-auto font-mono text-[11px]">
                {cards.length}
              </span>
            </header>

            <div className="flex min-h-[280px] flex-col gap-2 p-1">
              {cards.map((card) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onDragStart={(event, dragged) => {
                    event.dataTransfer.setData("text/plain", dragged.id);
                    event.dataTransfer.effectAllowed = "move";
                    setDragging(dragged);
                  }}
                  onDragEnd={() => {
                    setDragging(null);
                    setOverColumn(null);
                  }}
                  onOpen={openTimeline}
                  onMove={handleMove}
                />
              ))}
              {cards.length === 0 ? (
                <div className="text-faint flex flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--hairline)] p-4 text-center text-xs">
                  Arrastra una tarjeta aqui
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
