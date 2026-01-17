
// Force TS update
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();
    return (
        <Button
            onClick={async () => {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/sign-in"); // redirect to sign-in after sign out
                        }
                    }
                });
            }}
        >
            Sign Out
        </Button>
    );
}
