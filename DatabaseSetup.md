# PostgreSQL Installation and Todo App Setup Guide

## 1. PostgreSQL Installation

### macOS (using Homebrew)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Add PostgreSQL to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user

## 2. PostgreSQL Initial Setup

### Create Database User and Database
```bash
# Switch to postgres user (Linux/macOS)
sudo -u postgres psql

# Or connect directly (if no sudo needed)
psql postgres
```

```sql
-- Create a new user for the todo app
CREATE USER todo_user WITH PASSWORD 'your_password';

-- Create the todo database
CREATE DATABASE todo_app OWNER todo_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;

-- Exit PostgreSQL
\q
```

## 3. Connect to Todo Database

```bash
# Connect to the todo_app database
psql -U todo_user -d todo_app -h localhost
```

## 4. Todo Application Table Setup

### Create Todos Table
```sql
-- Create todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_priority ON todos(priority);
```

### Create Categories Table (Optional)
```sql
-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add category reference to todos table
ALTER TABLE todos ADD COLUMN category_id INTEGER REFERENCES categories(id);
CREATE INDEX idx_todos_category ON todos(category_id);
```

### Create Users Table (Optional - for multi-user support)
```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user reference to todos table
ALTER TABLE todos ADD COLUMN user_id INTEGER REFERENCES users(id);
CREATE INDEX idx_todos_user ON todos(user_id);
```

### Update Trigger for updated_at
```sql
-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for todos table
CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 5. Sample Data Insertion

```sql
-- Insert sample categories
INSERT INTO categories (name, color) VALUES 
    ('Work', '#ff6b6b'),
    ('Personal', '#4ecdc4'),
    ('Shopping', '#45b7d1'),
    ('Health', '#96ceb4');

-- Insert sample todos
INSERT INTO todos (title, description, completed, priority, due_date, category_id) VALUES 
    ('Complete project proposal', 'Finish the Q4 project proposal document', false, 'high', '2024-01-15', 1),
    ('Buy groceries', 'Milk, bread, eggs, vegetables', false, 'medium', '2024-01-10', 3),
    ('Exercise', 'Go for a 30-minute run', false, 'low', '2024-01-09', 4),
    ('Team meeting', 'Weekly standup with development team', true, 'medium', '2024-01-08', 1);
```

## 6. Useful PostgreSQL Commands

```sql
-- View all tables
\dt

-- Describe table structure
\d todos

-- View all todos
SELECT * FROM todos;

-- View todos with categories
SELECT t.*, c.name as category_name 
FROM todos t 
LEFT JOIN categories c ON t.category_id = c.id;

-- Count todos by status
SELECT completed, COUNT(*) FROM todos GROUP BY completed;

-- Find overdue todos
SELECT * FROM todos 
WHERE due_date < CURRENT_DATE AND completed = false;
```

## 7. Environment Configuration

### Create .env file for your application
```bash
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=todo_user
DB_PASSWORD=your_password
DB_URL=postgresql://todo_user:your_password@localhost:5432/todo_app
```

## 8. Backup and Restore

### Backup database
```bash
pg_dump -U todo_user -h localhost todo_app > todo_app_backup.sql
```

### Restore database
```bash
psql -U todo_user -h localhost todo_app < todo_app_backup.sql
```

## 9. Common Issues and Solutions

### Connection Issues
- Ensure PostgreSQL service is running: `brew services list | grep postgresql`
- Check if port 5432 is available: `lsof -i :5432`
- Verify user permissions and password

### Performance Tips
- Use indexes on frequently queried columns
- Use EXPLAIN ANALYZE to optimize queries
- Regular VACUUM and ANALYZE operations

```sql
-- Analyze table statistics
ANALYZE todos;

-- Vacuum table
VACUUM todos;
```

## Next Steps

1. Install your preferred programming language's PostgreSQL driver
2. Create connection pooling for production applications
3. Implement proper error handling and logging
4. Set up database migrations for schema changes
5. Configure SSL connections for production environments