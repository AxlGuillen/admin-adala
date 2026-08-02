"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
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

/** Boton de icono sobre la superficie de tinta. */
const INK_ICON_BUTTON =
  "text-ink-muted flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 hover:text-[var(--ink-foreground)]";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-ink-muted px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase">
      {children}
    </span>
  );
}

function SidebarBody({
  name,
  email,
  prospectCount,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarProps & {
  collapsed?: boolean;
  /** Solo en escritorio; el panel movil no colapsa. */
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2.5 px-2 py-1",
          collapsed && "flex-col gap-3 px-0",
        )}
      >
        <Image
          src="/app-logo.png"
          alt=""
          width={32}
          height={32}
          className="size-8"
          priority
        />
        {!collapsed ? (
          <span className="text-base font-semibold tracking-[0.05em]">ADALA</span>
        ) : null}
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
            aria-expanded={!collapsed}
            className={cn(INK_ICON_BUTTON, "size-8", !collapsed && "ml-auto")}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        {!collapsed ? <GroupLabel>Modulos</GroupLabel> : null}
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
              // Colapsado no hay texto: el title hace de tooltip.
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex h-[42px] items-center gap-2.5 rounded-xl px-3 text-sm transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "adala-accent font-semibold"
                  : "text-[#9db6c8] hover:bg-white/6 hover:text-[var(--ink-foreground)]",
              )}
            >
              <item.icon className="size-[17px] shrink-0" />
              {!collapsed ? (
                <span className="flex-1 truncate">{item.label}</span>
              ) : null}
              {!collapsed && item.href === "/prospectos" ? (
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

      {collapsed ? (
        <div className="mt-auto flex flex-col items-center gap-1.5 rounded-xl bg-white/6 p-2">
          <ThemeToggle className={INK_ICON_BUTTON} />
          <span
            title={`${name} · ${email}`}
            className="flex size-[30px] items-center justify-center rounded-full text-xs font-semibold"
            style={{
              background:
                "linear-gradient(140deg, var(--brand-blue), var(--brand-green))",
              color: "var(--accent-gradient-on)",
            }}
          >
            {initials(name)}
          </span>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Cerrar sesion"
              className={cn(INK_ICON_BUTTON, "size-8")}
            >
              <LogOut className="size-[15px]" />
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/6 p-2.5">
          <span
            className="flex size-[30px] shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              background:
                "linear-gradient(140deg, var(--brand-blue), var(--brand-green))",
              color: "var(--accent-gradient-on)",
            }}
          >
            {initials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{name}</p>
            <p className="text-faint truncate text-[11px]">{email}</p>
          </div>
          {/* La gota del toggle nace del boton: al vivir aqui abajo, el reveal
              sale desde la esquina inferior izquierda. */}
          <ThemeToggle className={cn(INK_ICON_BUTTON, "size-7 shrink-0")} />
          <form action={logout} className="shrink-0">
            <button
              type="submit"
              aria-label="Cerrar sesion"
              className={cn(INK_ICON_BUTTON, "size-7")}
            >
              <LogOut className="size-[15px]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export function AppSidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Escritorio: el sidebar flota como widget dentro de la malla y colapsa
          a un riel de iconos. */}
      <aside
        className={cn(
          "adala-ink sticky top-3.5 m-3.5 mr-0 hidden h-[calc(100svh-1.75rem)] shrink-0 flex-col gap-5 overflow-hidden rounded-[20px] transition-[width] duration-300 md:flex",
          collapsed ? "w-[68px] p-[18px_10px]" : "w-[238px] p-[18px_14px]",
        )}
      >
        <SidebarBody
          {...props}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
        />
      </aside>

      {/* Movil: mismo contenido dentro de un panel; aqui no hay colapso. */}
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
