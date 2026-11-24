require("dotenv").config();
const { Pool } = require("pg");

const url = process.env.DATABASE_URL || "";
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);

const pool = new Pool({
  connectionString: url,
  // Hosted databases (Neon, Render, Supabase) need SSL; a local one does not.
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on("error", error => console.error("Database pool error:", error.message));

module.exports = pool;
