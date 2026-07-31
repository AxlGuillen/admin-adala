"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { TrendPoint } from "../queries";
import { PROSPECTS_CHART_CONFIG } from "./chart-theme";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const maximo = Math.max(...data.map((point) => point.prospectos), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prospectos por dia</CardTitle>
        <CardDescription>
          Ultimos 30 dias, hora de Ciudad de Mexico
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Una sola serie: el titulo ya dice que se grafica, no lleva leyenda. */}
        <ChartContainer
          config={PROSPECTS_CHART_CONFIG}
          className="h-[240px] w-full"
        >
          <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <XAxis
              dataKey="etiqueta"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis
              width={28}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, Math.max(maximo, 2)]}
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="prospectos"
              type="monotone"
              stroke="var(--color-prospectos)"
              strokeWidth={2}
              // Relleno como lavado, no como bloque saturado.
              fill="var(--color-prospectos)"
              fillOpacity={0.1}
              // El punto solo aparece al pasar el cursor: no ensuciamos 30 dias.
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
