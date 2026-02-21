import { TaskDAO } from '../dao/TaskDAO.js';

export class TaskService {
  constructor() {
    this.taskDAO = new TaskDAO();
  }

  async addTask(taskName, userId, categoryId) {
    const statusId = 1; // ready_to_pick
    return await this.taskDAO.createTask(taskName, statusId, userId, categoryId);
  }

  async editTaskName(taskId, taskName, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    return await this.taskDAO.updateTaskName(taskId, taskName);
  }

  async assignTask(taskId, newUserId, currentUserId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== currentUserId) {
      throw new Error('Task not found or unauthorized');
    }
    return await this.taskDAO.assignTaskToUser(taskId, newUserId);
  }

  async markCompleted(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    const statusId = 4; // completed
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  async markBlocked(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    const statusId = 3; // blocked
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  async resumeTask(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    // Allow resume from ready_to_pick (1) or blocked (3)
    if (task.statusId !== 1 && task.statusId !== 3) {
      throw new Error('Task can only be resumed from Ready to Pick or Blocked status');
    }
    const statusId = 2; // in_progress
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  async deleteTask(taskId, userId) {
    const task = await this.taskDAO.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    const statusId = 5; // deleted
    return await this.taskDAO.updateTaskStatus(taskId, statusId);
  }

  async getMyTasks(userId) {
    return await this.taskDAO.getTasksByUserId(userId);
  }

  async filterByStatus(userId, statusId) {
    return await this.taskDAO.getTasksByStatus(userId, statusId);
  }

  async filterByCategory(userId, categoryId) {
    return await this.taskDAO.getTasksByCategory(userId, categoryId);
  }
}
