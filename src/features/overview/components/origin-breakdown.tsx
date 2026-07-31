import type { BreakdownItem } from "../queries";

/**
 * Origen del trafico: barra de partes sobre el total mas la lista con valores.
 *
 * Aqui el color SI codifica identidad (cada origen es una serie), asi que usa
 * la escala de `--chart-*` en orden fijo. El orden lo da el volumen, pero la
 * lista repite el color junto al nombre para que nadie tenga que adivinar.
 */
const SERIES = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
] as const;

export function OriginBreakdown({
  data,
  topEstados,
  aceptanMarketing,
  aceptanMarketingPct,
}: {
  data: BreakdownItem[];
  topEstados: string[];
  aceptanMarketing: number;
  aceptanMarketingPct: number;
}) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <section className="adala-glass flex flex-col rounded-2xl p-5">
      <h2 className="text-[15.5px] font-semibold tracking-[-0.01em]">
        Origen del trafico
      </h2>
      <p className="text-muted-foreground mt-[3px] mb-4 text-xs">
        Segun el UTM de la campana
      </p>

      {total === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
          Todavia no hay datos.
        </p>
      ) : (
        <>
          <div className="flex h-3.5 gap-0.5 overflow-hidden rounded">
            {data.map((item, index) => (
              <div
                key={item.nombre}
                title={`${item.nombre}: ${item.total}`}
                style={{
                  width: `${(item.total / total) * 100}%`,
                  background: SERIES[index],
                }}
              />
            ))}
          </div>

          <div className="mt-4.5 grid grid-cols-1 gap-x-4.5 gap-y-2.5 sm:grid-cols-2">
            {data.map((item, index) => (
              <div
                key={item.nombre}
                className="flex items-center gap-2 text-[12.5px]"
              >
                <span
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ background: SERIES[index] }}
                />
                <span className="min-w-0 flex-1 truncate">{item.nombre}</span>
                <span className="font-mono">{item.total}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-auto flex flex-wrap gap-4.5 border-t border-[var(--hairline)] pt-4 [margin-block-start:1.25rem]">
        <div className="min-w-0">
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.12em] uppercase">
            Estados con mas volumen
          </p>
          <p className="mt-1.5 text-[13px] font-medium">
            {topEstados.length ? topEstados.join(" · ") : "—"}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.12em] uppercase">
            Aceptan marketing
          </p>
          <p className="mt-1.5 text-[13px] font-medium">
            {aceptanMarketing}{" "}
            <span className="text-muted-foreground">
              ({aceptanMarketingPct}%)
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
