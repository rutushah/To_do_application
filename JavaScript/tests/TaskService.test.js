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
      expect(result.statusId).toBe(1);
      expect(result.userId).toBe(1);
      expect(result.categoryId).toBe(1);
    });
  });

  describe('editTaskName', () => {
    test('TC-010: should edit own task successfully', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, userId: 1, statusId: 1 }),
        updateTaskName: async (id, name) => ({ id, taskName: name, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.editTaskName(1, 'Updated name', 1);
      
      expect(result.taskName).toBe('Updated name');
    });

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

    test('NEW: should throw error for deleted task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, userId: 1, statusId: 5 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.editTaskName(1, 'Updated', 1))
        .rejects.toThrow('Cannot edit deleted task');
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
      
      expect(result.statusId).toBe(2);
    });

    test('TC-014: should resume task from blocked', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 2, statusId: 3, userId: 1 }),
        updateTaskStatus: async (id, statusId) => ({ id, statusId })
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.resumeTask(2, 1);
      
      expect(result.statusId).toBe(2);
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

    test('NEW: should throw error for deleted task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 3, statusId: 5, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.resumeTask(3, 1))
        .rejects.toThrow('Cannot resume deleted task');
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
      
      expect(result.statusId).toBe(4);
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

    test('NEW: should throw error for deleted task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, statusId: 5, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.markCompleted(1, 1))
        .rejects.toThrow('Cannot modify deleted task');
    });
  });

  describe('markBlocked', () => {
    test('NEW: should throw error for deleted task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 1, statusId: 5, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.markBlocked(1, 1))
        .rejects.toThrow('Cannot modify deleted task');
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
      
      expect(result.statusId).toBe(5);
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
    test('TC-025: should return user tasks with all fields', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByUserId: async () => [
          { 
            id: 1, 
            username: 'john',
            task_name: 'Task 1',
            status_name: 'in_progress',
            category_name: 'work',
            created_date: new Date('2024-01-15'),
            updated_date: new Date('2024-01-16')
          },
          { 
            id: 2, 
            username: 'john',
            task_name: 'Task 2',
            status_name: 'ready_to_pick',
            category_name: 'leisure',
            created_date: new Date('2024-01-14'),
            updated_date: new Date('2024-01-14')
          }
        ]
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.getMyTasks(1);
      
      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('john');
      expect(result[0].task_name).toBe('Task 1');
      expect(result[0].status_name).toBe('in_progress');
      expect(result[0].category_name).toBe('work');
      expect(result[0].created_date).toBeDefined();
      expect(result[0].updated_date).toBeDefined();
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

    test('NEW: should return tasks ordered by updated_date DESC', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByUserId: async () => [
          { 
            id: 2,
            username: 'john',
            task_name: 'Recent Task',
            updated_date: new Date('2024-01-20')
          },
          { 
            id: 1,
            username: 'john',
            task_name: 'Old Task',
            updated_date: new Date('2024-01-10')
          }
        ]
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.getMyTasks(1);
      
      expect(result[0].task_name).toBe('Recent Task');
      expect(result[1].task_name).toBe('Old Task');
    });
  });

  describe('filterByStatus', () => {
    test('TC-028: should filter tasks with all fields', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByStatus: async () => [
          { 
            id: 1,
            username: 'john',
            task_name: 'Task 1',
            status_name: 'ready_to_pick',
            category_name: 'work',
            created_date: new Date(),
            updated_date: new Date()
          }
        ]
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.filterByStatus(1, 1);
      
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('john');
      expect(result[0].status_name).toBe('ready_to_pick');
    });
  });

  describe('filterByCategory', () => {
    test('TC-032: should filter by category with all fields', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByCategory: async () => [
          { 
            id: 1,
            username: 'john',
            task_name: 'Task 1',
            status_name: 'ready_to_pick',
            category_name: 'work',
            created_date: new Date(),
            updated_date: new Date()
          }
        ]
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.filterByCategory(1, 1);
      
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('john');
      expect(result[0].category_name).toBe('work');
    });
  });
});
