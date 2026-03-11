import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
        className={`${dmSans.variable} ${dmSerif.variable} antialiased screen-px font-sans`}
      >
        {children}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "SU_APP_ID_AQUI",
                safari_web_id: "web.onesignal.auto.SU_SAFARI_ID",
                notifyButton: {
                  enable: false,
                },
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
