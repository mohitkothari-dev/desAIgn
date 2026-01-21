"use client";

import { useTheme } from "next-themes";
import Logo from "../../components/logo";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const userInitials = session?.user?.name
  ?.split(' ')
  .map((n) => n[0])
  .join('')
  .toUpperCase()
  .slice(0, 2);

  const handleSignOut = async () => {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.push("/sign-in");
            }
        }
    });
};

  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="h-16 border-b bg-background">
        <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between">
          <Logo />
          <div className="flex flex-1 items-center justify-end gap-3">
            <Button 
            className="relative rounded-full h-8 w-8 hover:cursor-pointer"
            variant="outline" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")}>
              <SunIcon className={cn("absolute h-5 w-5 transition", isDark ? "scale-100" : "scale-0")} />
              <MoonIcon className={cn("absolute h-5 w-5 transition", isDark ? "scale-0" : "scale-100")} />
            </Button>
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <p>Howdy, {session?.user.name.split(" ")[0]}</p>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header