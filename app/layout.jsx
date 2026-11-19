import "./globals.css";

export const metadata = {
  title: "TREAN AI — Learn from every video",
  description: "Turn YouTube videos into a personal AI-powered learning library."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}