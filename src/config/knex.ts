import knex from 'knex';
import env from 'dotenv';

env.config();
const config = {
  client: 'mysql',
  connection: {
    host: process.env.DATABASE_HOST,
    port: 3306,
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  },
  pool: {
    min: 2,
    max: 10
  }
};
const poolKnex = knex(config);
export default poolKnex;
