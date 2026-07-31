"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const FIELD =
  "h-[42px] w-full rounded-xl border border-[var(--input)] bg-[var(--glass-field)] px-[13px] text-sm text-foreground outline-none shadow-[inset_0_1px_2px_rgba(13,34,51,0.05)] transition-shadow placeholder:text-[var(--faint)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:shadow-none";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-[22px] flex flex-col gap-3.5">
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[12.5px] font-medium">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@adala.mx"
          className={FIELD}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[12.5px] font-medium">
          Contrasena
        </label>
        <div className="relative flex items-center">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={cn(FIELD, "pr-[42px]")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            // Boton de solo icono: sin aria-label no tiene nombre accesible, y
            // aria-pressed comunica el estado del toggle.
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            aria-pressed={showPassword}
            className="text-muted-foreground absolute right-2 flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(13,34,51,0.06)] dark:hover:bg-white/8"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="adala-accent mt-1 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-70"
      >
        {isPending ? <Spinner className="size-4" /> : null}
        Entrar
      </button>
    </form>
  );
}
