import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import type { ForgeConfig } from "@electron-forge/shared-types";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    name: "From Earth",
    icon: "./assets/icon",
    appBundleId: "com.owfdr.from-earth",
    executableName: "from-earth", // required for linux
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: "https://github.com/owfdr/from-earth/blob/main/assets/icon.ico",
      setupIcon: "./assets/icon.ico",
    }),
    new MakerZIP({}, ["darwin", "win32"]),
    new MakerRpm({
      options: {
        icon: "./assets/icon.png",
        productName: "From Earth",
        description: "Explore beautiful places",
        productDescription:
          "Discover breathtaking images of our blue planet. Transform your device with captivating landscapes.",
        categories: ["Utility"],
      },
    }),
    new MakerDeb({
      options: {
        icon: "./assets/icon.png",
        productName: "From Earth",
        description: "Explore beautiful places",
        productDescription:
          "Discover breathtaking images of our blue planet. Transform your device with captivating landscapes.",
        categories: ["Utility"],
      },
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devContentSecurityPolicy:
        "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; img-src *; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
