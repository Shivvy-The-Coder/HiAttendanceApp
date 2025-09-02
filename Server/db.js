// db.js
import pkg from "pg";
const { Pool } = pkg;

// Create a pool for re-using connections
const pool = new Pool({
  user: process.env.PG_USER,          // from .env
  host: process.env.PG_HOST,          // from .env
  database: process.env.PG_DB,        // from .env
  password: process.env.PG_PASSWORD,  // from .env
  port: Number(process.env.PG_PORT),  // ensure it's a number
});

export default pool;
