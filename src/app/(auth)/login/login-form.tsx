"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />

      <Field>
        <FieldLabel htmlFor="email">Correo</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@adala.mx"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Contrasena</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => setShowPassword((visible) => !visible)}
              // El boton es solo icono: sin aria-label no tiene nombre
              // accesible, y aria-pressed comunica el estado del toggle.
              aria-label={
                showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Spinner /> : null}
        Entrar
      </Button>
    </form>
  );
}
