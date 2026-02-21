# Test Cases for JavaScript To-Do Application

## 1. User Registration Tests

### TC-001: Successful User Registration
**Precondition:** Database is accessible
**Steps:**
1. Select option 1 (Register)
2. Enter unique username: "testuser1"
3. Enter password: "password123"

**Expected Result:** "Registration successful!" message displayed

### TC-002: Duplicate Username Registration
**Precondition:** User "testuser1" already exists
**Steps:**
1. Select option 1 (Register)
2. Enter username: "testuser1"
3. Enter password: "password456"

**Expected Result:** Error message "Username already exists"

### TC-003: Empty Username Registration
**Precondition:** Database is accessible
**Steps:**
1. Select option 1 (Register)
2. Enter empty username: ""
3. Enter password: "password123"

**Expected Result:** Error or validation message

---

## 2. User Login Tests

### TC-004: Successful Login
**Precondition:** User "testuser1" exists with password "password123"
**Steps:**
1. Select option 2 (Login)
2. Enter username: "testuser1"
3. Enter password: "password123"

**Expected Result:** "Welcome, testuser1!" message and Task Menu displayed

### TC-005: Login with Invalid Username
**Precondition:** Database is accessible
**Steps:**
1. Select option 2 (Login)
2. Enter username: "nonexistent"
3. Enter password: "password123"

**Expected Result:** Error message "Invalid username or password"

### TC-006: Login with Wrong Password
**Precondition:** User "testuser1" exists
**Steps:**
1. Select option 2 (Login)
2. Enter username: "testuser1"
3. Enter password: "wrongpassword"

**Expected Result:** Error message "Invalid username or password"

---

## 3. Add Task Tests

### TC-007: Add Task with Work Category
**Precondition:** User logged in
**Steps:**
1. Select option 1 (Add Task)
2. Enter task name: "Complete project documentation"
3. Enter category ID: 1 (Work)

**Expected Result:** "Task added successfully!" and task created with status "Ready to Pick"

### TC-008: Add Task with Leisure Category
**Precondition:** User logged in
**Steps:**
1. Select option 1 (Add Task)
2. Enter task name: "Watch movie"
3. Enter category ID: 2 (Leisure)

**Expected Result:** "Task added successfully!" and task created with status "Ready to Pick"

### TC-009: Add Task with Invalid Category
**Precondition:** User logged in
**Steps:**
1. Select option 1 (Add Task)
2. Enter task name: "Test task"
3. Enter category ID: 99

**Expected Result:** Error message or database constraint violation

---

## 4. Edit Task Name Tests

### TC-010: Edit Own Task Successfully
**Precondition:** User logged in, task ID 1 belongs to user
**Steps:**
1. Select option 2 (Edit Task Name)
2. Enter task ID: 1
3. Enter new name: "Updated task name"

**Expected Result:** "Task updated successfully!"

### TC-011: Edit Non-existent Task
**Precondition:** User logged in
**Steps:**
1. Select option 2 (Edit Task Name)
2. Enter task ID: 9999
3. Enter new name: "Test"

**Expected Result:** Error message "Task not found or unauthorized"

### TC-012: Edit Another User's Task
**Precondition:** User logged in, task ID 5 belongs to different user
**Steps:**
1. Select option 2 (Edit Task Name)
2. Enter task ID: 5
3. Enter new name: "Hacked task"

**Expected Result:** Error message "Task not found or unauthorized"

---

## 5. Start/Resume Task Tests

### TC-013: Start Task from Ready to Pick
**Precondition:** User logged in, task ID 1 has status "Ready to Pick"
**Steps:**
1. Select option 3 (Start/Resume Task)
2. Enter task ID: 1

**Expected Result:** "Task marked as in progress!" and status changed to "In Progress"

### TC-014: Resume Task from Blocked
**Precondition:** User logged in, task ID 2 has status "Blocked"
**Steps:**
1. Select option 3 (Start/Resume Task)
2. Enter task ID: 2

**Expected Result:** "Task marked as in progress!" and status changed to "In Progress"

### TC-015: Start Already Completed Task
**Precondition:** User logged in, task ID 3 has status "Completed"
**Steps:**
1. Select option 3 (Start/Resume Task)
2. Enter task ID: 3

**Expected Result:** Error message "Task can only be resumed from Ready to Pick or Blocked status"

### TC-016: Start Already In Progress Task
**Precondition:** User logged in, task ID 4 has status "In Progress"
**Steps:**
1. Select option 3 (Start/Resume Task)
2. Enter task ID: 4

**Expected Result:** Error message "Task can only be resumed from Ready to Pick or Blocked status"

---

## 6. Mark Completed Tests

### TC-017: Mark In Progress Task as Completed
**Precondition:** User logged in, task ID 1 has status "In Progress"
**Steps:**
1. Select option 4 (Mark Completed)
2. Enter task ID: 1

**Expected Result:** "Task marked as completed!" and status changed to "Completed"

### TC-018: Mark Own Task as Completed
**Precondition:** User logged in, task ID 2 belongs to user
**Steps:**
1. Select option 4 (Mark Completed)
2. Enter task ID: 2

**Expected Result:** "Task marked as completed!"

### TC-019: Mark Another User's Task as Completed
**Precondition:** User logged in, task ID 5 belongs to different user
**Steps:**
1. Select option 4 (Mark Completed)
2. Enter task ID: 5

**Expected Result:** Error message "Task not found or unauthorized"

---

## 7. Mark Blocked Tests

### TC-020: Mark In Progress Task as Blocked
**Precondition:** User logged in, task ID 1 has status "In Progress"
**Steps:**
1. Select option 5 (Mark Blocked)
2. Enter task ID: 1

