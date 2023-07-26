import mysql, { Pool } from 'mysql';
import { promisify } from 'util';
import env from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
env.config();

const pool: Pool = mysql.createPool({
  host: process.env.HOST,
  user: 'root',
  password: '',
  database: process.env.DATABASE
});

// Promisify the pool.query method manually
const queryAsync = promisify(pool.query).bind(pool);

// Export the promisified query function
export default {
  query: queryAsync
};