import { ThemeProvider } from "@/components/theme-provider";
import { Elms_Sans } from "next/font/google";

const elmsSans = Elms_Sans({
  subsets: ["latin"],
});

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${elmsSans.className} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}