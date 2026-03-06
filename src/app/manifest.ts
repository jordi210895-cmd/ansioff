import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "ANSIOFF - Tu calma en el bolsillo",
        short_name: "ANSIOFF",
        description: "Guía inmediata y herramientas para crisis de pánico y ansiedad generalizada.",
        start_url: "/",
        display: "standalone",
        background_color: "#020617", // slate-950
        theme_color: "#020617",
        icons: [
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}
