"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.email({ message: "Escribe un correo valido" }),
  password: z.string().min(1, "Escribe tu contrasena"),
});

export type LoginState = { error: string | null };

/**
 * Solo acepta rutas internas. Sin esto, `?next=https://otro-sitio.com` convierte
 * el login en un redirector abierto para phishing.
 */
function safeNext(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/prospectos";
  }
  return next;
}

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Mensaje generico a proposito: no revelamos si el correo existe.
    return { error: "Correo o contrasena incorrectos" };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next") as string | null));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
