import type { MetadataRoute } from "next";

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "ANSIOFF - Tu calma en el bolsillo",
        short_name: "ANSIOFF",
        description: "Guía inmediata y herramientas para crisis de pánico y ansiedad generalizada.",
        start_url: "/",
        display: "standalone",
        background_color: "#040208",
        theme_color: "#040208",
        orientation: "portrait",
        scope: "/",
        icons: [
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            }
        ],
    };
}
