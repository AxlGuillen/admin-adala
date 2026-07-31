import type { Metadata } from "next";
import { Download } from "lucide-react";

import { KpiRow } from "@/features/overview/components/kpi-row";
import { OriginBreakdown } from "@/features/overview/components/origin-breakdown";
import { RecentProspects } from "@/features/overview/components/recent-prospects";
import { ServiceBreakdown } from "@/features/overview/components/service-breakdown";
import { TrendChart } from "@/features/overview/components/trend-chart";
import { getOverview } from "@/features/overview/queries";

export const metadata: Metadata = { title: "Resumen" };

export default async function OverviewPage() {
  const data = await getOverview();

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[27px] leading-tight font-semibold tracking-[-0.025em]">
            Resumen
          </h1>
          <p className="text-muted-foreground mt-[3px] text-[13px]">
            Como van llegando los prospectos de las campanas · hora de CDMX
          </p>
        </div>
        <a
          href="/api/prospectos/export"
          download
          className="adala-accent flex h-[38px] items-center gap-2 rounded-xl px-4 text-[13px] font-semibold"
        >
          <Download className="size-[15px]" />
          Descargar Excel
        </a>
      </div>

      <KpiRow data={data} />

      <TrendChart data={data.trend} ejeX={data.ejeX} total={data.ultimos30} />

      <div className="grid gap-3 lg:grid-cols-2">
        <ServiceBreakdown data={data.porServicio} />
        <OriginBreakdown
          data={data.porOrigen}
          topEstados={data.topEstados}
          aceptanMarketing={data.aceptanMarketing}
          aceptanMarketingPct={data.aceptanMarketingPct}
        />
      </div>

      <RecentProspects prospects={data.recientes} />

      {data.desglosesParciales ? (
        <p className="text-muted-foreground text-xs">
          Los desgloses se calculan sobre los registros mas recientes, no sobre
          el historial completo.
        </p>
      ) : null}
    </div>
  );
}
