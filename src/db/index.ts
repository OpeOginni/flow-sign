import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// PROD
const connectionDetails: postgres.Options<{}> = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.DB_SSL! === "true",
  max: 1,
};

// const localConnectionURL = process.env.LOCAL_CONNECTION_URL!;

// for migrations
// const migrationClient = postgres(connectionDetails);
// migrate(drizzle(migrationClient), "./src/drizzle/migrations");

// for query purposes
// const queryClient = postgres(localConnectionURL, {
//   ssl: false,
//   connect_timeout: 10000,
// });

const queryClient = postgres(connectionDetails);

// for query purposes
export const db: PostgresJsDatabase = drizzle(queryClient);
