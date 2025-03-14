import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  // Use this to make the extension work in MV3
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3001,
    },
  },
});
