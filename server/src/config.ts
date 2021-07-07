import { ClientConfig } from "pg";

const COMMON_DB_CONFIG: ClientConfig = {
  user: "eyala@live-query-poc",
  host: "",
  database: "live_query_poc",
  password: "aA123456",
  port: 5432,
};

export const PRIMARY_DB_CONFIG: ClientConfig = {
  ...COMMON_DB_CONFIG,
  host:
    "live-query-poc.postgres.database.azure.com" || process.env.PRIMARY_DB_HOST,
};

export const READ_REPLICA_1_DB_CONFIG: ClientConfig = {
  ...COMMON_DB_CONFIG,
  host:
    "live-query-poc.postgres.database.azure.com" ||
    process.env.READ_REPLICA_1_DB_HOST,
};
