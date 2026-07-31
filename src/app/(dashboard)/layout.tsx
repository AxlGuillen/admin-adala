import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Unica puerta de acceso del panel: si el usuario no esta en la allowlist,
  // esto redirige antes de renderizar cualquier dato.
  const admin = await requireAdmin();

  return (
    <SidebarProvider>
      <AppSidebar
        name={admin.profile.full_name ?? admin.email}
        email={admin.email}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
