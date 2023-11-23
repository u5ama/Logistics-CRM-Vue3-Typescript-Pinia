import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const definePathAlias = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

const dashboardAliases = {
  "@dashboard": definePathAlias("./src/components/dashboard"),
  "@dashboard-views": definePathAlias(
    "./src/components/dashboard/portal/views"
  ),
  "@dashboard-widgets": definePathAlias("./src/components/dashboard/widgets"),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": definePathAlias("./src"),
      "@assets": definePathAlias("./src/assets"),
      "@images": definePathAlias("./src/assets/images"),
      "@files": definePathAlias("./src/assets/file"),
      "@components": definePathAlias("./src/components"),
      "@hooks": definePathAlias("./src/hooks"),
      "@layouts": definePathAlias("./src/components/layouts"),
      "@router": definePathAlias("./src/router"),
      "@stores": definePathAlias("./src/stores"),
      "@app-types": definePathAlias("./src/types"),
      "@utils": definePathAlias("./src/utils"),
      "@views": definePathAlias("./src/views"),
      ...dashboardAliases,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@assets/globals.scss";\n`,
      },
    },
  },
  optimizeDeps: {
    include: ["@fawmi/vue-google-maps", "fast-deep-equal"],
  },
});
