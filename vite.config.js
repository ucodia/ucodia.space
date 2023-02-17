import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    sourcemap: true,
    rollupOptions: { output: { manualChunks: { p5: ["p5", "p5.js-svg"] } } },
  },
  esbuild: {
    // This resolves unsafe-eval CSP violation caused by regenerator
    // https://github.com/facebook/regenerator/issues/378
    banner: "var regeneratorRuntime;",
  },
});
