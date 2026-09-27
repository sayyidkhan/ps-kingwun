import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = {
  title: "King Wun — Property Moves, Made Smarter",
  description:
    "King Wun combines market context, structured thinking, and strong negotiation to help clients navigate property across Sarawak and Singapore.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173e33",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600&family=Gelasio:ital,wght@0,400;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
