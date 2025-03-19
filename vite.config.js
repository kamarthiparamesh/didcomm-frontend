import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm"; // Handles WebAssembly in Vite
import topLevelAwait from "vite-plugin-top-level-await"; // Enables `await` in top-level scope

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  build: {
    target: "esnext", // Ensures modern ES module support
  },
  resolve: {
    alias: {
      buffer: "buffer/",
      crypto: "crypto-browserify",
    },
  },
  define: {
    global: {},
  },
});
