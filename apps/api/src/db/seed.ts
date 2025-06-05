import "dotenv/config";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../lib/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runSeed(filename: string) {
  const client = await pool.connect();
  try {
    const filePath = join(__dirname, "seeds", filename);
    const sql = await readFile(filePath, "utf-8");
    await client.query(sql);
    console.log(`✅ Seed ${filename} completed successfully`);
  } catch (error) {
    console.error(`❌ Seed ${filename} failed:`, error);
    throw error;
  } finally {
    client.release();
  }
}

async function seed() {
  try {
    // Get all seed files and sort them by their numeric prefix
    const seedsDir = join(__dirname, "seeds");
    const files = await readdir(seedsDir);
    const seedFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => {
        const numA = Number.parseInt(a.split("_")[0] ?? "0");
        const numB = Number.parseInt(b.split("_")[0] ?? "0");
        return numA - numB;
      });

    // Run each seed in order
    for (const filename of seedFiles) {
      await runSeed(filename);
    }

    console.log("✅ Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

seed();
