import { query } from '../config/database.js';
import { User } from '../models/User.js';

export class UserDAO {
  async createUser(name, password) {
    const sql = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *';
    const result = await query(sql, [name, password]);
    const row = result.rows[0];
    return new User(row.id, row.name, row.password, row.created_date);
  }

  async findByName(name) {
    const sql = 'SELECT * FROM users WHERE name = $1';
    const result = await query(sql, [name]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.id, row.name, row.password, row.created_date);
  }

  async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1';
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.id, row.name, row.password, row.created_date);
  }
}
