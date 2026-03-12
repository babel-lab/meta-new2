import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { glob } from "glob";
import liveReload from "vite-plugin-live-reload";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

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
  const BASE_URL = command === "serve" ? "/" : "/meta-new2/";

  return {
    base: BASE_URL,

    plugins: [
      liveReload([
        "./layout/**/*.ejs",
        "./pages/**/*.ejs",
        "./pages/**/*.html",
      ]),

      ViteEjsPlugin(
        {
          BASE_URL,
        },
        {
          ejs: {
            root: projectRoot,
            views: [projectRoot],
          },
        },
      ),

      moveOutputPlugin(),
    ],

    server: {
      open: "pages/index.html",
    },

    css: {
      devSourcemap: true,
    },

    build: {
      minify: false,
      cssMinify: false,
      sourcemap: false,

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
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: (assetInfo) => {
            const ext = path.extname(assetInfo.name || "");

            if (ext === ".css") return "assets/[name].css";
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
