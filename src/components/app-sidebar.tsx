"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  SquareKanban,
  Users,
} from "lucide-react";

import { logout } from "@/app/(auth)/login/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Agregar un modulo = una entrada aqui, su carpeta en `src/features/` y su
 * ruta en `src/app/(dashboard)/`. No hay nada mas que registrar.
 */
const MODULES = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/prospectos", label: "Prospectos", icon: Users },
  { href: "/seguimiento", label: "Seguimiento", icon: SquareKanban },
] as const;

type SidebarProps = {
  name: string;
  email: string;
  prospectCount: number;
};

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-ink-muted px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase">
      {children}
    </span>
  );
}

function SidebarBody({ name, email, prospectCount, onNavigate }: SidebarProps & {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-2.5 px-2 py-1">
        <Image
          src="/app-logo.png"
          alt=""
          width={32}
          height={32}
          className="size-8"
          priority
        />
        <span className="text-base font-semibold tracking-[0.05em]">ADALA</span>
        <ThemeToggle className="text-ink-muted ml-auto hover:bg-white/6 hover:text-[var(--ink-foreground)]" />
      </div>

      <div className="flex flex-col gap-1">
        <GroupLabel>Modulos</GroupLabel>
        {MODULES.map((item) => {
          // "/" solo marca activo en exacto: con startsWith se encenderia siempre.
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-[42px] items-center gap-2.5 rounded-xl px-3 text-sm transition-colors",
                active
                  ? "adala-accent font-semibold"
                  : "text-[#9db6c8] hover:bg-white/6 hover:text-[var(--ink-foreground)]",
              )}
            >
              <item.icon className="size-[17px]" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/prospectos" ? (
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    active ? "opacity-70" : "text-ink-muted",
                  )}
                >
                  {prospectCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex items-center gap-2.5 rounded-xl bg-white/6 p-2.5">
        <span
          className="flex size-[30px] shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          style={{
            background: "linear-gradient(140deg, var(--brand-blue), var(--brand-green))",
            color: "var(--accent-gradient-on)",
          }}
        >
          {initials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{name}</p>
          <p className="text-faint truncate text-[11px]">{email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Cerrar sesion"
            className="text-ink-muted hover:text-[var(--ink-foreground)] flex size-7 items-center justify-center rounded-lg transition-colors"
          >
            <LogOut className="size-[15px]" />
          </button>
        </form>
      </div>
    </>
  );
}

export function AppSidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Escritorio: el sidebar flota como widget dentro de la malla. */}
      <aside className="adala-ink sticky top-3.5 m-3.5 mr-0 hidden h-[calc(100svh-1.75rem)] w-[238px] shrink-0 flex-col gap-5 rounded-[20px] p-[18px_14px] md:flex">
        <SidebarBody {...props} />
      </aside>

      {/* Movil: mismo contenido dentro de un panel. */}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-3 px-4 pt-4 md:hidden">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <Image src="/app-logo.png" alt="" width={24} height={24} className="size-6" />
          <span className="text-sm font-semibold tracking-[0.05em]">ADALA</span>
        </div>
        <SheetContent
          side="left"
          className="adala-ink flex w-[260px] flex-col gap-5 border-0 p-[18px_14px]"
        >
          <SheetTitle className="sr-only">Navegacion</SheetTitle>
          <SidebarBody {...props} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
