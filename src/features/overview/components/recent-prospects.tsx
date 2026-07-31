import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { serviceLabel } from "@/features/prospects/constants";
import type { Prospect } from "@/features/prospects/queries";
import { formatPhone, formatRelativeDate, whatsappUrl } from "@/lib/format";

const TH =
  "text-faint h-[30px] text-left font-mono text-[10px] font-medium tracking-[0.1em] uppercase border-b border-[var(--hairline)]";
const TD = "py-[11px] border-b border-[var(--hairline-soft)]";

export function RecentProspects({ prospects }: { prospects: Prospect[] }) {
  return (
    <section className="adala-glass overflow-hidden rounded-2xl pt-5 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3.5">
        <div>
          <h2 className="text-[15.5px] font-semibold tracking-[-0.01em]">
            Ultimos prospectos
          </h2>
          <p className="text-muted-foreground mt-[3px] text-xs">
            Los 5 registros mas recientes
          </p>
        </div>
        <Link
          href="/prospectos"
          className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-white/85 px-3 text-[12.5px] font-medium shadow-[inset_0_0_0_1px_rgba(13,34,51,0.08)] transition-colors hover:bg-white dark:bg-white/8 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] dark:hover:bg-white/12"
        >
          Ver todos <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {prospects.length === 0 ? (
        <p className="text-muted-foreground px-5 py-8 text-center text-sm">
          Todavia no llega ningun prospecto.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={`${TH} px-5`}>Prospecto</th>
                <th className={`${TH} px-2`}>Telefono</th>
                <th className={`${TH} hidden px-2 md:table-cell`}>Ciudad</th>
                <th className={`${TH} px-2`}>Servicio</th>
                <th className={`${TH} px-5 text-right`}>Recibido</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((prospect) => (
                <tr key={prospect.id}>
                  <td className={`${TD} px-5 font-medium`}>
                    {prospect.full_name}
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
                        aria-label={`Escribir por WhatsApp a ${prospect.full_name}`}
                        className="flex size-[26px] shrink-0 items-center justify-center rounded-lg text-white"
                        style={{
                          background: "linear-gradient(140deg, #7ac143, #4f9c26)",
                        }}
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
                  <td className={`${TD} text-muted-foreground px-5 text-right text-xs whitespace-nowrap`}>
                    {formatRelativeDate(prospect.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
