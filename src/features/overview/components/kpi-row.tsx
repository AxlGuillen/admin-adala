import { CalendarDays, Megaphone, TrendingUp, Users } from "lucide-react";

import type { OverviewData } from "../queries";

const VALUE = "mt-3.5 text-[46px] leading-none font-semibold tracking-[-0.035em]";

export function KpiRow({ data }: { data: OverviewData }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* Una sola tarjeta llena por pantalla: es la que manda la jerarquia. */}
      <div className="adala-tile relative overflow-hidden rounded-2xl p-[18px]">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow">Prospectos totales</span>
          <Users className="size-[17px]" />
        </div>
        <p className={VALUE}>{data.total.toLocaleString("es-MX")}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {data.delta30Pct === null ? (
            <span className="text-[11.5px] text-white/85">
              Sin periodo previo con que comparar
            </span>
          ) : (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(13,34,51,0.55)] px-2 py-[3px] text-[11.5px] font-semibold">
                <TrendingUp className="size-3" />
                {data.delta30Pct > 0 ? "+" : ""}
                {data.delta30Pct}%
              </span>
              <span className="text-[11.5px] text-white/85">
                vs 30 dias previos
              </span>
            </>
          )}
        </div>
      </div>

      <div className="adala-glass rounded-2xl p-[18px]">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow text-muted-foreground">
            Ultimos 7 dias
          </span>
          <TrendingUp className="text-brand-blue-deep size-[17px]" />
        </div>
        <p className={VALUE}>{data.ultimos7.toLocaleString("es-MX")}</p>
        <p
          className="mt-2.5 text-[11.5px]"
          style={{
            color: data.delta7 >= 0 ? "#4f9c26" : "var(--destructive)",
          }}
        >
          {data.delta7 > 0 ? "+" : ""}
          {data.delta7} vs semana previa
        </p>
      </div>

      <div className="adala-glass rounded-2xl p-[18px]">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow text-muted-foreground">Hoy</span>
          <CalendarDays className="text-brand-blue-deep size-[17px]" />
        </div>
        <p className={VALUE}>{data.hoy.toLocaleString("es-MX")}</p>
        <p className="text-muted-foreground mt-2.5 text-[11.5px]">
          {data.ultimaHora} en la ultima hora
        </p>
      </div>

      <div className="adala-ink rounded-2xl p-[18px]">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow text-[#9db6c8]">Aceptan marketing</span>
          <Megaphone className="size-[17px] text-[#8fd14f]" />
        </div>
        <p className={VALUE}>{data.aceptanMarketing.toLocaleString("es-MX")}</p>
        <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full"
            style={{
              width: `${data.aceptanMarketingPct}%`,
              background: "linear-gradient(90deg, #1c9ad6, #7ac143)",
            }}
          />
        </div>
        <p className="mt-2 text-[11.5px] text-[#9db6c8]">
          {data.aceptanMarketingPct}% de los prospectos
        </p>
      </div>
    </div>
  );
}
