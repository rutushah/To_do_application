/**
 * Data Access Object for user database operations
 * Handles user registration, authentication, and retrieval
 * Uses parameterized queries for security
 */
import { query } from '../config/database.js';
import { User } from '../models/User.js';

export class UserDAO {
  /**
   * Insert new user into database
   * Creates user account with username and password
   * @param {string} name - Username (must be unique)
   * @param {string} password - User password
   * @returns {Promise<User>} Created user object
   */
  async createUser(name, password) {
    const sql = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *';
    const result = await query(sql, [name, password]);
    const row = result.rows[0];
    return new User(row.id, row.name, row.password, row.created_date);
  }

  /**
   * Find user by username
   * Used for login authentication and duplicate username checks
   * @param {string} name - Username to search
   * @returns {Promise<User|null>} User object or null if not found
   */
  async findByName(name) {
    const sql = 'SELECT * FROM users WHERE name = $1';
    const result = await query(sql, [name]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.id, row.name, row.password, row.created_date);
  }

  /**
   * Find user by ID
   * Retrieves user information by primary key
   * @param {number} id - User ID to search
   * @returns {Promise<User|null>} User object or null if not found
   */
  async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1';
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.id, row.name, row.password, row.created_date);
  }
}
