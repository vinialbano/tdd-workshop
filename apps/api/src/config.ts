import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as dotenvConfig } from "dotenv";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

dotenvConfig({
  path: join(__dirname, "..", ".env"),
});

export const config = {
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 4000,
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
