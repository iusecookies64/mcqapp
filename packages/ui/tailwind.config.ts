import { Config } from "tailwindcss";
import sharedConfig from "@mcqapp/tailwind-config";

const config: Partial<Config> = {
  presets: [sharedConfig],
};

export default config;
