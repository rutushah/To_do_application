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
# Connect to PostgreSQL as postgres user
psql -U postgres
```

```sql
-- Create the user
CREATE USER todoappuser WITH PASSWORD 'todo_pwd';

-- Create the database
CREATE DATABASE todo_app OWNER todoappuser;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todoappuser;

-- Exit PostgreSQL
\q
```

## 3. Connect to Todo Database

```bash
# Connect as the new user
psql -U todoappuser -d todo_app
```

## 4. Todo Application Table Setup

### Create Status Table
```sql
-- Create status table
CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100)
);
```

### Create Category Table
```sql
-- Create category table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100)
);
```

### Create Users Table
```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Create Tasks Table
```sql
-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(200) NOT NULL,
    status_id INT NOT NULL REFERENCES status(id),
    user_id INT NOT NULL REFERENCES users(id),
    category_id INT NOT NULL REFERENCES category(id),
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Create Indexes
```sql
-- Create indexes for better query performance
CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_category ON tasks(category_id);
CREATE INDEX idx_tasks_created_date ON tasks(created_date);
CREATE INDEX idx_tasks_updated_date ON tasks(updated_date);
```

### Update Trigger for updated_date
```sql
-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tasks table
CREATE TRIGGER update_tasks_updated_date 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_date_column();
```

## 5. Insert Default Data

```sql
-- Insert default statuses
INSERT INTO status (status_name, display_name) VALUES
('ready_to_pick', 'Ready to Pick'),
('in_progress', 'In Progress'),
('blocked', 'Blocked'),
('completed', 'Completed'),
('deleted', 'Deleted');

-- Insert default categories
INSERT INTO category (category_name, display_name) VALUES
('work', 'Work'),
('leisure', 'Leisure');
```

## 6. Useful PostgreSQL Commands

```sql
-- View all tables
\dt

-- Describe table structure
\d tasks

-- View all tasks
SELECT * FROM tasks;

-- View tasks with details
SELECT 
    t.id,
    t.task_name,
    s.display_name as status,
    u.name as user_name,
    c.display_name as category,
    t.created_date,
    t.updated_date
FROM tasks t
JOIN status s ON t.status_id = s.id
JOIN users u ON t.user_id = u.id
JOIN category c ON t.category_id = c.id;

-- Count tasks by status
SELECT s.display_name, COUNT(*) 
FROM tasks t
JOIN status s ON t.status_id = s.id
GROUP BY s.display_name;

-- View tasks by user
SELECT u.name, COUNT(*) as task_count
FROM tasks t
JOIN users u ON t.user_id = u.id
GROUP BY u.name;
```

## 7. Environment Configuration

### Create .env file for your application
```bash
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=todoappuser
DB_PASSWORD=todo_pwd
DB_URL=postgresql://todoappuser:todo_pwd@localhost:5432/todo_app
```

## 8. Backup and Restore

### Backup database
```bash
pg_dump -U todoappuser -h localhost todo_app > todo_app_backup.sql
```

### Restore database
```bash
psql -U todoappuser -h localhost todo_app < todo_app_backup.sql
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
ANALYZE tasks;

-- Vacuum table
VACUUM tasks;
```

## Next Steps

1. Install your preferred programming language's PostgreSQL driver
2. Create connection pooling for production applications
3. Implement proper error handling and logging
4. Set up database migrations for schema changes
5. Configure SSL connections for production environments