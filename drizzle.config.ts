import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        // host: process.env.PGHOST!,
        // database: process.env.PGDATABASE!,
        // user: process.env.PGUSER!,
        // password: process.env.PGPASSWORD!,
        // ssl: true,
        connectionString: process.env.LOCAL_CONNECTION_URL!,
    },
} satisfies Config;
