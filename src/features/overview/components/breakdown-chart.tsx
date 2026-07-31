"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

import type { BreakdownItem } from "../queries";
import { MAX_BAR_SIZE, PROSPECTS_CHART_CONFIG } from "./chart-theme";

/**
 * Barras horizontales para comparar magnitud entre categorias de nombre largo.
 *
 * Una sola medida, asi que todas las barras van del mismo color: pintarlas de
 * un degradado por tamano seria codificar dos veces lo que el largo ya dice.
 * El valor va etiquetado en la punta, por lo que no depende del tooltip.
 */
export function BreakdownChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: BreakdownItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Todavia no hay datos.
          </p>
        ) : (
          <ChartContainer
            config={PROSPECTS_CHART_CONFIG}
            // La altura crece con las categorias: asi el eje nunca queda
            // recortado ni aparece un scroll interno en la tarjeta.
            style={{ height: data.length * 40 + 16 }}
            className="w-full"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 40, top: 4, bottom: 4 }}
              barCategoryGap={8}
            >
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis
                type="category"
                dataKey="nombre"
                width={150}
                tickLine={false}
                axisLine={false}
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <Bar
                dataKey="total"
                fill="var(--color-prospectos)"
                maxBarSize={MAX_BAR_SIZE}
                // Punta redondeada, cuadrada contra la linea base.
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="total"
                  position="right"
                  offset={8}
                  fontSize={12}
                  // El texto usa tinta, nunca el color de la serie.
                  fill="var(--muted-foreground)"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
