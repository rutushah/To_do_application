package com.todo.service;

import com.todo.dao.UserDao;
import com.todo.model.User;

import java.sql.SQLException;
import java.util.Optional;

public class AuthService {
    private final UserDao userDao = new UserDao();
    private User currentUser;


    // validation for registering new user
    public User register(String username, String password) throws SQLException{
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty.");
        }

        String normalizedUsername = username.trim();

        Optional<User> existing = userDao.findByName(normalizedUsername);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("User already exists, please select a different username.");
        }

        currentUser = userDao.createUser(normalizedUsername, password);
        return currentUser;
    }

    //validation for user login
    public User login(String username, String password) throws SQLException {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        Optional<User> user = userDao.validateLogin(username.trim(), password);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        currentUser = user.get();
        return currentUser;
    }

    public void logout() {
        currentUser = null;
    }

    public boolean isLoggedIn() {
        return currentUser != null;
    }

    public User getCurrentUser() {
        return currentUser;
    }
}
