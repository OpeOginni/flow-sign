import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";

// https://tone-row.com/blog/drizzle-orm-quickstart-tutorial-first-impressions

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: "./src/drizzle/migrations" })
  .then(() => {
    console.log("Migrations complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migrations failed!", err);
    process.exit(1);
  });
