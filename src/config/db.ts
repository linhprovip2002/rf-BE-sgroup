import mysql, { Pool } from 'mysql';
import { promisify } from 'util';
import env from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
env.config();

const pool: Pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Promisify the pool.query method manually
const queryAsync = promisify(pool.query).bind(pool);

// Export the promisified query function
export default {
  query: queryAsync
};