import { AppSidebar } from "@/components/app-sidebar";
import { getProspectCount } from "@/features/prospects/queries";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Unica puerta de acceso del panel: si el usuario no esta en la allowlist,
  // esto redirige antes de renderizar cualquier dato.
  const admin = await requireAdmin();
  const prospectCount = await getProspectCount();

  return (
    <div className="adala-mesh flex min-h-svh">
      <AppSidebar
        name={admin.profile.full_name ?? admin.email}
        email={admin.email}
        prospectCount={prospectCount}
      />
      <main className="min-w-0 flex-1 px-4 pt-4 pb-6 md:px-6 md:pt-[22px] md:pb-[26px]">
        {children}
      </main>
    </div>
  );
}
