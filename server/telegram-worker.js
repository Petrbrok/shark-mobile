import { pool } from "./db.js";
import { startTelegramPolling } from "./telegram.js";

startTelegramPolling()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
