import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout ({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers:await headers()
    });

    if (!session?.user) redirect("/login");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64">
                <Navbar user={session.user} />
                <div className="flex-1 p-6">{children}</div>
            </div>
        </div>
    );
}
