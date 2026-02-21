/**
 * PostgreSQL connection pool setup
 * Manages database connections efficiently through connection pooling
 * Automatically handles connection acquisition and release
 */
import pkg from 'pg';
const { Pool } = pkg;
import { dbConfig } from '../config/db.config.js';

// Create connection pool for efficient database access
const pool = new Pool(dbConfig);

/**
 * Execute parameterized query with automatic connection management
 * Acquires connection from pool, executes query, and releases connection
 * @param {string} text - SQL query with $1, $2 placeholders
 * @param {Array} params - Query parameters to prevent SQL injection
 * @returns {Promise<Object>} Query result with rows array
 */
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release(); // Always release connection back to pool
  }
};

export default pool;
