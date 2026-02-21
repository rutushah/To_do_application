/**
 * PostgreSQL database connection configuration
 * Contains credentials and connection parameters for todo_app database
 * Used by connection pool to establish database connections
 */
export const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'todo_app',
  user: 'todoappuser',
  password: 'todo_pwd'
};
