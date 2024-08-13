import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { qrcode } from "vite-plugin-qrcode";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  plugins: [mdx(), react(), svgr(), qrcode()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
  esbuild: {
    // This resolves unsafe-eval CSP violation caused by regenerator
    // https://github.com/facebook/regenerator/issues/378
    banner: "var regeneratorRuntime;",
  },
});
