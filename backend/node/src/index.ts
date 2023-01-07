import initialize from "./app"
import { runMigrations } from "./db";

(
    async () => {
        await runMigrations();
        await initialize();
    }
)();