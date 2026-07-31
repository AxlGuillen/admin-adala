import type { Metadata } from "next";

import { BreakdownChart } from "@/features/overview/components/breakdown-chart";
import { KpiRow } from "@/features/overview/components/kpi-row";
import { RecentProspects } from "@/features/overview/components/recent-prospects";
import { TrendChart } from "@/features/overview/components/trend-chart";
import { getOverview } from "@/features/overview/queries";

export const metadata: Metadata = { title: "Resumen" };

export default async function OverviewPage() {
  const data = await getOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="text-muted-foreground text-sm">
          Como van llegando los prospectos de las campanas.
        </p>
      </div>

      <KpiRow data={data} />

      <TrendChart data={data.trend} />

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownChart
          title="Servicio solicitado"
          description="Que estan pidiendo los prospectos"
          data={data.porServicio}
        />
        <BreakdownChart
          title="Origen del trafico"
          description="De donde llegan, segun el UTM de la campana"
          data={data.porOrigen}
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
