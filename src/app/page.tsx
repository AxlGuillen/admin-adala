import { redirect } from "next/navigation";

export default function HomePage() {
  // El proxy ya mando a /login si no hay sesion, asi que aqui solo entra
  // alguien autenticado.
  redirect("/prospectos");
}
