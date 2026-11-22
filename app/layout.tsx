import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegistration from "./components/PWARegistration";

export const viewport: Viewport = {\n  width: "device-width",\n  initialScale: 1,\n  maximumScale: 1,\n  minimumScale: 1,\n  userScalable: false,\n  viewportFit: "cover",\n};\n\nexport const metadata: Metadata = {
  title: "TREAN AI — Persistent Learning Agent",
  description: "Turn educational videos into your personal, searchable knowledge base.",
  manifest: "/manifest.json",
  applicationName: "TREAN AI",
  appleWebApp: { capable: true, title: "TREAN AI", statusBarStyle: "black-translucent" },
  icons: { icon: [{ url: "/icons/trean-ai.svg", type: "image/svg+xml" }], apple: [{ url: "/icons/trean-ai.svg", type: "image/svg+xml" }] },
  themeColor: "#12091f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PWARegistration/>{children}</body></html>;
}