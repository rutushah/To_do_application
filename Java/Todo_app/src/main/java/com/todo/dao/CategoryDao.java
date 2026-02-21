package com.todo.dao;

import com.todo.model.Category;
import com.todo.util.DB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CategoryDao {
    public List<Category> listAll() throws Exception {
        // category_id AS id -> matches your Category model
        String sql = "SELECT id AS id, category_name, display_name FROM category ORDER BY category_name";

        List<Category> out = new ArrayList<>();
        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                out.add(new Category(
                        rs.getInt("id"),
                        rs.getString("category_name"),
                        rs.getString("display_name")
                ));
            }
        }
        return out;
    }

    public boolean existsById(int categoryId) throws Exception {
        String sql = "SELECT 1 FROM category WHERE id = ?";
        try (Connection c = DB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, categoryId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public int getIdByName(String category_name) throws Exception {
        String sql = "SELECT id FROM category WHERE category_name = ?";

        try (Connection connection = DB.getConnection();
             PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setString(1, category_name);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        }
        throw new IllegalArgumentException("Category not found: " + category_name);
    }
}
