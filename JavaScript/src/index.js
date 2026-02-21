import readlineSync from 'readline-sync';
import { AuthService } from './services/AuthService.js';
import { TaskService } from './services/TaskService.js';
import { UserDAO } from './dao/UserDAO.js';

const authService = new AuthService();
const taskService = new TaskService();
const userDAO = new UserDAO();

let currentUser = null;

function showMainMenu() {
  console.log('\n=== Collaborative To-Do ===');
  console.log('1) Register');
  console.log('2) Login');
  console.log('3) Exit');
  const choice = readlineSync.question('Choose: ');
  return choice;
}

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

async function handleResumeTask() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.resumeTask(taskId, currentUser.id);
    console.log('Task marked as in progress!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

async function handleMarkCompleted() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.markCompleted(taskId, currentUser.id);
    console.log('Task marked as completed!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

async function handleMarkBlocked() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.markBlocked(taskId, currentUser.id);
    console.log('Task marked as blocked!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

async function handleDeleteTask() {
  const taskId = readlineSync.questionInt('Task ID: ');
  
  try {
    await taskService.deleteTask(taskId, currentUser.id);
    console.log('Task deleted successfully!');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

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
