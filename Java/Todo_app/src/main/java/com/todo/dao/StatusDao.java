package com.todo.dao;

import com.todo.util.DB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class StatusDao {
    public int getIdByName(String status_name) throws Exception{
        String sql = "select id from status where status_name = ?";
        try(Connection connection = DB.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)){

            preparedStatement.setString(1,status_name);
            try(ResultSet rs = preparedStatement.executeQuery()){
                if(rs.next()){
                    return rs.getInt("id");
                }
            }
        throw new IllegalArgumentException("Status not found: " + status_name);
        }
    }
}
