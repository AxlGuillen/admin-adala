"use client";

import { useState } from "react";
import { Inbox, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDateTime,
  formatPhone,
  formatRelativeDate,
  initials,
  whatsappUrl,
} from "@/lib/format";

import { serviceLabel } from "../constants";
import type { Prospect } from "../queries";
import { ProspectDetailSheet } from "./prospect-detail-sheet";

export function ProspectsTable({ prospects }: { prospects: Prospect[] }) {
  const [selected, setSelected] = useState<Prospect | null>(null);

  if (prospects.length === 0) {
    return (
      <Empty className="border-border rounded-lg border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Sin prospectos</EmptyTitle>
          <EmptyDescription>
            No hay registros que coincidan con los filtros. Prueba ampliando el
            periodo o limpiando la busqueda.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prospecto</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="hidden md:table-cell">Ubicacion</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead className="hidden lg:table-cell">Campana</TableHead>
              <TableHead className="text-right">Recibido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.map((prospect) => (
              <TableRow
                key={prospect.id}
                onClick={() => setSelected(prospect)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {initials(prospect.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {prospect.full_name}
                      </p>
                      {prospect.email ? (
                        <p className="text-muted-foreground truncate text-xs">
                          {prospect.email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="tabular-nums">
                      {formatPhone(prospect.phone)}
                    </span>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      // El click no debe abrir tambien el panel de detalle.
                      onClick={(event) => event.stopPropagation()}
                    >
                      <a
                        href={whatsappUrl(prospect.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Escribir por WhatsApp a ${prospect.full_name}`}
                      >
                        <MessageCircle />
                      </a>
                    </Button>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <span className="text-sm">
                    {prospect.city}, {prospect.state_mx}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {serviceLabel(prospect.service_type)}
                  </Badge>
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  <span className="text-muted-foreground text-sm">
                    {prospect.utm_campaign ?? prospect.utm_source ?? "Directo"}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <span
                    className="text-muted-foreground text-sm"
                    title={formatDateTime(prospect.created_at)}
                  >
                    {formatRelativeDate(prospect.created_at)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProspectDetailSheet
        prospect={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
