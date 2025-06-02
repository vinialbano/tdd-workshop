import { createApp } from "./app.js";
import { config } from "./config.js";

async function startServer() {
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`Server is running on: http://localhost:${config.port}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
