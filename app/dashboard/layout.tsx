import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import type { Metadata } from "next";
import { SidebarProvider } from "@/components/SidebarContext";

export const metadata: Metadata = {
  title: "Dashboard - DevScope",
  description: "Your project management dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen ">
      <SidebarProvider>
        <Sidebar />
        <Topbar />
        <main className="ml-0 md:ml-64 pt-16 transition-[margin] duration-300">{children}</main>
      </SidebarProvider>
     </div>
  );
}
