
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
// We can't use authClient in server component for signOut directly, 
// usually we use a client component or form action.
// But for the "Sign Out" button standard is client component. 
// I'll make a client component wrapper or just a quick inline client component or just standard button with client handler.
// Actually, I'll make the whole page server component and a client component for the signout button for simplicity or just make the page client.
// Dashboard usually needs server data.
// Let's make a client component for the SignOutButton.

import SignOutButton from "@/components/sign-out-button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return redirect("/sign-in");
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Hello Dashboard</h1>
            <p className="mb-4">Welcome, {session.user.name}</p>
            <SignOutButton />
        </div>
    );
}
