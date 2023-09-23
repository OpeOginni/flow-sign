import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // LOCAL
    host: process.env.LOCAL_PGHOST!,
    database: process.env.LOCAL_PGDATABASE!,
    user: process.env.LOCAL_PGUSER!,
    password: process.env.LOCAL_PGPASSWORD!,
    // connectionString: process.env.LOCAL_CONNECTION_URL!,
  },
} satisfies Config;
