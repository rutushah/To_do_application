package com.todo.cli;

import com.todo.model.Task;
import com.todo.model.User;
import com.todo.service.TaskService;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class TaskCli {
    private final TaskService taskService = new TaskService();
    private final Scanner sc = new Scanner(System.in);

    public void start(User loggedInUser) {
        while (true) {
            System.out.println("\n=== Task Menu (User: " + loggedInUser.getName() + ") ===");
            System.out.println("1) Add Task");
            System.out.println("2) Edit Task Name");
            System.out.println("3) Start/Resume Task");
            System.out.println("4) Mark Completed");
            System.out.println("5) Mark Blocked");
            System.out.println("6) Delete Task");
            System.out.println("7) View My Tasks");
            System.out.println("8) Filter My Tasks (by status name/category name)");
            System.out.println("0) Logout");
            System.out.print("Choose: ");

            String choice = sc.nextLine().trim();

            try {
                switch (choice) {
                    case "1" -> addTask(loggedInUser);
                    case "2" -> editTask(loggedInUser);
                    case "3" -> startTask(loggedInUser);
                    case "4" -> markCompleted(loggedInUser);
                    case "5" -> markBlocked(loggedInUser);
                    case "6" -> deleteTask(loggedInUser);
                    case "7" -> viewMyTasks(loggedInUser);
                    case "8" -> filterMyTasks(loggedInUser);
                    case "0" -> { return; }
                    default -> System.out.println("Invalid option. Please choose 0-8.");

                }
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private void addTask(User u) throws Exception {
        System.out.print("Task name: ");
        String taskName = sc.nextLine().trim();

        //show available categories
        List<String> categories = taskService.getAllCategoryNames();
        System.out.println("\nAvailable categories:");
        for (String c : categories) {
            System.out.println(" - " + c);
        }

        System.out.print("\nCategory name (type exactly as above): ");
        String categoryName = sc.nextLine().trim();

        taskService.addTask(taskName, u.getId(), categoryName);

        System.out.println("Task added Successfully!!!.");
    }

    private void editTask(User u) throws Exception {
        // 1) Show tasks first
        List<Task> tasks = taskService.viewMyTasks(u.getId());

        if (tasks.isEmpty()) {
            System.out.println("(No tasks found to edit)");
            return;
        }

        System.out.println("\n--- My Tasks (choose a task to edit) ---");
        for (int i = 0; i < tasks.size(); i++) {
            Task t = tasks.get(i);
            System.out.println((i + 1) + ") [" + t.getId() + "] " + t.getTask_name()
                    + " | Status=" + t.getStatusName()
                    + " | Category=" + t.getCategoryName());
        }

        // 2) Choose by list number (friendlier than ID)
        System.out.print("\nEnter task number to edit (1-" + tasks.size() + "): ");
        String input = sc.nextLine().trim();

        int choiceNum;
        try {
            choiceNum = Integer.parseInt(input);
        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Please enter a number.");
            return;
        }

        if (choiceNum < 1 || choiceNum > tasks.size()) {
            System.out.println("Invalid choice. Please select between 1 and " + tasks.size());
            return;
        }

        Task selected = tasks.get(choiceNum - 1);

        // 3) Ask new name
        System.out.println("Selected: " + selected.getTask_name());
        System.out.print("New task name: ");
        String newName = sc.nextLine().trim();

        if (newName.isEmpty()) {
            System.out.println("Task name cannot be empty.");
            return;
        }

        // 4) Update
        taskService.editTask(selected.getId(),  newName);
        System.out.println("Task updated Successfully!!!.");
    }

    private void startTask(User u) throws Exception {

        List<Task> tasks = taskService.getStartableTasks(u.getId());

        if (tasks.isEmpty()) {
            System.out.println("(No startable tasks. Only ready_to_pick or blocked tasks can be started.)");
            return;
        }

        System.out.println("\n--- Start Task (Ready to Pick / Blocked) ---");
        for (int i = 0; i < tasks.size(); i++) {
            Task t = tasks.get(i);
            System.out.println((i + 1) + ") " + t.getTask_name()
                    + " | Status=" + t.getStatusName()
                    + " | Category=" + t.getCategoryName());
        }

        System.out.print("\nChoose task number to start (1-" + tasks.size() + "): ");
        String input = sc.nextLine().trim();

        int pick;
        try {
            pick = Integer.parseInt(input);
        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Please enter a number.");
            return;
        }

        if (pick < 1 || pick > tasks.size()) {
            System.out.println("Invalid choice.");
            return;
        }

        Task selected = tasks.get(pick - 1);

        // Start task = set status to in_progress (no userId input needed)
        taskService.startTask(selected.getId(), u.getId());

        System.out.println("✅ Started: " + selected.getTask_name() + " (Status set to in_progress)");
    }

    private void markCompleted(User u) throws Exception {
        List<Task> tasks = taskService.getActiveTasks(u.getId());

        Task selected = pickTaskFromList(tasks, "Mark Completed");
        if (selected == null) return;

        taskService.markCompleted(selected.getId(), u.getId());
        System.out.println("✅ Marked completed: " + selected.getTask_name());
    }


    private void markBlocked(User u) throws Exception {
        List<Task> tasks = taskService.getActiveTasks(u.getId());

        Task selected = pickTaskFromList(tasks, "Mark Blocked");
        if (selected == null) return;

        taskService.markBlocked(selected.getId(), u.getId());
        System.out.println("✅ Marked blocked: " + selected.getTask_name());
    }

    private void deleteTask(User u) throws Exception {
        List<Task> tasks = taskService.getActiveTasks(u.getId());

        Task selected = pickTaskFromList(tasks, "Delete Task");
        if (selected == null) return;

        System.out.print("Are you sure you want to delete '" + selected.getTask_name() + "'? (y/n): ");
        String confirm = sc.nextLine().trim().toLowerCase();
        if (!confirm.equals("y")) {
            System.out.println("Cancelled.");
            return;
        }

        taskService.deleteTask(selected.getId(), u.getId());
        System.out.println("✅ Task deleted (soft delete): " + selected.getTask_name());
    }


    private void viewMyTasks(User u) throws Exception {
        List<Task> tasks = taskService.viewMyTasks(u.getId());

        System.out.println("\n--- My Tasks ---");
        if (tasks.isEmpty()) {
            System.out.println("(No tasks found)");
            return;
        }

        for (Task t : tasks) {
            System.out.println(
                    "[" + t.getId() + "] "
                            + t.getUsername() + " | "
                            + t.getTask_name() + " | "
                            + "Status=" + t.getStatusName() + " | "
                            + "Category=" + t.getCategoryName() + " | "
                            + "Created=" + t.getCreatedDate() + " | "
                            + "Updated=" + t.getUpdatedDate()
            );
        }
    }

    private void filterMyTasks(User u) throws Exception {
        System.out.print("status name (e.g., in_progress/blocked) (press Enter to skip): ");
        String statusName = sc.nextLine().trim();
        if (statusName.isEmpty()) statusName = null;

        System.out.print("category name (e.g., work/leisure) (press Enter to skip): ");
        String categoryName = sc.nextLine().trim();
        if (categoryName.isEmpty()) categoryName = null;

        List<Task> tasks = taskService.filterMyTasksByNames(u.getId(), statusName, categoryName);

        System.out.println("\n--- Filtered Tasks ---");
        if (tasks.isEmpty()) {
            System.out.println("(No tasks found)");
            return;
        }

        for (Task t : tasks) {
            System.out.println(
                    "[" + t.getId() + "] "
                            + t.getUsername() + " | "
                            + t.getTask_name() + " | "
                            + "Status=" + t.getStatusName() + " | "
                            + "Category=" + t.getCategoryName() + " | "
                            + "Created=" + t.getCreatedDate() + " | "
                            + "Updated=" + t.getUpdatedDate()
            );
        }
    }


    private Task pickTaskFromList(List<Task> tasks, String title) {
        if (tasks == null || tasks.isEmpty()) {
            System.out.println("(No tasks found)");
            return null;
        }

        System.out.println("\n--- " + title + " ---");
        for (int i = 0; i < tasks.size(); i++) {
            Task t = tasks.get(i);
            System.out.println((i + 1) + ") " + t.getTask_name()
                    + " | Status=" + t.getStatusName()
                    + " | Category=" + t.getCategoryName());
        }

        System.out.print("\nChoose task number (1-" + tasks.size() + "): ");
        String input = sc.nextLine().trim();

        int pick;
        try {
            pick = Integer.parseInt(input);
        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Please enter a number.");
            return null;
        }

        if (pick < 1 || pick > tasks.size()) {
            System.out.println("Invalid choice.");
            return null;
        }

        return tasks.get(pick - 1);
    }
}