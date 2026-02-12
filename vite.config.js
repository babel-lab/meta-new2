import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { glob } from "glob";

import liveReload from "vite-plugin-live-reload";

/**
 * 將 pages/xxx.html 輸出成 dist/xxx.html
 * 不要保留 pages 資料夾層級（給 GitHub Pages 用）
 */
function moveOutputPlugin() {
  return {
    name: "move-output",
    enforce: "post",
    apply: "build",
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith("pages/")) {
          const newFileName = fileName.slice("pages/".length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    base: command === "serve" ? "/" : "/meta-new/",

    plugins: [
      liveReload([
        "./layout/**/*.ejs",
        "./pages/**/*.ejs",
        "./pages/**/*.html",
      ]),
      ViteEjsPlugin(),
      moveOutputPlugin(),
    ],

    server: {
      open: "pages/index.html",
    },

    css: {
      devSourcemap: true,
    },

    build: {
      minify: false, // JS 不壓縮
      cssMinify: false, // CSS 不壓縮
      sourcemap: true, // 可追 source（可拿掉）

      rollupOptions: {
        input: Object.fromEntries(
          glob
            .sync("pages/**/*.html")
            .map((file) => [
              path.relative(
                "pages",
                file.slice(0, file.length - path.extname(file).length),
              ),
              fileURLToPath(new URL(file, import.meta.url)),
            ]),
        ),

        output: {
          /**
           * JS 檔名固定（不加 hash）
           */
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",

          /**
           * CSS / 圖片 / 字體 也固定名稱
           */
          assetFileNames: (assetInfo) => {
            const ext = path.extname(assetInfo.name || "");

            if (ext === ".css") {
              return "assets/[name].css";
            }

            if (/\.(png|jpe?g|svg|gif|webp)$/i.test(ext)) {
              return "images/[name][extname]";
            }

            if (/\.(woff2?|ttf|otf)$/i.test(ext)) {
              return "fonts/[name][extname]";
            }

            return "assets/[name][extname]";
          },
        },
      },

      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
