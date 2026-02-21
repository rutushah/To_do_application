import { describe, test, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../src/services/AuthService.js';

describe('AuthService Integration Tests', () => {
  describe('register', () => {
    test('TC-002: should throw error for duplicate username', async () => {
      const authService = new AuthService();
      
      // This test validates business logic without database
      const mockUserDAO = {
        findByName: async (name) => ({ id: 1, name: 'testuser1', password: 'pass' }),
        createUser: async () => {}
      };
      authService.userDAO = mockUserDAO;

      await expect(authService.register('testuser1', 'password456'))
        .rejects.toThrow('Username already exists');
    });

    test('TC-001: should register new user when username is available', async () => {
      const authService = new AuthService();
      
      const mockUserDAO = {
        findByName: async () => null,
        createUser: async (name, password) => ({ 
          id: 1, 
          name, 
          password, 
          createdDate: new Date() 
        })
      };
      authService.userDAO = mockUserDAO;

      const result = await authService.register('newuser', 'password123');
      
      expect(result.name).toBe('newuser');
      expect(result.id).toBe(1);
    });
  });

  describe('login', () => {
    test('TC-005: should throw error for invalid username', async () => {
      const authService = new AuthService();
      
      const mockUserDAO = {
        findByName: async () => null
      };
      authService.userDAO = mockUserDAO;

      await expect(authService.login('nonexistent', 'password123'))
        .rejects.toThrow('Invalid username or password');
    });

    test('TC-006: should throw error for wrong password', async () => {
      const authService = new AuthService();
      
      const mockUserDAO = {
        findByName: async () => ({ 
          id: 1, 
          name: 'testuser1', 
          password: 'password123' 
        })
      };
      authService.userDAO = mockUserDAO;

      await expect(authService.login('testuser1', 'wrongpassword'))
        .rejects.toThrow('Invalid username or password');
    });

    test('TC-004: should login successfully with correct credentials', async () => {
      const authService = new AuthService();
      
      const mockUserDAO = {
        findByName: async () => ({ 
          id: 1, 
          name: 'testuser1', 
          password: 'password123' 
        })
      };
      authService.userDAO = mockUserDAO;

      const result = await authService.login('testuser1', 'password123');
      
      expect(result.name).toBe('testuser1');
      expect(result.id).toBe(1);
    });
  });
});
