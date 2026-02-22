package com.todo.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DB {

    private static String jdbcURL = System.getProperty("TODO_DB_URL","jdbc:postgresql://localhost:5432/todo_app");
    private static String username = System.getProperty("TODO_DB_USER", "rutushah");
    private static String password = System.getProperty("TODO_DB_PASS", "todo_pwd");

    public static Connection getConnection() throws SQLException{
        Connection c = DriverManager.getConnection(jdbcURL, username, password);
        return c;
    }
}
