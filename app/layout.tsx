import type { Metadata } from "next";
import { Elms_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from '@vercel/analytics/next';

const elmsSans = Elms_Sans({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "desAIgn AI desginer: Websites, app & prototypes",
  description: "Design high-performing websites & apps using your words.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${elmsSans.className}`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
