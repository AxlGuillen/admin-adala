"use client";

import { useState } from "react";
import { Inbox, MessageCircle } from "lucide-react";

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

const TH =
  "text-faint h-[34px] text-left font-mono text-[10px] font-medium tracking-[0.1em] uppercase border-b border-[var(--hairline)]";
const TD = "py-2.5 border-b border-[var(--hairline-soft)]";

export function ProspectsTable({ prospects }: { prospects: Prospect[] }) {
  const [selected, setSelected] = useState<Prospect | null>(null);

  if (prospects.length === 0) {
    return (
      <div className="adala-glass flex flex-col items-center gap-2 rounded-2xl px-6 py-14 text-center">
        <Inbox className="text-muted-foreground size-6" />
        <p className="font-medium">Sin prospectos</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          No hay registros que coincidan con los filtros. Prueba ampliando el
          periodo o limpiando la busqueda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="adala-glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={`${TH} px-5`}>Prospecto</th>
                <th className={`${TH} px-2`}>Contacto</th>
                <th className={`${TH} hidden px-2 md:table-cell`}>Ubicacion</th>
                <th className={`${TH} px-2`}>Servicio</th>
                <th className={`${TH} hidden px-2 lg:table-cell`}>Campana</th>
                <th className={`${TH} px-5 text-right`}>Recibido</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((prospect) => (
                <tr
                  key={prospect.id}
                  onClick={() => setSelected(prospect)}
                  className="cursor-pointer transition-colors hover:bg-white/45 dark:hover:bg-white/5"
                >
                  <td className={`${TD} px-5`}>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex size-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(140deg, #1c9ad6, #7ac143)",
                        }}
                      >
                        {initials(prospect.full_name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {prospect.full_name}
                        </p>
                        {prospect.email ? (
                          <p className="text-faint truncate text-[11px]">
                            {prospect.email}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className={`${TD} px-2`}>
                    <div className="flex items-center gap-[7px]">
                      <span className="font-mono text-xs whitespace-nowrap">
                        {formatPhone(prospect.phone)}
                      </span>
                      <a
                        href={whatsappUrl(prospect.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        // El click no debe abrir tambien el panel de detalle.
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Escribir por WhatsApp a ${prospect.full_name}`}
                        className="adala-texture flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-[var(--brand-green-deep)] text-white"
                      >
                        <MessageCircle className="size-3.5" />
                      </a>
                    </div>
                  </td>

                  <td className={`${TD} text-muted-foreground hidden px-2 md:table-cell`}>
                    {prospect.city}, {prospect.state_mx}
                  </td>

                  <td className={`${TD} px-2`}>
                    <span className="inline-flex h-[22px] items-center rounded-full bg-[var(--secondary)] px-2.5 text-[11.5px] font-medium whitespace-nowrap">
                      {serviceLabel(prospect.service_type)}
                    </span>
                  </td>

                  <td className={`${TD} text-muted-foreground hidden px-2 text-xs lg:table-cell`}>
                    {prospect.utm_campaign ?? prospect.utm_source ?? "Directo"}
                  </td>

                  <td
                    className={`${TD} text-muted-foreground px-5 text-right text-xs whitespace-nowrap`}
                    title={formatDateTime(prospect.created_at)}
                  >
                    {formatRelativeDate(prospect.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
