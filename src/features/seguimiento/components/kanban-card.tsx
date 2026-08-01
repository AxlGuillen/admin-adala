"use client";

import { Ellipsis, MessageCircle, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { serviceLabel } from "@/features/prospects/constants";
import { formatRelativeDate, whatsappUrl } from "@/lib/format";

import {
  TRACKING_STATUSES,
  TRACKING_STATUS_VALUES,
  type TrackingStatus,
} from "../constants";
import type { BoardCard } from "../queries";

export function KanbanCard({
  card,
  onDragStart,
  onDragEnd,
  onOpen,
  onMove,
}: {
  card: BoardCard;
  onDragStart: (event: React.DragEvent, card: BoardCard) => void;
  onDragEnd: () => void;
  onOpen: (card: BoardCard) => void;
  onMove: (card: BoardCard, to: TrackingStatus) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, card)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(card)}
      className="adala-glass cursor-grab rounded-xl p-3 transition-shadow select-none active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-[13px] font-medium">{card.nombre}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Opciones de ${card.nombre}`}
              className="text-muted-foreground -mt-1 -mr-1 size-6 shrink-0"
              onClick={(event) => event.stopPropagation()}
            >
              <Ellipsis className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem onSelect={() => onOpen(card)}>
              Ver historial
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Fallback del drag: en tactil y con teclado se mueve desde aqui. */}
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Mover a
            </DropdownMenuLabel>
            {TRACKING_STATUS_VALUES.filter((status) => status !== card.estado).map(
              (status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => onMove(card, status)}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: TRACKING_STATUSES[status].dot }}
                  />
                  {TRACKING_STATUSES[status].label}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex h-5 items-center rounded-full bg-[var(--secondary)] px-2 text-[10.5px] font-medium whitespace-nowrap">
          {serviceLabel(card.servicio)}
        </span>
        <span className="text-faint truncate text-[11px]">
          {card.ciudad}, {card.estadoMx}
        </span>
      </div>

      <div className="text-muted-foreground mt-2.5 flex items-center gap-2 text-[11px]">
        <a
          href={whatsappUrl(card.telefono)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          aria-label={`Escribir por WhatsApp a ${card.nombre}`}
          className="adala-texture flex size-6 items-center justify-center rounded-md bg-[var(--brand-green-deep)] text-white"
        >
          <MessageCircle className="size-3" />
        </a>
        {card.notas > 0 ? (
          <span className="inline-flex items-center gap-1">
            <MessageSquareText className="size-3" />
            {card.notas}
          </span>
        ) : null}
        <span className="ml-auto">
          {formatRelativeDate(card.ultimaActividad)}
        </span>
      </div>
    </div>
  );
}
