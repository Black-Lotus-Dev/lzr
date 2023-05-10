import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: true,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1906,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@api": resolve(__dirname, "./src/api"),
      "@assets": resolve(__dirname, "./src/assets"),
      "@components": resolve(__dirname, "./src/components"),
      "@configs": resolve(__dirname, "./src/configs"),
      "@constants": resolve(__dirname, "./src/constants"),
      "@lzrClients": resolve(__dirname, "./src/lzrClients"),
      "@lzrTypes": resolve(__dirname, "./src/types"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@provider": resolve(__dirname, "./src/provider"),
      "@redux": resolve(__dirname, "./src/redux"),
      "@styles": resolve(__dirname, "./src/styles"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, "index.html"),
    //   },
    // },
  },
});
