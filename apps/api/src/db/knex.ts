import knex, { type Knex } from "knex";
import config from "./config.js";

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment];

if (!dbConfig) {
  throw new Error(
    `No database configuration found for environment: ${environment}`,
  );
}

const db: Knex = knex(dbConfig);

export default db;
