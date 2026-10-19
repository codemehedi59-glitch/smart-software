import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const isWebBuild = process.env.BUILD_TARGET === "web";

export default defineConfig({
  plugins: [
    react(),
    ...(isWebBuild
      ? [
          VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["icon-192.png", "icon-512.png"],
            manifest: {
              name: "Smart Diagnostic Center",
              short_name: "Smart Diagnostic",
              description: "Smart Diagnostic Center Reception Manager",
              theme_color: "#0B8F79",
              background_color: "#F5F8F7",
              display: "standalone",
              start_url: "/",
              scope: "/",
              icons: [
                {
                  src: "/icon-192.png",
                  sizes: "192x192",
                  type: "image/png",
                  purpose: "any maskable",
                },
                {
                  src: "/icon-512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "any maskable",
                },
              ],
            },
            workbox: {
              navigateFallback: "/index.html",
              globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
            },
          }),
        ]
      : []),
  ],
  server: {
    host: "127.0.0.1",
    port: 5174,
  },
  base: isWebBuild ? "/" : "./",
});
