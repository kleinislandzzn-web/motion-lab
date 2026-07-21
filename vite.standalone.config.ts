import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: resolve(process.cwd(), "standalone"),
  base: "./",
  plugins: [react(), viteSingleFile()],
  build: {
    emptyOutDir: false,
    outDir: resolve(process.cwd(), "dist"),
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(process.cwd(), "standalone/motion-lab.html"),
      output: { inlineDynamicImports: true },
    },
  },
});
