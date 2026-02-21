import { UserDAO } from '../dao/UserDAO.js';

export class AuthService {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async register(name, password) {
    const existingUser = await this.userDAO.findByName(name);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    return await this.userDAO.createUser(name, password);
  }

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
