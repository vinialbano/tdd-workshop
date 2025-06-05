import "dotenv/config";
import { migrate } from "./migrate.js";

async function runMigrations() {
  try {
    await migrate();
    console.log("✅ Database migrations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database migrations failed:", error);
    process.exit(1);
  }
}

runMigrations();
