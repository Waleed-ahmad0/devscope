import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import type { Metadata } from "next";

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
            <Sidebar  />
            <Topbar  />
            <main className="ml-64 pt-16">
                {children}
            </main>
        </div>
    );
}
