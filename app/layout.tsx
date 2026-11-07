import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./styles.css";

export const metadata: Metadata = {
  title: "The Making of SMT — Sajid Mehmood Tariq",
  description: "A three-act interactive study in how things are made, by Sajid Mehmood Tariq.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
