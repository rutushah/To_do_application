/**
 * Data Access Object for task database operations
 * Handles all SQL queries and database interactions for tasks table
 * Uses parameterized queries to prevent SQL injection
 * Joins with status, category, and users tables for complete task information
 */
import { query } from '../config/database.js';
import { Task } from '../models/Task.js';

export class TaskDAO {
  /**
   * Insert new task into database
   * Creates task with specified name, status, user, and category
   * @param {string} taskName - Name of the task
   * @param {number} statusId - Status ID (1-5)
   * @param {number} userId - Owner user ID
   * @param {number} categoryId - Category ID (1=Work, 2=Leisure)
   * @returns {Promise<Task>} Created task object
   */
  async createTask(taskName, statusId, userId, categoryId) {
    const sql = 'INSERT INTO tasks (task_name, status_id, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await query(sql, [taskName, statusId, userId, categoryId]);
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  /**
   * Update task name and timestamp
   * Modifies task name and sets updated_date to current time
   * @param {number} taskId - ID of task to update
   * @param {string} taskName - New task name
   * @returns {Promise<Task|null>} Updated task or null if not found
   */
  async updateTaskName(taskId, taskName) {
    const sql = 'UPDATE tasks SET task_name = $1, updated_date = NOW() WHERE id = $2 RETURNING *';
    const result = await query(sql, [taskName, taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  /**
   * Update task status and timestamp
   * Changes task status (ready_to_pick, in_progress, blocked, completed, deleted)
   * @param {number} taskId - ID of task to update
   * @param {number} statusId - New status ID (1-5)
   * @returns {Promise<Task|null>} Updated task or null if not found
   */
  async updateTaskStatus(taskId, statusId) {
    const sql = 'UPDATE tasks SET status_id = $1, updated_date = NOW() WHERE id = $2 RETURNING *';
    const result = await query(sql, [statusId, taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  /**
   * Reassign task to different user
   * Updates task ownership and timestamp
   * @param {number} taskId - ID of task to reassign
   * @param {number} userId - New owner user ID
   * @returns {Promise<Task|null>} Updated task or null if not found
   */
  async assignTaskToUser(taskId, userId) {
    const sql = 'UPDATE tasks SET user_id = $1, updated_date = NOW() WHERE id = $2 RETURNING *';
    const result = await query(sql, [userId, taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  /**
   * Retrieve all active tasks for a user (excludes deleted)
   * Joins with status, category, and users tables for complete information
   * Orders by most recently updated first
   * @param {number} userId - User ID to filter tasks
   * @returns {Promise<Array>} Array of task objects with joined data
   */
  async getTasksByUserId(userId) {
    const sql = `SELECT t.id, u.name AS username, t.task_name,
                        s.status_name AS status_name,
                        c.category_name AS category_name,
                        t.created_date, t.updated_date
                 FROM tasks t
                 LEFT JOIN status s ON t.status_id = s.id
                 LEFT JOIN category c ON t.category_id = c.id
                 LEFT JOIN users u ON t.user_id = u.id
                 WHERE t.user_id = $1 AND s.status_name != 'deleted'
                 ORDER BY t.updated_date DESC`;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  /**
   * Find task by ID
   * Returns basic task information without joins
   * @param {number} taskId - Task ID to retrieve
   * @returns {Promise<Task|null>} Task object or null if not found
   */
  async getTaskById(taskId) {
    const sql = 'SELECT * FROM tasks WHERE id = $1';
    const result = await query(sql, [taskId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Task(row.id, row.task_name, row.status_id, row.user_id, row.category_id, row.created_date, row.updated_date);
  }

  /**
   * Filter tasks by status for a user
   * Includes all statuses including deleted
   * @param {number} userId - User ID to filter tasks
   * @param {number} statusId - Status ID to filter (1-5)
   * @returns {Promise<Array>} Array of filtered task objects
   */
  async getTasksByStatus(userId, statusId) {
    const sql = `SELECT t.id, u.name AS username, t.task_name,
                        s.status_name AS status_name,
                        c.category_name AS category_name,
                        t.created_date, t.updated_date
                 FROM tasks t
                 LEFT JOIN status s ON t.status_id = s.id
                 LEFT JOIN category c ON t.category_id = c.id
                 LEFT JOIN users u ON t.user_id = u.id
                 WHERE t.user_id = $1 AND t.status_id = $2
                 ORDER BY t.updated_date DESC`;
    const result = await query(sql, [userId, statusId]);
    return result.rows;
  }

  /**
   * Filter tasks by category for a user (excludes deleted)
   * Returns tasks in specified category ordered by update time
   * @param {number} userId - User ID to filter tasks
   * @param {number} categoryId - Category ID (1=Work, 2=Leisure)
   * @returns {Promise<Array>} Array of filtered task objects
   */
  async getTasksByCategory(userId, categoryId) {
    const sql = `SELECT t.id, u.name AS username, t.task_name,
                        s.status_name AS status_name,
                        c.category_name AS category_name,
                        t.created_date, t.updated_date
                 FROM tasks t
                 LEFT JOIN status s ON t.status_id = s.id
                 LEFT JOIN category c ON t.category_id = c.id
                 LEFT JOIN users u ON t.user_id = u.id
                 WHERE t.user_id = $1 AND t.category_id = $2 AND s.status_name != 'deleted'
                 ORDER BY t.updated_date DESC`;
    const result = await query(sql, [userId, categoryId]);
    return result.rows;
  }
}
