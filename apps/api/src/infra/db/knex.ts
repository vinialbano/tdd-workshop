import knex, { type Knex } from "knex";
import { config } from "../../config.js";

export const db: Knex = knex(config.database);
