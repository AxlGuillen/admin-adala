"use client";

import { useTransition } from "react";
import { debounce, useQueryStates } from "nuqs";
import { Search, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { SERVICE_TYPES, SERVICE_TYPE_VALUES } from "../constants";
import { PERIOD_LABELS, PERIODS, prospectsFilters } from "../search-params";

/** Control del diseno: 36px de alto, esquina de 10px y anillo interior. */
const CONTROL =
  "h-9 rounded-[10px] bg-[var(--glass-field)] px-3 text-[13px] shadow-[inset_0_0_0_1px_var(--hairline)] border-0 focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

export function ProspectsFilters({ states }: { states: string[] }) {
  const [isPending, startTransition] = useTransition();

  // shallow: false hace que el Server Component vuelva a consultar Supabase.
  const [filters, setFilters] = useQueryStates(prospectsFilters, {
    shallow: false,
    startTransition,
  });

  // Cualquier cambio de filtro vuelve a la pagina 1: si no, se puede quedar en
  // una pagina que ya no existe y la tabla sale vacia sin razon aparente.
  const update = (patch: Partial<typeof filters>) =>
    setFilters({ ...patch, pagina: 1 });

  const hasFilters =
    filters.q !== "" ||
    filters.servicio !== "todos" ||
    filters.estado !== "todos" ||
    filters.periodo !== "todo";

  return (
    <div className="adala-glass-soft flex flex-wrap items-center gap-2.5 rounded-2xl p-2.5">
      <div className="relative min-w-[220px] flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2" />
        <input
          value={filters.q}
          // Sin debounce, cada tecla dispara una consulta a Supabase.
          onChange={(event) =>
            setFilters(
              { q: event.target.value, pagina: 1 },
              { limitUrlUpdates: debounce(400) },
            )
          }
          placeholder="Nombre, telefono, email o ciudad"
          aria-label="Buscar prospectos"
          className={cn(CONTROL, "w-full pl-9 outline-none")}
        />
      </div>

      <Select
        value={filters.servicio}
        onValueChange={(value) => update({ servicio: value })}
      >
        <SelectTrigger
          className={cn(CONTROL, "w-full sm:w-[190px]")}
          aria-label="Filtrar por servicio"
        >
          <SelectValue placeholder="Servicio" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los servicios</SelectItem>
          {SERVICE_TYPE_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {SERVICE_TYPES[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.estado}
        onValueChange={(value) => update({ estado: value })}
      >
        <SelectTrigger
          className={cn(CONTROL, "w-full sm:w-[170px]")}
          aria-label="Filtrar por estado"
        >
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.periodo}
        onValueChange={(value) =>
          update({ periodo: value as (typeof PERIODS)[number] })
        }
      >
        <SelectTrigger
          // El periodo activo va en tinta: es el filtro que siempre esta puesto.
          className={cn(
            CONTROL,
            "w-full font-medium sm:w-[165px]",
            "bg-[var(--ink)] text-[var(--ink-foreground)] shadow-none",
          )}
          aria-label="Filtrar por periodo"
        >
          <SelectValue placeholder="Periodo" />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period} value={period}>
              {PERIOD_LABELS[period]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <button
          type="button"
          onClick={() =>
            setFilters({
              q: "",
              servicio: "todos",
              estado: "todos",
              periodo: "todo",
              pagina: 1,
            })
          }
          className="text-muted-foreground hover:text-foreground flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[13px] transition-colors"
        >
          <X className="size-3.5" />
          Limpiar
        </button>
      ) : null}

      {isPending ? (
        <Spinner className="text-muted-foreground size-4" />
      ) : null}
    </div>
  );
}
