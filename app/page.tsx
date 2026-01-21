import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center text-center gap-8 px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to DesAIgn
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Empower your creativity with a Vibe Design tool. Join us today to start building the future.
        </p>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
