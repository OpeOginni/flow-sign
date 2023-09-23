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
  ssl: process.env.DB_SSL === "false",
  max: 1,
};

// LOCAL
const localConnectionDetails: postgres.Options<{}> = {
  host: process.env.LOCAL_PGHOST,
  database: process.env.LOCAL_PGDATABASE,
  username: process.env.LOCAL_PGUSER,
  password: process.env.LOCAL_PGPASSWORD,
  max: 1,
};

const localConnectionURL = process.env.LOCAL_CONNECTION_URL!;

// for migrations
// const migrationClient = postgres(connectionDetails);
// migrate(drizzle(migrationClient), "./src/drizzle")

// for query purposes
// const queryClient = postgres(localConnectionURL, {
//   ssl: false,
//   connect_timeout: 10000,
// });

// for query purposes
const queryClient = postgres(localConnectionDetails);
export const db: PostgresJsDatabase = drizzle(queryClient);
