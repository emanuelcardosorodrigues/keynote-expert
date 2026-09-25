import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/p/lps-slide-aula06/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/lps-slide-aula06"),
    emptyOutDir: true,
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    // Os assets de mídia (mp4/png dos slides) entram por import.meta.glob em
    // src/assets. Limite alto para o Rollup nunca tentar inline de um vídeo.
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("react-dom") || id.includes("/react/")) return "react";
          if (id.includes("motion")) return "motion";
          if (id.includes("@phosphor-icons")) return "icons";
          if (id.includes("node_modules")) return "vendor";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1200,
  },
  server: { port: 5202, host: "0.0.0.0" },
  preview: { port: 5202, host: "0.0.0.0" },
});
