import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/PolygonVisualizer/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
