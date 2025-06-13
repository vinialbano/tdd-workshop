import { createApp } from "./app.js";
import { config } from "./config.js";
import { KnexMessageRepository } from "./infra/knex-message.repository.js";

async function startServer() {
  const app = createApp(new KnexMessageRepository());

  app.listen(config.port, () => {
    console.log(`Server is running on: http://localhost:${config.port}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
