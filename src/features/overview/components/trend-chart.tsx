import type { TrendPoint } from "../queries";

/**
 * Prospectos por dia en barras de CSS, como las define el diseno: tinta con
 * trama diagonal y los ultimos 3 dias en verde.
 *
 * El valor de cada barra no queda escondido detras del hover: va en el `title`
 * y ademas el periodo completo esta en el encabezado, asi que ningun dato
 * depende de que el usuario apunte con el cursor.
 */
export function TrendChart({
  data,
  ejeX,
  total,
}: {
  data: TrendPoint[];
  ejeX: string[];
  total: number;
}) {
  const maximo = Math.max(...data.map((point) => point.prospectos), 1);

  return (
    <section className="adala-glass rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15.5px] font-semibold tracking-[-0.01em]">
            Prospectos por dia
          </h2>
          <p className="text-muted-foreground mt-[3px] text-xs">
            Ultimos 30 dias · {total} en el periodo · hora de CDMX
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-3.5 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-[var(--ink)]" />
            dia
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-[var(--brand-green)]" />
            ultimos 3
          </span>
        </div>
      </div>

      <div className="mt-4.5 flex h-[148px] items-end gap-[5px]">
        {data.map((point) => (
          <div
            key={point.dia}
            title={`${point.etiqueta}: ${point.prospectos} ${point.prospectos === 1 ? "prospecto" : "prospectos"}`}
            className="adala-texture flex-1 rounded-t-[3px]"
            style={{
              // Una barra de 0 se ve como una linea base, no desaparece.
              height: `${Math.max((point.prospectos / maximo) * 100, 1.5)}%`,
              backgroundColor: point.reciente
                ? "var(--brand-green-deep)"
                : "var(--ink)",
            }}
          />
        ))}
      </div>

      <div className="text-faint flex justify-between pt-2.5 text-[11px]">
        {ejeX.map((etiqueta, index) => (
          <span key={`${etiqueta}-${index}`}>{etiqueta}</span>
        ))}
      </div>
    </section>
  );
}
