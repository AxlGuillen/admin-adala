import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { logout } from "../login/actions";

export const metadata: Metadata = { title: "Sin acceso" };

export default function SinAccesoPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Tu cuenta no tiene acceso</CardTitle>
          <CardDescription>
            Iniciaste sesion correctamente, pero este usuario no esta en la lista
            de administradores del panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              Cerrar sesion
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
