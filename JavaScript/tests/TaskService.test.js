/**
 * TaskService Integration Tests
 * Tests task CRUD operations, status transitions, and authorization
 * Uses dependency injection to mock TaskDAO for isolated testing
 * Validates business logic, deleted task protection, and user authorization
 * Status IDs: 1=ready_to_pick, 2=in_progress, 3=blocked, 4=completed, 5=deleted
 */
import { describe, test, expect } from '@jest/globals';
import { TaskService } from '../src/services/TaskService.js';

describe('TaskService Integration Tests', () => {
  // Test suite for task creation functionality
  describe('addTask', () => {
    /**
     * TC-007: Validate task creation with correct initial status
     * Ensures new tasks are created with ready_to_pick status (1)
     * Verifies all task properties are set correctly
     */
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

  // Test suite for task name editing functionality
  describe('editTaskName', () => {
    /**
     * TC-010: Validate successful task name update
     * Mocks task owned by current user with non-deleted status
     * Verifies task name is updated correctly
     */
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

    /**
     * TC-011: Validate non-existent task rejection
     * Mocks TaskDAO returning null for task lookup
     * Ensures proper error handling for missing tasks
     */
    test('TC-011: should throw error for non-existent task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => null
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.editTaskName(9999, 'Test', 1))
        .rejects.toThrow('Task not found or unauthorized');
    });

    /**
     * TC-012: Validate authorization check for task editing
     * Mocks task owned by different user (userId=2)
     * Ensures users cannot edit tasks they don't own
     */
    test('TC-012: should throw error for another user\'s task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 5, userId: 2 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.editTaskName(5, 'Hacked', 1))
        .rejects.toThrow('Task not found or unauthorized');
    });

    /**
     * Validate deleted task protection for editing
     * Mocks task with deleted status (statusId=5)
     * Ensures deleted tasks cannot be modified
     */
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

  // Test suite for task resume/start functionality
  describe('resumeTask', () => {
    /**
     * TC-013: Validate starting task from ready_to_pick status
     * Mocks task with ready_to_pick status (1)
     * Verifies status changes to in_progress (2)
     */
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

    /**
     * TC-014: Validate resuming task from blocked status
     * Mocks task with blocked status (3)
     * Verifies status changes to in_progress (2)
     */
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

    /**
     * TC-015: Validate resume restriction for completed tasks
     * Mocks task with completed status (4)
     * Ensures completed tasks cannot be resumed
     */
    test('TC-015: should throw error for completed task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 3, statusId: 4, userId: 1 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.resumeTask(3, 1))
        .rejects.toThrow('Task can only be resumed from Ready to Pick or Blocked status');
    });

    /**
     * Validate deleted task protection for resume
     * Mocks task with deleted status (5)
     * Ensures deleted tasks cannot be resumed
     */
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

  // Test suite for marking tasks as completed
  describe('markCompleted', () => {
    /**
     * TC-017: Validate marking task as completed
     * Mocks task with in_progress status (2)
     * Verifies status changes to completed (4)
     */
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

    /**
     * TC-019: Validate authorization for marking completed
     * Mocks task owned by different user
     * Ensures users cannot complete tasks they don't own
     */
    test('TC-019: should throw error for another user\'s task', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTaskById: async () => ({ id: 5, userId: 2 })
      };
      taskService.taskDAO = mockTaskDAO;

      await expect(taskService.markCompleted(5, 1))
        .rejects.toThrow('Task not found or unauthorized');
    });

    /**
     * Validate deleted task protection for completion
     * Mocks task with deleted status (5)
     * Ensures deleted tasks cannot be marked as completed
     */
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

  // Test suite for marking tasks as blocked
  describe('markBlocked', () => {
    /**
     * Validate deleted task protection for blocking
     * Mocks task with deleted status (5)
     * Ensures deleted tasks cannot be marked as blocked
     */
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

  // Test suite for task deletion (soft delete)
  describe('deleteTask', () => {
    /**
     * TC-022: Validate soft delete functionality
     * Mocks task owned by current user
     * Verifies status changes to deleted (5)
     */
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

    /**
     * TC-024: Validate deletion of non-existent task
     * Mocks TaskDAO returning null
     * Ensures proper error handling for missing tasks
     */
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

  // Test suite for retrieving user's tasks
  describe('getMyTasks', () => {
    /**
     * TC-025: Validate task retrieval with complete information
     * Mocks tasks with all fields including username, status, category, dates
     * Verifies all fields are returned correctly from joined query
     */
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

    /**
     * TC-026: Validate empty result handling
     * Mocks TaskDAO returning empty array
     * Ensures proper handling when user has no tasks
     */
    test('TC-026: should return empty array when no tasks', async () => {
      const taskService = new TaskService();
      
      const mockTaskDAO = {
        getTasksByUserId: async () => []
      };
      taskService.taskDAO = mockTaskDAO;

      const result = await taskService.getMyTasks(1);
      
      expect(result).toHaveLength(0);
    });

    /**
     * Validate task ordering by updated_date DESC
     * Mocks tasks with different update timestamps
     * Ensures most recently updated tasks appear first
     */
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

  // Test suite for filtering tasks by status
  describe('filterByStatus', () => {
    /**
     * TC-028: Validate status-based filtering with complete fields
     * Mocks filtered tasks with all joined data
     * Verifies filtering returns correct tasks with all information
     */
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

  // Test suite for filtering tasks by category
  describe('filterByCategory', () => {
    /**
     * TC-032: Validate category-based filtering with complete fields
     * Mocks filtered tasks by category (work/leisure)
     * Verifies filtering returns correct tasks with all information
     */
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
