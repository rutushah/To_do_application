package com.todo.dao;

import com.todo.model.User;
import com.todo.util.DB;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.Optional;

public class UserDao {

    public Optional<User> findByName(String name) throws SQLException{
        String sql = "select id, name, password, created_date  from users  where name = ? ";

        try(Connection connection = DB.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql)){
            ps.setString(1,name);

            try(ResultSet rs = ps.executeQuery()){
                if(rs.next()){
                    return Optional.of(mapUser(rs));
                }else{
                    return Optional.empty();
                }
            }
        }
    }

    public User createUser(String name, String password) throws SQLException {
        String sql = """
            INSERT INTO users (name, password, created_date)
            VALUES (?, ?, NOW())
            RETURNING id, name, password, created_date
        """;

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapUser(rs);
                throw new SQLException("Failed to create user.");
            }
        }
    }

    public Optional<User> validateLogin(String name, String password) throws SQLException {
        String sql = "SELECT id, name, password, created_date FROM users WHERE name = ? AND password = ?";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapUser(rs));
                return Optional.empty();
            }
        }
    }

    private User mapUser(ResultSet rs) throws SQLException {
        int id = rs.getInt("id");
        String name = rs.getString("name");
        String password = rs.getString("password");
        Timestamp createdTs = rs.getTimestamp("created_date");
        LocalDateTime created = createdTs != null ? createdTs.toLocalDateTime() : null;

        return new User(id, name, password, created);
    }
}
