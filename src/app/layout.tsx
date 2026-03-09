import type { Metadata } from "next";
import { Outfit, Gilda_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const gildaDisplay = Gilda_Display({
  variable: "--font-gilda",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ANSIOFF - Tu calma en el bolsillo",
  description: "Guía inmediata y herramientas para crisis de pánico y ansiedad generalizada.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#020617",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${outfit.variable} ${gildaDisplay.variable} antialiased screen-px`}
      >
        {children}
      </body>
    </html>
  );
}
