/**
 * AuthService Integration Tests
 * Tests user registration and login functionality
 * Uses dependency injection to mock UserDAO for isolated testing
 * Validates input validation, duplicate checks, and authentication logic
 */
import { describe, test, expect } from '@jest/globals';
import { AuthService } from '../src/services/AuthService.js';

describe('AuthService Integration Tests', () => {
  // Test suite for user registration functionality
  describe('register', () => {
    /**
     * TC-003: Validate empty username rejection
     * Ensures registration fails when username is empty or whitespace
     */
    test('TC-003: should throw error for empty username', async () => {
      const authService = new AuthService();
      
      await expect(authService.register('', 'password123'))
        .rejects.toThrow('Username cannot be empty');
    });

    /**
     * TC-003b: Validate empty password rejection
     * Ensures registration fails when password is empty or whitespace
     */
    test('TC-003b: should throw error for empty password', async () => {
      const authService = new AuthService();
      
      await expect(authService.register('testuser', ''))
        .rejects.toThrow('Password cannot be empty');
    });

    /**
     * TC-002: Validate duplicate username rejection
     * Mocks existing user in database to test duplicate username handling
     * Ensures unique username constraint is enforced
     */
    test('TC-002: should throw error for duplicate username', async () => {
      const authService = new AuthService();
      
      // Mock UserDAO to return existing user
      const mockUserDAO = {
        findByName: async (name) => ({ id: 1, name: 'testuser1', password: 'pass' }),
        createUser: async () => {}
      };
      authService.userDAO = mockUserDAO;

      await expect(authService.register('testuser1', 'password456'))
        .rejects.toThrow('Username already exists');
    });

    /**
     * TC-001: Validate successful user registration
     * Mocks UserDAO to simulate new user creation
     * Verifies user object is returned with correct properties
     */
    test('TC-001: should register new user when username is available', async () => {
      const authService = new AuthService();
      
      // Mock UserDAO with no existing user and successful creation
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

  // Test suite for user login/authentication functionality
  describe('login', () => {
    /**
     * TC-005: Validate invalid username rejection
     * Mocks UserDAO to return null (user not found)
     * Ensures login fails with appropriate error message
     */
    test('TC-005: should throw error for invalid username', async () => {
      const authService = new AuthService();
      
      const mockUserDAO = {
        findByName: async () => null
      };
      authService.userDAO = mockUserDAO;

      await expect(authService.login('nonexistent', 'password123'))
        .rejects.toThrow('Invalid username or password');
    });

    /**
     * TC-006: Validate incorrect password rejection
     * Mocks existing user with different password
     * Ensures password verification works correctly
     */
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

    /**
     * TC-004: Validate successful login
     * Mocks existing user with matching credentials
     * Verifies authenticated user object is returned
     */
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
