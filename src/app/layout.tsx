import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ANSIOFF - Diario y pausas",
  description: "Diario personal, sonidos y rutinas para ordenar ideas y crear pausas.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ANSIOFF",
    startupImage: [
      {
        url: "/logo.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#040208",
};

const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const oneSignalSafariWebId = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID;

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
        {oneSignalAppId && (
          <>
            <Script
              src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
              strategy="afterInteractive"
            />
            <Script id="onesignal-init" strategy="afterInteractive">
              {`
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                OneSignalDeferred.push(async function(OneSignal) {
                  await OneSignal.init({
                    appId: ${JSON.stringify(oneSignalAppId)},
                    safari_web_id: ${JSON.stringify(oneSignalSafariWebId || undefined)},
                    notifyButton: {
                      enable: false,
                    },
                  });
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
