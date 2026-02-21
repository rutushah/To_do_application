package com.todo.cli;

import com.todo.model.User;
import com.todo.service.AuthService;

import java.util.Scanner;

public class AuthCli {
    private final AuthService authService = new AuthService();
    private final Scanner sc = new Scanner(System.in);

    public User startAuthFlow() {
        while (!authService.isLoggedIn()) {
            System.out.println("\n=== Collaborative To-Do ===");
            System.out.println("1) Register");
            System.out.println("2) Login");
            System.out.println("3) Exit");
            System.out.print("Choose: ");

            String choice = sc.nextLine().trim();

            try {
                switch (choice) {
                    case "1" -> {
                        System.out.print("Enter username: ");
                        String username = sc.nextLine();
                        System.out.print("Enter password: ");
                        String password = sc.nextLine();

                        User u = authService.register(username, password);
                        System.out.println("Registration successful. Logged in as: " + u.getName());
                        return u;
                    }
                    case "2" -> {
                        System.out.print("Enter username: ");
                        String username = sc.nextLine();
                        System.out.print("Enter password: ");
                        String password = sc.nextLine();

                        User u = authService.login(username, password);
                        System.out.println("Login successful. Welcome: " + u.getName());
                        return u;
                    }
                    case "3" -> System.exit(0);
                    default -> System.out.println("Invalid option. Please try again.");
                }
            } catch (IllegalArgumentException e) {
                // prints exactly the validation messages you requested
                System.out.println("Validation: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("System error: " + e.getMessage());
            }
        }
        return authService.getCurrentUser();
    }

    public void logout() {
        authService.logout();
    }
}
