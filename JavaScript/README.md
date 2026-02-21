# JavaScript To-Do Application

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Ensure PostgreSQL is running and the database is set up according to `DatabaseSetup.md` in the root directory.

### 3. Run Application
```bash
npm start
```

### 4. Run Tests
```bash
npm install
npm test
```

## Project Structure
```
src/
├── config/          # Database configuration
├── dao/             # Data Access Objects
├── models/          # Data models
├── services/        # Business logic
└── index.js         # Main CLI application
```

## Features
- User Registration & Login
- Add Task
- Edit Task Name
- Assign Task to Another User
- Mark Task as Completed
- Mark Task as Blocked
- Delete Task
- View My Tasks
- Filter Tasks by Status/Category

## Database Credentials
- Host: localhost
- Port: 5432
- Database: todo_app
- User: todoappuser
- Password: todo_pwd
