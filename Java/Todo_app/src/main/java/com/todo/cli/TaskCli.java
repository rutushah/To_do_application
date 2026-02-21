package com.todo.cli;

import com.todo.model.Task;
import com.todo.model.User;
import com.todo.service.TaskService;

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
            System.out.println("3) Assign Task to Another User");
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
                    case "2" -> editTask();
                    case "3" -> assignTask();
                    case "4" -> markCompleted();
                    case "5" -> markBlocked();
                    case "6" -> deleteTask();
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

        System.out.print("Category name (e.g., work/leisure): ");
        String categoryName = sc.nextLine().trim();

        taskService.addTask(taskName, u.getId(), categoryName);

        System.out.println("✅ Task added.");
    }

    private void editTask() throws Exception {
        System.out.print("Task id: ");
        int taskId = Integer.parseInt(sc.nextLine().trim());

        System.out.print("New task name: ");
        String newName = sc.nextLine().trim();

        taskService.editTask(taskId, newName);
        System.out.println("✅ Task updated.");
    }

    private void assignTask() throws Exception {
        System.out.print("Task id: ");
        int taskId = Integer.parseInt(sc.nextLine().trim());

        System.out.print("Assign to userId: ");
        int assigneeUserId = Integer.parseInt(sc.nextLine().trim());

        taskService.assignTask(taskId, assigneeUserId);
        System.out.println("✅ Task assigned.");
    }

    private void markCompleted() throws Exception {
        System.out.print("Task id: ");
        int taskId = Integer.parseInt(sc.nextLine().trim());

        taskService.markCompleted(taskId);
        System.out.println("✅ Marked completed.");
    }
    private void markBlocked() throws Exception {
        System.out.print("Task id: ");
        int taskId = Integer.parseInt(sc.nextLine().trim());

        taskService.markBlocked(taskId);
        System.out.println("✅ Marked blocked.");
    }

    private void deleteTask() throws Exception {
        System.out.print("Task id: ");
        int taskId = Integer.parseInt(sc.nextLine().trim());

        taskService.deleteTask(taskId);
        System.out.println("✅ Task deleted (soft delete).");
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
}