import { CalendarDays, Megaphone, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { OverviewData } from "../queries";

export function KpiRow({ data }: { data: OverviewData }) {
  const tiles = [
    {
      label: "Prospectos totales",
      value: data.total,
      hint: "Desde el primer registro",
      icon: Users,
    },
    {
      label: "Ultimos 7 dias",
      value: data.ultimos7,
      hint: "Incluye hoy",
      icon: TrendingUp,
    },
    {
      label: "Hoy",
      value: data.hoy,
      hint: "Hora de Ciudad de Mexico",
      icon: CalendarDays,
    },
    {
      label: "Promedio diario",
      value: data.promedioDiario,
      hint: "Sobre los ultimos 30 dias",
      icon: Megaphone,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ label, value, hint, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-sm">{label}</p>
              <Icon className="text-muted-foreground size-4 shrink-0" />
            </div>
            {/* Cifras proporcionales: tabular-nums separa de mas a este tamano. */}
            <p className="text-3xl font-semibold">
              {value.toLocaleString("es-MX")}
            </p>
            <p className="text-muted-foreground text-xs">{hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
