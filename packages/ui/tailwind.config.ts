import { Config } from "tailwindcss";
import sharedConfig from "@mcqapp/tailwind-config";

const config: Pick<Config, "preset"> = {
  preset: sharedConfig,
};

export default config;
