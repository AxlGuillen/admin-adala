import type { BreakdownItem } from "../queries";

/**
 * Servicio solicitado en barras horizontales.
 *
 * Una sola medida, asi que todas las barras van del mismo azul: pintarlas con
 * un degradado por tamano codificaria dos veces lo que el largo ya dice. El
 * valor va etiquetado, no escondido en un tooltip.
 */
export function ServiceBreakdown({ data }: { data: BreakdownItem[] }) {
  const maximo = Math.max(...data.map((item) => item.total), 1);

  return (
    <section className="adala-glass rounded-2xl p-5">
      <h2 className="text-[15.5px] font-semibold tracking-[-0.01em]">
        Servicio solicitado
      </h2>
      <p className="text-muted-foreground mt-[3px] mb-4 text-xs">
        Que estan pidiendo los prospectos
      </p>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
          Todavia no hay datos.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {data.map((item) => (
            <div key={item.nombre}>
              <div className="mb-1.5 flex justify-between text-[12.5px]">
                <span>{item.nombre}</span>
                <span className="text-muted-foreground font-mono">
                  {item.total}
                </span>
              </div>
              <div className="h-2.5 rounded-[3px] bg-[rgba(13,34,51,0.08)] dark:bg-white/8">
                <div
                  className="h-full rounded-[3px] bg-[var(--brand-blue-deep)] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.24)_0_1px,transparent_1px_6px)]"
                  style={{ width: `${Math.max((item.total / maximo) * 100, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
