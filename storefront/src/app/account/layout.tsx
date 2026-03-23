import { AccountNav } from "@/components/account/account-nav";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Account" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">My Account</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <AccountNav />
        </aside>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
