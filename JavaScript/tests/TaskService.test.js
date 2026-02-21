import { describe, test, expect } from '@jest/globals';
import { TaskService } from '../src/services/TaskService.js';

describe('TaskService Integration Tests', () => {
  describe('addTask', () => {
    test('TC-007: should add task with correct status', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        createTask: async (taskName, statusId, userId, categoryId) => ({
          id: 1,
          taskName,
          statusId,
          userId,
          categoryId
        })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.addTask('Complete documentation', 1, 1);
      
      expect(result.taskName).toBe('Complete documentation');
      expect(result.statusId).toBe(1); // ready_to_pick
      expect(result.userId).toBe(1);
      expect(result.categoryId).toBe(1);
    });
  });

  describe('editTaskName', () => {
    test('TC-011: should throw error for non-existent task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => null
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.editTaskName(9999, 'Test', 1))
        .rejects.toThrow('Task not found or unauthorized');
    });

    test('TC-012: should throw error for another user\'s task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 5, userId: 2 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.editTaskName(5, 'Hacked', 1))
        .rejects.toThrow('Task not found or unauthorized');
    });

    test('TC-010: should edit own task successfully', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, userId: 1 }),
        updateTaskName: async (id, name) => ({ id, taskName: name, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.editTaskName(1, 'Updated name', 1);
      
      expect(result.taskName).toBe('Updated name');
    });
  });

  describe('resumeTask', () => {
    test('TC-013: should start task from ready to pick', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, statusId: 1, userId: 1 }),
        updateTaskStatus: async (id, statusId) => ({ id, statusId })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.resumeTask(1, 1);
      
      expect(result.statusId).toBe(2); // in_progress
    });

    test('TC-014: should resume task from blocked', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 2, statusId: 3, userId: 1 }),
        updateTaskStatus: async (id, statusId) => ({ id, statusId })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.resumeTask(2, 1);
      
      expect(result.statusId).toBe(2); // in_progress
    });

    test('TC-015: should throw error for completed task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 3, statusId: 4, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.resumeTask(3, 1))
        .rejects.toThrow('Task can only be resumed from Ready to Pick or Blocked status');
    });
  });

  describe('markCompleted', () => {
    test('TC-017: should mark task as completed', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, statusId: 2, userId: 1 }),
        updateTaskStatus: async (id, statusId) => ({ id, statusId })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.markCompleted(1, 1);
      
      expect(result.statusId).toBe(4); // completed
    });

    test('TC-019: should throw error for another user\'s task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 5, userId: 2 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.markCompleted(5, 1))
        .rejects.toThrow('Task not found or unauthorized');
    });
  });

  describe('deleteTask', () => {
    test('TC-022: should delete own task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, userId: 1 }),
        updateTaskStatus: async (id, statusId) => ({ id, statusId })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.deleteTask(1, 1);
      
      expect(result.statusId).toBe(5); // deleted
    });

    test('TC-024: should throw error for non-existent task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => null
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.deleteTask(9999, 1))
        .rejects.toThrow('Task not found or unauthorized');
    });
  });

  describe('getMyTasks', () => {
    test('TC-025: should return user tasks', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByUserId: async () => [
          { id: 1, task_name: 'Task 1' },
          { id: 2, task_name: 'Task 2' }
        ]
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.getMyTasks(1);
      
      expect(result).toHaveLength(2);
    });

    test('TC-026: should return empty array when no tasks', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByUserId: async () => []
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.getMyTasks(1);
      
      expect(result).toHaveLength(0);
    });
  });
});
