import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { LoginForm } from "./login-form";

// El layout raiz ya aplica el template "%s · Adala".
export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="adala-mesh-auth flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-[396px] flex-col gap-3.5">
        <div className="adala-glass rounded-[20px] p-[26px]">
          <div className="flex items-center gap-3">
            <Image
              src="/adala-logo.png"
              alt=""
              width={40}
              height={40}
              className="size-10"
              priority
            />
            <div>
              <p className="text-lg font-semibold tracking-[-0.01em]">
                Panel Adala
              </p>
              <p className="text-muted-foreground text-[12.5px]">
                Entra con la cuenta que tengas dada de alta.
              </p>
            </div>
          </div>

          {/* useSearchParams necesita un Suspense para no bloquear el prerender. */}
          <Suspense fallback={<Skeleton className="mt-[22px] h-56 w-full" />}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="adala-ink flex items-center gap-2.5 rounded-[14px] px-3.5 py-3">
          <ShieldCheck className="size-4 shrink-0 text-[#8fd14f]" />
          <p className="text-[12px] leading-relaxed text-[#9db6c8]">
            Panel interno. El alta la hace un administrador desde Supabase; no hay
            registro publico.
          </p>
        </div>
      </div>
    </main>
  );
}
