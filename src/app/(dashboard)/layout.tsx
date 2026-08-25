import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="pt-16 lg:pt-0 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
