# Unit Testing Guide

## Testing Approach

Due to ES modules compatibility issues with Jest, this project uses manual testing through the CLI application.

## Manual Testing

### Run Application
```bash
npm start
```

### Test Execution

Follow the test cases in `TEST_CASES.md` to manually verify all functionality.

## Test Coverage

### Authentication Tests (6 tests)
- TC-001: Register new user successfully
- TC-002: Duplicate username error
- TC-004: Login with correct credentials
- TC-005: Login with invalid username
- TC-006: Login with wrong password

### Task Management Tests (36 tests)
- TC-007-009: Add Task
- TC-010-012: Edit Task Name
- TC-013-016: Start/Resume Task
- TC-017-019: Mark Completed
- TC-020-021: Mark Blocked
- TC-022-024: Delete Task
- TC-025-027: View My Tasks
- TC-028-034: Filter Tasks
- TC-040-041: Task Status Transitions

**Total: 42 Manual Test Cases**

## Quick Test Workflow

### 1. User Registration & Login
```
1. Start application: npm start
2. Choose 1 (Register)
3. Enter username: testuser1
4. Enter password: password123
5. Choose 2 (Login)
6. Enter same credentials
```

### 2. Task Operations
```
1. Choose 1 (Add Task)
2. Enter task name: Complete documentation
3. Choose category: 1 (Work)
4. Choose 7 (View My Tasks) - verify task appears
5. Choose 3 (Start/Resume Task) - enter task ID
6. Choose 4 (Mark Completed) - enter task ID
```

### 3. Filter Operations
```
1. Add multiple tasks with different statuses
2. Choose 8 (Filter My Tasks)
3. Select 1 (Status)
4. Enter status ID: 4 (Completed)
5. Verify only completed tasks appear
```

### 4. Error Handling
```
1. Try registering duplicate username
2. Try logging in with wrong password
3. Try editing another user's task
4. Try resuming completed task
```

## Database Verification

Connect to PostgreSQL to verify data:
```bash
psql -U todoappuser -d todo_app

-- View all users
SELECT * FROM users;

-- View all tasks
SELECT t.*, s.display_name as status, c.display_name as category 
FROM tasks t 
JOIN status s ON t.status_id = s.id 
JOIN category c ON t.category_id = c.id;

-- View tasks by status
SELECT * FROM tasks WHERE status_id = 1;
```

## Test Results Template

| Test ID | Description | Expected | Actual | Status |
|---------|-------------|----------|--------|--------|
| TC-001 | Register user | Success message | | |
| TC-002 | Duplicate username | Error message | | |
| TC-004 | Valid login | Welcome message | | |
| ... | ... | ... | | |

**Status Values:** PASS / FAIL / BLOCKED

## Notes

- All tests require PostgreSQL database to be running
- Database must be set up according to `DatabaseSetup.md`
- See `TEST_CASES.md` for detailed test scenarios
- For automated testing, consider integration tests with database