**Expected Result:** "Task marked as blocked!" and status changed to "Blocked"

### TC-021: Mark Ready to Pick Task as Blocked
**Precondition:** User logged in, task ID 2 has status "Ready to Pick"
**Steps:**
1. Select option 5 (Mark Blocked)
2. Enter task ID: 2

**Expected Result:** "Task marked as blocked!" and status changed to "Blocked"

---

## 8. Delete Task Tests

### TC-022: Delete Own Task
**Precondition:** User logged in, task ID 1 belongs to user
**Steps:**
1. Select option 6 (Delete Task)
2. Enter task ID: 1

**Expected Result:** "Task deleted successfully!" and status changed to "Deleted"

### TC-023: Delete Another User's Task
**Precondition:** User logged in, task ID 5 belongs to different user
**Steps:**
1. Select option 6 (Delete Task)
2. Enter task ID: 5

**Expected Result:** Error message "Task not found or unauthorized"

### TC-024: Delete Non-existent Task
**Precondition:** User logged in
**Steps:**
1. Select option 6 (Delete Task)
2. Enter task ID: 9999

**Expected Result:** Error message "Task not found or unauthorized"

---

## 9. View My Tasks Tests

### TC-025: View Tasks with Multiple Tasks
**Precondition:** User logged in, user has 3 tasks
**Steps:**
1. Select option 7 (View My Tasks)

**Expected Result:** Display all user's tasks (excluding deleted) with ID, name, status, and category

### TC-026: View Tasks with No Tasks
**Precondition:** User logged in, user has no tasks
**Steps:**
1. Select option 7 (View My Tasks)

**Expected Result:** "No tasks found." message displayed

### TC-027: View Tasks Excludes Deleted Tasks
**Precondition:** User logged in, user has 2 active tasks and 1 deleted task
**Steps:**
1. Select option 7 (View My Tasks)

**Expected Result:** Display only 2 active tasks, deleted task not shown

---

## 10. Filter Tasks Tests

### TC-028: Filter by Status - Ready to Pick
**Precondition:** User logged in, user has tasks in various statuses
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 1 (Status)
3. Enter status ID: 1 (Ready to Pick)

**Expected Result:** Display only tasks with "Ready to Pick" status

### TC-029: Filter by Status - In Progress
**Precondition:** User logged in, user has tasks in various statuses
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 1 (Status)
3. Enter status ID: 2 (In Progress)

**Expected Result:** Display only tasks with "In Progress" status

### TC-030: Filter by Status - Blocked
**Precondition:** User logged in, user has tasks in various statuses
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 1 (Status)
3. Enter status ID: 3 (Blocked)

**Expected Result:** Display only tasks with "Blocked" status

### TC-031: Filter by Status - Completed
**Precondition:** User logged in, user has tasks in various statuses
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 1 (Status)
3. Enter status ID: 4 (Completed)

**Expected Result:** Display only tasks with "Completed" status

### TC-032: Filter by Category - Work
**Precondition:** User logged in, user has tasks in both categories
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 2 (Category)
3. Enter category ID: 1 (Work)

**Expected Result:** Display only tasks with "Work" category

### TC-033: Filter by Category - Leisure
**Precondition:** User logged in, user has tasks in both categories
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 2 (Category)
3. Enter category ID: 2 (Leisure)

**Expected Result:** Display only tasks with "Leisure" category

### TC-034: Filter with No Matching Results
**Precondition:** User logged in, user has no "Blocked" tasks
**Steps:**
1. Select option 8 (Filter My Tasks)
2. Select filter type: 1 (Status)
3. Enter status ID: 3 (Blocked)

**Expected Result:** "No tasks found." message displayed

---

## 11. Logout Tests

### TC-035: Successful Logout
**Precondition:** User logged in
**Steps:**
1. Select option 0 (Logout)

**Expected Result:** "Logged out." message and return to main menu

---

## 12. Concurrent Access Tests

### TC-036: Two Users Creating Tasks Simultaneously
**Precondition:** Two users logged in from different sessions
**Steps:**
1. User1 creates task "Task A"
2. User2 creates task "Task B" at same time

**Expected Result:** Both tasks created successfully with unique IDs

---

## 13. Database Connection Tests

### TC-037: Database Connection Failure
**Precondition:** Database is stopped
**Steps:**
1. Attempt to login

**Expected Result:** Error message about database connection

### TC-038: Database Recovery
**Precondition:** Database was down and now restored
**Steps:**
1. Attempt to login

**Expected Result:** Successful connection and login

---

## 14. Task Status Transition Tests

### TC-039: Complete Task Lifecycle
**Precondition:** User logged in
**Steps:**
1. Add task (status: Ready to Pick)
2. Start task (status: In Progress)
3. Mark completed (status: Completed)

**Expected Result:** All transitions successful, timestamps updated

### TC-040: Task Blocked and Resumed
**Precondition:** User logged in, task in progress
**Steps:**
1. Mark task as blocked (status: Blocked)
2. Resume task (status: In Progress)
3. Mark completed (status: Completed)

**Expected Result:** All transitions successful

---

## 15. Exit Application Tests

### TC-042: Exit from Main Menu
**Precondition:** Application running, at main menu
**Steps:**
1. Select option 3 (Exit)

**Expected Result:** "Goodbye!" message and application terminates

---

## Test Execution Summary Template

| Test Case ID | Description | Status | Notes |
|--------------|-------------|--------|-------|
| TC-001 | Successful Registration | | |
| TC-002 | Duplicate Username | | |
| ... | ... | | |

**Status Values:** PASS / FAIL / BLOCKED / NOT RUN
