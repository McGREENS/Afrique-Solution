import { createClient } from "@libsql/client";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.warn("Turso credentials not found, using local SQLite");
}

export const db = createClient(
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
    ? {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:local.db",
      }
);
