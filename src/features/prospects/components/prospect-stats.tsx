import { CalendarDays, Megaphone, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { ProspectStats } from "../queries";

const CARDS = [
  { key: "total", label: "Prospectos totales", icon: Users },
  { key: "ultimos7", label: "Ultimos 7 dias", icon: TrendingUp },
  { key: "hoy", label: "Hoy", icon: CalendarDays },
  { key: "conMarketing", label: "Aceptan marketing", icon: Megaphone },
] as const;

export function ProspectStatsCards({ stats }: { stats: ProspectStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">{label}</p>
              {/* Cifras proporcionales: tabular-nums solo en columnas. */}
              <p className="text-3xl font-semibold">
                {stats[key].toLocaleString("es-MX")}
              </p>
            </div>
            <Icon className="text-muted-foreground size-5 shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
