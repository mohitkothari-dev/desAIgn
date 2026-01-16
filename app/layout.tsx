import type { Metadata } from "next";
import { Elms_Sans } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${elmsSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
