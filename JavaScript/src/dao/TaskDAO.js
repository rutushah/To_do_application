import { query } from '../config/database.js';
import { Task } from '../models/Task.js';

export class TaskDAO {
  async createTask(taskName, statusId, userId, categoryId) {
    const sql = 'INSERT INTO tasks (task_name, status_id, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await query(sql, [taskName, statusId, userId, categoryId]);
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  async updateTaskName(taskId, taskName) {
    const sql = 'UPDATE tasks SET task_name = $1, updated_date = NOW() WHERE id = $2 RETURNING *';
    const result = await query(sql, [taskName, taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  async updateTaskStatus(taskId, statusId) {
    const sql = 'UPDATE tasks SET status_id = $1, updated_date = NOW() WHERE id = $2 RETURNING *';
    const result = await query(sql, [statusId, taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  async assignTaskToUser(taskId, userId) {
    const sql = 'UPDATE tasks SET user_id = $1, updated_date = NOW() WHERE id = $2 RETURNING *';
    const result = await query(sql, [userId, taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  async getTasksByUserId(userId) {
    const sql = `SELECT t.*, s.display_name as status_name, c.display_name as category_name 
                 FROM tasks t 
                 JOIN status s ON t.status_id = s.id 
                 JOIN category c ON t.category_id = c.id 
                 WHERE t.user_id = $1 AND s.status_name != 'deleted'
                 ORDER BY t.created_date DESC`;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  async getTaskById(taskId) {
    const sql = 'SELECT * FROM tasks WHERE id = $1';
    const result = await query(sql, [taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  async getTasksByStatus(userId, statusId) {
    const sql = `SELECT t.*, s.display_name as status_name, c.display_name as category_name 
                 FROM tasks t 
                 JOIN status s ON t.status_id = s.id 
                 JOIN category c ON t.category_id = c.id 
                 WHERE t.user_id = $1 AND t.status_id = $2
                 ORDER BY t.created_date DESC`;
    const result = await query(sql, [userId, statusId]);
    return result.rows;
  }

  async getTasksByCategory(userId, categoryId) {
    const sql = `SELECT t.*, s.display_name as status_name, c.display_name as category_name 
                 FROM tasks t 
                 JOIN status s ON t.status_id = s.id 
                 JOIN category c ON t.category_id = c.id 
                 WHERE t.user_id = $1 AND t.category_id = $2 AND s.status_name != 'deleted'
                 ORDER BY t.created_date DESC`;
    const result = await query(sql, [userId, categoryId]);
    return result.rows;
  }
}
