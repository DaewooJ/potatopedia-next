// Apply db/schema.sql to Neon. Usage: node --env-file=.env.local scripts/db-apply.mjs
import { readFileSync } from "node:fs";
import { Pool } from "@neondatabase/serverless";
const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL });
await pool.query(readFileSync("db/schema.sql", "utf8"));
const { rows } = await pool.query("select table_name from information_schema.tables where table_schema='public' order by 1");
console.log(rows.map((r) => r.table_name).join(", "));
await pool.end();
