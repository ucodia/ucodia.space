import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    sourcemap: true,
    rollupOptions: { output: { manualChunks: { p5: ["p5", "p5.js-svg"] } } },
  },
});
