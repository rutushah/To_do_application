/**
 * Command-line interface for collaborative to-do application
 * Provides user authentication and task management functionality
 * Uses readline-sync for synchronous CLI input/output
 */
import readlineSync from 'readline-sync';
import { AuthService } from './services/AuthService.js';
import { TaskService } from './services/TaskService.js';
import { UserDAO } from './dao/UserDAO.js';

const authService = new AuthService();
const taskService = new TaskService();
const userDAO = new UserDAO();

// Stores currently authenticated user session
let currentUser = null;

/**
 * Display main authentication menu
 * Presents options for user registration, login, and application exit
 * @returns {string} User's menu choice
 */
function showMainMenu() {
  console.log('\n=== Collaborative To-Do ===');
  console.log('1) Register');
  console.log('2) Login');
  console.log('3) Exit');
  const choice = readlineSync.question('Choose: ');
  return choice;
}

/**
 * Handle user registration with validation
 * Validates username and password are non-empty
 * Checks for duplicate usernames before creating account
 * Displays success message or error if registration fails
 */
async function handleRegister() {
  console.log('\n--- Register ---');
  const username = readlineSync.question('Username: ');
  
  if (!username || username.trim() === '') {
    console.log('Error: Username cannot be empty');
    return;
  }
  
  const password = readlineSync.question('Password: ', { hideEchoBack: true });
  
  if (!password || password.trim() === '') {
    console.log('Error: Password cannot be empty');
    return;
  }
  
  try {
    await authService.register(username, password);
    console.log('Registration successful!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Handle user login and transition to task menu
 * Validates credentials against database
 * Sets currentUser session and displays task management interface
 * Returns to main menu on logout
 */
async function handleLogin() {
  console.log('\n--- Login ---');
  const username = readlineSync.question('Username: ');
  
  if (!username || username.trim() === '') {
    console.log('Error: Username cannot be empty');
    return;
  }
  
  const password = readlineSync.question('Password: ', { hideEchoBack: true });
  
  if (!password || password.trim() === '') {
    console.log('Error: Password cannot be empty');
    return;
  }
  
  try {
    currentUser = await authService.login(username, password);
    console.log(`Welcome, ${currentUser.name}!`);
    await showTaskMenu();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Display task management menu for authenticated user
 * Provides CRUD operations: add, edit, resume, complete, block, delete tasks
 * Includes view and filter functionality for task organization
 * Loops until user chooses to logout
 */
function showTaskMenu() {
  return new Promise(async (resolve) => {
    let running = true;
    while (running) {
      console.log('\n=== Task Menu ===');
      console.log('1) Add Task');
      console.log('2) Edit Task Name');
      console.log('3) Start/Resume Task');
      console.log('4) Mark Completed');
      console.log('5) Mark Blocked');
      console.log('6) Delete Task');
      console.log('7) View My Tasks');
      console.log('8) Filter My Tasks (by statusId/categoryId)');
      console.log('0) Logout');
      const choice = readlineSync.question('Choose: ');

      switch (choice) {
        case '1':
          await handleAddTask();
          break;
        case '2':
          await handleEditTask();
          break;
        case '3':
          await handleResumeTask();
          break;
        case '4':
          await handleMarkCompleted();
          break;
        case '5':
          await handleMarkBlocked();
          break;
        case '6':
          await handleDeleteTask();
          break;
        case '7':
          await handleViewTasks();
          break;
        case '8':
          await handleFilterTasks();
          break;
        case '0':
          console.log('Logged out.');
          currentUser = null;
          running = false;
          break;
        default:
          console.log('Invalid choice.');
      }
    }
    resolve();
  });
}

/**
 * Add new task with category selection
 * Creates task with 'ready_to_pick' status (statusId=1)
 * Validates task name is non-empty
 * Assigns task to current user and selected category (1=Work, 2=Leisure)
 */
async function handleAddTask() {
  const taskName = readlineSync.question('Task name: ');
  
  if (!taskName || taskName.trim() === '') {
    console.log('Error: Task name cannot be empty');
    return;
  }
  
  console.log('Categories: 1=Work, 2=Leisure');
  const categoryId = readlineSync.questionInt('Category ID: ');
  
  try {
    await taskService.addTask(taskName, currentUser.id, categoryId);
    console.log('Task added successfully!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Edit existing task name
 * Validates user owns the task before allowing modification
 * Prevents editing of deleted tasks (statusId=5)
 * Updates task name and timestamp in database
 */
async function handleEditTask() {
  const taskId = readlineSync.questionInt('Task ID: ');
  const newName = readlineSync.question('New task name: ');
  
  if (!newName || newName.trim() === '') {
    console.log('Error: Task name cannot be empty');
    return;
  }
  
  try {
    await taskService.editTaskName(taskId, newName, currentUser.id);
    console.log('Task updated successfully!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Resume task to in-progress status
 * Changes task status from 'ready_to_pick' (1) or 'blocked' (3) to 'in_progress' (2)
 * Validates user authorization and prevents resuming deleted tasks
 * Used when user starts working on a task
 */
async function handleResumeTask() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.resumeTask(taskId, currentUser.id);
    console.log('Task marked as in progress!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Mark task as completed
 * Changes task status to 'completed' (statusId=4)
 * Validates user owns task and prevents modifying deleted tasks
 * Updates timestamp to track completion time
 */
async function handleMarkCompleted() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.markCompleted(taskId, currentUser.id);
    console.log('Task marked as completed!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Mark task as blocked
 * Changes task status to 'blocked' (statusId=3)
 * Used when task cannot proceed due to dependencies or issues
 * Validates authorization and prevents modifying deleted tasks
 */
async function handleMarkBlocked() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.markBlocked(taskId, currentUser.id);
    console.log('Task marked as blocked!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Soft delete task
 * Changes task status to 'deleted' (statusId=5) without removing from database
 * Deleted tasks are excluded from active task views
 * Once deleted, tasks cannot be modified or restored
 */
async function handleDeleteTask() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.deleteTask(taskId, currentUser.id);
    console.log('Task deleted successfully!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * View all active tasks for current user
 * Displays tasks with full details: ID, username, task name, status, category
 * Shows creation and last update timestamps
 * Excludes deleted tasks from display
 * Tasks ordered by most recently updated first
 */
async function handleViewTasks() {
  try {
    const tasks = await taskService.getMyTasks(currentUser.id);
    if (tasks.length === 0) {
      console.log('No tasks found.');
      return;
    }
    console.log('\n--- My Tasks ---');
    tasks.forEach(task => {
      console.log(`ID: ${task.id} | User: ${task.username} | Task: ${task.task_name}`);
      console.log(`Status: ${task.status_name} | Category: ${task.category_name}`);
      console.log(`Created: ${new Date(task.created_date).toLocaleString()} | Updated: ${new Date(task.updated_date).toLocaleString()}`);
      console.log('---');
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Filter tasks by status or category
 * Status options: 1=Ready to Pick, 2=In Progress, 3=Blocked, 4=Completed
 * Category options: 1=Work, 2=Leisure
 * Displays filtered results with full task details
 */
async function handleFilterTasks() {
  console.log('Filter by: 1=Status, 2=Category');
  const filterType = readlineSync.question('Choose: ');
  
  try {
    if (filterType === '1') {
      console.log('Status: 1=Ready to Pick, 2=In Progress, 3=Blocked, 4=Completed');
      const statusId = readlineSync.questionInt('Status ID: ');
      const tasks = await taskService.filterByStatus(currentUser.id, statusId);
      displayTasks(tasks);
    } else if (filterType === '2') {
      console.log('Categories: 1=Work, 2=Leisure');
      const categoryId = readlineSync.questionInt('Category ID: ');
      const tasks = await taskService.filterByCategory(currentUser.id, categoryId);
      displayTasks(tasks);
    } else {
      console.log('Invalid choice.');
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

/**
 * Display tasks with formatted output
 * Shows task ID, username, task name, status, category
 * Includes formatted creation and update timestamps
 * Used by view and filter operations
 */
function displayTasks(tasks) {
  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }
  console.log('\n--- Filtered Tasks ---');
  tasks.forEach(task => {
    console.log(`ID: ${task.id} | User: ${task.username} | Task: ${task.task_name}`);
    console.log(`Status: ${task.status_name} | Category: ${task.category_name}`);
    console.log(`Created: ${new Date(task.created_date).toLocaleString()} | Updated: ${new Date(task.updated_date).toLocaleString()}`);
    console.log('---');
  });
}

/**
 * Application entry point
 * Initializes CLI and displays main menu loop
 * Handles user authentication flow (register/login/exit)
 * Catches and logs any unhandled errors
 */
async function main() {
  console.log('Welcome to Collaborative To-Do Application!');
  
  let running = true;
  while (running) {
    const choice = showMainMenu();
    
    switch (choice) {
      case '1':
        await handleRegister();
        break;
      case '2':
        await handleLogin();
        break;
      case '3':
        console.log('Goodbye!');
        running = false;
        process.exit(0);
        break;
      default:
        console.log('Invalid choice.');
    }
  }
}

main().catch(console.error);
