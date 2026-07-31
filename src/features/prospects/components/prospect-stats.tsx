import { CalendarDays, Megaphone, TrendingUp, Users } from "lucide-react";

import type { ProspectStats } from "../queries";

const VALUE = "mt-3 text-[38px] leading-none font-semibold tracking-[-0.035em]";

export function ProspectStatsCards({ stats }: { stats: ProspectStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="adala-tile rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow">Prospectos totales</span>
          <Users className="size-[17px]" />
        </div>
        <p className={VALUE}>{stats.total.toLocaleString("es-MX")}</p>
      </div>

      <div className="adala-glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow text-muted-foreground">
            Ultimos 7 dias
          </span>
          <TrendingUp className="text-brand-blue-deep size-[17px]" />
        </div>
        <p className={VALUE}>{stats.ultimos7.toLocaleString("es-MX")}</p>
      </div>

      <div className="adala-glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow text-muted-foreground">Hoy</span>
          <CalendarDays className="text-brand-blue-deep size-[17px]" />
        </div>
        <p className={VALUE}>{stats.hoy.toLocaleString("es-MX")}</p>
      </div>

      <div className="adala-ink rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="adala-eyebrow text-[#9db6c8]">Aceptan marketing</span>
          <Megaphone className="size-[17px] text-[#8fd14f]" />
        </div>
        <p className={VALUE}>{stats.conMarketing.toLocaleString("es-MX")}</p>
      </div>
    </div>
  );
}
