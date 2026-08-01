import Image from "next/image";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

import { logout } from "../login/actions";

export const metadata: Metadata = { title: "Sin acceso" };

export default function SinAccesoPage() {
  return (
    <main className="adala-mesh-auth flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-[396px] flex-col gap-3.5">
        <div className="adala-glass rounded-[20px] p-[26px]">
          <div className="flex items-center gap-3">
            <Image
              src="/app-logo.png"
              alt=""
              width={40}
              height={40}
              className="size-10"
            />
            <div>
              <p className="text-lg font-semibold tracking-[-0.01em]">
                Tu cuenta no tiene acceso
              </p>
              <p className="text-muted-foreground text-[12.5px]">
                Iniciaste sesion, pero este usuario no esta en la lista de
                administradores.
              </p>
            </div>
          </div>

          <form action={logout} className="mt-[22px]">
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[var(--ink)] text-sm font-semibold text-[var(--ink-foreground)] transition-opacity hover:opacity-90"
            >
              Cerrar sesion
            </button>
          </form>
        </div>

        <div className="adala-ink flex items-center gap-2.5 rounded-[14px] px-3.5 py-3">
          <ShieldAlert className="size-4 shrink-0 text-[#8fd14f]" />
          <p className="text-[12px] leading-relaxed text-[#9db6c8]">
            Pide que te den de alta en la tabla de administradores desde Supabase.
          </p>
        </div>
      </div>
    </main>
  );
}
