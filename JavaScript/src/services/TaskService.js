/**
 * Task service layer handling business logic and validation
 * Implements authorization checks to ensure users can only modify their own tasks
 * Enforces task lifecycle rules and prevents operations on deleted tasks
 * Status IDs: 1=ready_to_pick, 2=in_progress, 3=blocked, 4=completed, 5=deleted
 */
import { TaskDAO } from '../dao/TaskDAO.js';

export class TaskService {
  constructor() {
    this.taskDAO = new TaskDAO();
  }

  /**
   * Create new task with ready_to_pick status
   * Initializes task in ready state for user to begin work
   * @param {string} taskName - Name of the task
   * @param {number} userId - ID of task owner
   * @param {number} categoryId - Category (1=Work, 2=Leisure)
   * @returns {Promise<Task>} Created task object
   */
  async addTask(taskName, userId, categoryId) {
    const statusId = 1; // ready_to_pick
    return await this.taskDAO.createTask(taskName, statusId, userId, categoryId);
  }

  /**
   * Edit task name with authorization and deleted task validation
   * Verifies user owns task and task is not deleted before updating
   * @param {number} taskId - ID of task to edit
   * @param {string} taskName - New task name
   * @param {number} userId - ID of requesting user
   * @returns {Promise<Task>} Updated task object
   */
  async editTaskName(taskId, taskName, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    if (task.statusId === 5) {
      throw new Error('Cannot edit deleted task');
    }
    return await this.taskDAO.updateTaskName(taskId, taskName);
  }

  /**
   * Reassign task to another user
   * Transfers task ownership with authorization check
   * @param {number} taskId - ID of task to reassign
   * @param {number} newUserId - New owner user ID
   * @param {number} currentUserId - Current owner user ID
   * @returns {Promise<Task>} Updated task object
   */
  async assignTask(taskId, newUserId, currentUserId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== currentUserId) {
      throw new Error('Task not found or unauthorized');
    }
    return await this.taskDAO.assignTaskToUser(taskId, newUserId);
  }

  /**
   * Mark task as completed with validation
   * Changes status to completed (4) after authorization check
   * Prevents modification of deleted tasks
   * @param {number} taskId - ID of task to complete
   * @param {number} userId - ID of requesting user
   * @returns {Promise<Task>} Task marked as completed
   */
  async markCompleted(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    if (task.statusId === 5) {
      throw new Error('Cannot modify deleted task');
    }
    const statusId = 4; // completed
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  /**
   * Mark task as blocked with validation
   * Changes status to blocked (3) when task cannot proceed
   * Used for dependency or issue tracking
   * @param {number} taskId - ID of task to block
   * @param {number} userId - ID of requesting user
   * @returns {Promise<Task>} Task marked as blocked
   */
  async markBlocked(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    if (task.statusId === 5) {
      throw new Error('Cannot modify deleted task');
    }
    const statusId = 3; // blocked
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  /**
   * Resume task from ready_to_pick or blocked status to in_progress
   * Transitions task to active work state
   * Only allows resume from status 1 (ready_to_pick) or 3 (blocked)
   * @param {number} taskId - ID of task to resume
   * @param {number} userId - ID of requesting user
   * @returns {Promise<Task>} Updated task with in_progress status
   */
  async resumeTask(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    if (task.statusId === 5) {
      throw new Error('Cannot resume deleted task');
    }
    // Allow resume from ready_to_pick (1) or blocked (3)
    if (task.statusId !== 1 && task.statusId !== 3) {
      throw new Error('Task can only be resumed from Ready to Pick or Blocked status');
    }
    const statusId = 2; // in_progress
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  /**
   * Soft delete task by marking as deleted
   * Changes status to deleted (5) without removing from database
   * Deleted tasks are excluded from queries and cannot be modified
   * @param {number} taskId - ID of task to delete
   * @param {number} userId - ID of requesting user
   * @returns {Promise<Task>} Task marked as deleted
   */
  async deleteTask(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    const statusId = 5; // deleted
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  /**
   * Retrieve all active tasks for current user
   * Excludes deleted tasks from results
   * Returns tasks with full details including username, status, category
   * @param {number} userId - User ID to retrieve tasks for
   * @returns {Promise<Array>} Array of active task objects
   */
  async getMyTasks(userId) {
    return await this.taskDAO.getTasksByUserId(userId);
  }

  /**
   * Filter tasks by status
   * Returns tasks matching specified status for user
   * @param {number} userId - User ID to filter tasks for
   * @param {number} statusId - Status ID to filter (1-5)
   * @returns {Promise<Array>} Array of filtered task objects
   */
  async filterByStatus(userId, statusId) {
    return await this.taskDAO.getTasksByStatus(userId, statusId);
  }

  /**
   * Filter tasks by category
   * Returns tasks in specified category for user (excludes deleted)
   * @param {number} userId - User ID to filter tasks for
   * @param {number} categoryId - Category ID (1=Work, 2=Leisure)
   * @returns {Promise<Array>} Array of filtered task objects
   */
  async filterByCategory(userId, categoryId) {
    return await this.taskDAO.getTasksByCategory(userId, categoryId);
  }
}
