/**
 * Authentication service for user registration and login
 * Validates user input and enforces unique username constraint
 * Handles credential verification for secure access
 */
import { UserDAO } from '../dao/UserDAO.js';

export class AuthService {
  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * Register new user with validation
   * Checks for empty fields and duplicate usernames
   * @param {string} name - Username
   * @param {string} password - User password
   * @returns {Promise<User>} Created user object
   */
  async register(name, password) {
    if (!name || name.trim() === '') {
      throw new Error('Username cannot be empty');
    }
    if (!password || password.trim() === '') {
      throw new Error('Password cannot be empty');
    }
    const existingUser = await this.userDAO.findByName(name);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    return await this.userDAO.createUser(name, password);
  }

  /**
   * Authenticate user credentials
   * Verifies username exists and password matches
   * @param {string} name - Username
   * @param {string} password - User password
   * @returns {Promise<User>} Authenticated user object
   */
  async login(name, password) {
    const user = await this.userDAO.findByName(name);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    if (user.password !== password) {
      throw new Error('Invalid username or password');
    }
    return user;
  }
}
