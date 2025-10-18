import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://gevy.vercel.app",
  output: 'server',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    port: 8080,
    host: true,
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  experimental: {
    clientPrerender: true,
  },

  image: {
    domains: ["avatars.githubusercontent.com"],
  }
});