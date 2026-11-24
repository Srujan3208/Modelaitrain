import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegistration from "./components/PWARegistration";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "TREAN AI — Persistent Learning Agent",
  description: "Turn educational videos into your personal, searchable knowledge base.",
  manifest: "/manifest.json",
  applicationName: "TREAN AI",
  appleWebApp: { capable: true, title: "TREAN AI", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icons/trean-ai.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/trean-ai.svg", type: "image/svg+xml" }],
  },
  themeColor: "#12091f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
