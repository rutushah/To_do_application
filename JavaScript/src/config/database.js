import pkg from 'pg';
const { Pool } = pkg;
import { dbConfig } from '../config/db.config.js';

const pool = new Pool(dbConfig);

export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export default pool;
