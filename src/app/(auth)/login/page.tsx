import { Suspense } from "react";
import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { LoginForm } from "./login-form";

// El layout raiz ya aplica el template "%s · Adala".
export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Panel Adala</CardTitle>
          <CardDescription>
            Entra con la cuenta que tengas dada de alta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* useSearchParams necesita un Suspense para no bloquear el prerender. */}
          <Suspense fallback={<Skeleton className="h-56 w-full" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
