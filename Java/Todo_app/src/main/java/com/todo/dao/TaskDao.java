package com.todo.dao;

import com.todo.model.Task;
import com.todo.util.DB;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TaskDao {

    public Task createTask(String taskName, int statusId, int userId, int categoryId) throws Exception {
        String sql = """
            INSERT INTO tasks (task_name, status_id, user_id, category_id, created_date, updated_date)
            VALUES (?, ?, ?, ?, NOW(), NOW())
            RETURNING id, task_name, created_date, updated_date
        """;

        try (Connection connection = DB.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            preparedStatement.setString(1, taskName);
            preparedStatement.setInt(2, statusId);
            preparedStatement.setInt(3, userId);
            preparedStatement.setInt(4, categoryId);

            try (ResultSet rs = preparedStatement.executeQuery()) {
                rs.next();

                // For create we don't have JOIN names, so return minimal Task object
                // You can just return null if you don't need the created Task instance.
                Timestamp createdTs = rs.getTimestamp("created_date");
                Timestamp updatedTs = rs.getTimestamp("updated_date");

                LocalDateTime created = createdTs != null ? createdTs.toLocalDateTime() : null;
                LocalDateTime updated = updatedTs != null ? updatedTs.toLocalDateTime() : null;

                return new Task(
                        rs.getInt("id"),
                        rs.getString("task_name"),
                        null,       // status_name (not joined)
                        null,       // username (not joined)
                        null,       // category_name (not joined)
                        created,
                        updated
                );
            }
        }
    }

    public void updateTask(int taskId, String newTaskName, int newStatusId) throws Exception {
        String sql = "UPDATE tasks SET task_name = ?, status_id = ?, updated_date = NOW() WHERE id = ?";
        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, newTaskName);
            ps.setInt(2, newStatusId);
            ps.setInt(3, taskId);
            if (ps.executeUpdate() == 0) throw new IllegalArgumentException("Task not found: " + taskId);
        }
    }

    public void assignTask(int taskId, int assigneeUserId, int inProgressStatusId) throws Exception {
        String sql = "UPDATE tasks SET user_id = ?, status_id = ?, updated_date = NOW() WHERE id = ?";
        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, assigneeUserId);
            ps.setInt(2, inProgressStatusId);
            ps.setInt(3, taskId);
            if (ps.executeUpdate() == 0) throw new IllegalArgumentException("Task not found: " + taskId);
        }
    }

    public void markTaskStatus(int taskId, int statusId) throws Exception {
        String sql = "UPDATE tasks SET status_id = ?, updated_date = NOW() WHERE id = ?";
        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, statusId);
            ps.setInt(2, taskId);
            if (ps.executeUpdate() == 0) throw new IllegalArgumentException("Task not found: " + taskId);
        }
    }

    public List<Task> listByUser(int userId) throws Exception {
        String sql =
                "SELECT t.id, u.name AS username, t.task_name, " +
                        "       s.status_name AS status_name, " +
                        "       c.category_name AS category_name, " +
                        "       t.created_date, t.updated_date " +
                        "FROM tasks t " +
                        "LEFT JOIN status s ON t.status_id = s.id " +
                        "LEFT JOIN category c ON t.category_id = c.id " +
                        "LEFT JOIN users u ON t.user_id = u.id " +
                        "WHERE t.user_id = ? " +
                        "ORDER BY t.updated_date DESC";

        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {
                List<Task> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    public List<Task> filterByNames(int userId, String statusName, String categoryName) throws Exception {

        StringBuilder sb = new StringBuilder(
                "SELECT t.id, u.name AS username, t.task_name, " +
                        "       s.status_name AS status_name, " +
                        "       c.category_name AS category_name, " +
                        "       t.created_date, t.updated_date " +
                        "FROM tasks t " +
                        "LEFT JOIN status s ON t.status_id = s.id " +
                        "LEFT JOIN category c ON t.category_id = c.id " +
                        "LEFT JOIN users u ON t.user_id = u.id " +
                        "WHERE t.user_id = ? "
        );

        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (statusName != null && !statusName.isBlank()) {
            sb.append(" AND s.status_name = ? ");
            params.add(statusName.trim());
        }

        if (categoryName != null && !categoryName.isBlank()) {
            sb.append(" AND c.category_name = ? ");
            params.add(categoryName.trim());
        }

        sb.append(" ORDER BY t.updated_date DESC");

        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sb.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
                List<Task> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    private Task map(ResultSet rs) throws Exception {
        Timestamp createdTs = rs.getTimestamp("created_date");
        Timestamp updatedTs = rs.getTimestamp("updated_date");

        LocalDateTime created = createdTs != null ? createdTs.toLocalDateTime() : null;
        LocalDateTime updated = updatedTs != null ? updatedTs.toLocalDateTime() : null;

        return new Task(
                rs.getInt("id"),                 // id
                rs.getString("task_name"),       // task_name
                rs.getString("status_name"),     // status_name
                rs.getString("username"),        // username
                rs.getString("category_name"),   // category_name
                created,                         // createdDate
                updated                          // updatedDate
        );
    }

    public boolean isTaskOwnedBy(int taskId, int userId) throws Exception {
        String sql = "SELECT 1 FROM tasks WHERE id = ? AND user_id = ?";
        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, taskId);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public List<Task> listStartableTasksByUser(int userId) throws Exception {
        String sql =
                "SELECT t.id, u.name AS username, t.task_name, " +
                        "       s.status_name AS status_name, " +
                        "       c.category_name AS category_name, " +
                        "       t.created_date, t.updated_date " +
                        "FROM tasks t " +
                        "LEFT JOIN status s ON t.status_id = s.id " +
                        "LEFT JOIN category c ON t.category_id = c.id " +
                        "LEFT JOIN users u ON t.user_id = u.id " +
                        "WHERE t.user_id = ? " +
                        "  AND s.status_name IN ('ready_to_pick', 'blocked') " +
                        "ORDER BY t.updated_date DESC";

        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {
                List<Task> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    public List<Task> listActiveByUser(int userId) throws Exception {
        String sql =
                "SELECT t.id, u.name AS username, t.task_name, " +
                        "       s.status_name AS status_name, " +
                        "       c.category_name AS category_name, " +
                        "       t.created_date, t.updated_date " +
                        "FROM tasks t " +
                        "LEFT JOIN status s ON t.status_id = s.id " +
                        "LEFT JOIN category c ON t.category_id = c.id " +
                        "LEFT JOIN users u ON t.user_id = u.id " +
                        "WHERE t.user_id = ? " +
                        "  AND s.status_name <> 'deleted' " +
                        "ORDER BY t.updated_date DESC";

        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {
                List<Task> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

}