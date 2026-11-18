import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TREAN AI — Persistent Learning Agent",
  description: "Turn educational videos into your personal, searchable knowledge base.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}