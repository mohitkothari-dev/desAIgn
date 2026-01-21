import Header from "../_shared/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>{children}</main>
        </div>
    );
}
