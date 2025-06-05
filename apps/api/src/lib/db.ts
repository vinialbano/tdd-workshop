import { Pool } from "pg";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
const pool = new Pool({ connectionString });

export async function getMessages() {
  const result = await pool.query(
    "SELECT id, content FROM Messages ORDER BY id",
  );
  return result.rows;
}

export default pool;
