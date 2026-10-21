import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  publicDir: false,
  define: { "import.meta.env.VITE_USE_STATIC": JSON.stringify("true") },
  resolve: {
    alias: {
      "react-cookie": path.resolve("preview/cookieShim.js"),
      "@zegocloud/zego-uikit-prebuilt": path.resolve("preview/zegoStub.js"),
    },
  },
  build: { outDir: "dist-preview", assetsInlineLimit: 100000000 },
});
