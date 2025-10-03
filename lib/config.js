import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "neondb_owner",
  host: process.env.DB_HOST || "ep-dark-band-adaebh95-pooler.c-2.us-east-1.aws.neon.tech",
  database: process.env.DB_NAME || "neondb",
  password: process.env.DB_PASSWORD || "npg_pACc5Z0qDHYw",
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default pool;




