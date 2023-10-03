import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // connectionString: process.env.LOCAL_CONNECTION_URL!,
    host: process.env.PGHOST!,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE!,
    ssl: process.env.DB_SSL! === "true",
  },
} satisfies Config;
