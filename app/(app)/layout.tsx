import { redirect } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import { authServer } from "@/lib/auth/auth-server";
import "./app-layout.css";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await authServer.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="app-container">
            <main className="app-main">{children}</main>
            <Navigation />
        </div>
    );
}
