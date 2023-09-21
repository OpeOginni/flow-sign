import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from "dotenv";

dotenv.config();
const connectionDetails: postgres.Options<{}> = {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.DB_SSL === 'true',
    max: 1,
};

// for migrations
// const migrationClient = postgres(connectionDetails);
// migrate(drizzle(migrationClient), "./src/drizzle")

// for query purposes
const queryClient = postgres(connectionDetails);
export const db: PostgresJsDatabase = drizzle(queryClient);