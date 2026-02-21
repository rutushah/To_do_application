/**
 * User domain model representing registered users
 * Stores user credentials and account information
 * Used for authentication and task ownership
 */
export class User {
  constructor(id, name, password, createdDate) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.createdDate = createdDate;
  }
}
