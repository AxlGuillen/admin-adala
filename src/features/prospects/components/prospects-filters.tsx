"use client";

import { useTransition } from "react";
import { debounce, useQueryStates } from "nuqs";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { SERVICE_TYPES, SERVICE_TYPE_VALUES } from "../constants";
import { PERIOD_LABELS, PERIODS, prospectsFilters } from "../search-params";

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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={filters.q}
          // Sin debounce, cada tecla dispara una consulta a Supabase.
          onChange={(event) =>
            setFilters(
              { q: event.target.value, pagina: 1 },
              { limitUrlUpdates: debounce(400) },
            )
          }
          placeholder="Nombre, telefono, email o ciudad"
          className="pl-9"
          aria-label="Buscar prospectos"
        />
      </div>

      <Select
        value={filters.servicio}
        onValueChange={(value) => update({ servicio: value })}
      >
        <SelectTrigger className="w-full sm:w-52" aria-label="Filtrar por servicio">
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
        <SelectTrigger className="w-full sm:w-48" aria-label="Filtrar por estado">
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
        <SelectTrigger className="w-full sm:w-44" aria-label="Filtrar por periodo">
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
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              q: "",
              servicio: "todos",
              estado: "todos",
              periodo: "todo",
              pagina: 1,
            })
          }
        >
          <X /> Limpiar
        </Button>
      ) : null}

      {isPending ? <Spinner className="text-muted-foreground size-4" /> : null}
    </div>
  );
}
