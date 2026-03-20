import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ANSIOFF - Tu calma en el bolsillo",
  description: "Guía inmediata y herramientas para crisis de pánico y ansiedad generalizada.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#040208",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ANSIOFF",
  },
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
        className={`${plusJakartaSans.variable} antialiased font-[family-name:var(--font-plus-jakarta)] bg-[#040208] text-white`}
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
