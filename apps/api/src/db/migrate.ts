import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../lib/db.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

async function createMigrationsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Migrations table created successfully");
  } catch (error) {
    console.error("❌ Failed to create migrations table:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function runMigration(filename: string) {
  const client = await pool.connect();
  try {
    // Check if migration has already been run
    const checkResult = await client.query(
      "SELECT name FROM migrations WHERE name = $1",
      [filename],
    );

    if (checkResult.rows.length > 0) {
      console.log(`⏭️  Migration ${filename} already executed, skipping`);
      return;
    }

    const filePath = join(__dirname, "migrations", filename);
    const sql = await readFile(filePath, "utf-8");

    // Start a transaction
    await client.query("BEGIN");

    try {
      // Run the migration
      await client.query(sql);
      await client.query("INSERT INTO migrations (name) VALUES ($1)", [
        filename,
      ]);
      await client.query("COMMIT");
      console.log(`✅ Migration ${filename} completed successfully`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error(`❌ Migration ${filename} failed:`, error);
    throw error;
  } finally {
    client.release();
  }
}

export async function migrate() {
  // First, ensure migrations table exists
  await createMigrationsTable();

  // Get all migration files and sort them by their numeric prefix
  const migrationsDir = join(__dirname, "migrations");
  const files = await readdir(migrationsDir);
  const migrationFiles = files
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => {
      const numA = Number.parseInt(a.split("_")[0] ?? "0");
      const numB = Number.parseInt(b.split("_")[0] ?? "0");
      return numA - numB;
    });

  // Run each migration in order
  for (const filename of migrationFiles) {
    await runMigration(filename);
  }
}
