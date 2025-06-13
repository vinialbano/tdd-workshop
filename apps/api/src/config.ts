import { config as dotenvConfig } from "dotenv";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

dotenvConfig({
  path: join(__dirname, "..", ".env"),
});

export const config = {
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
} as const;
