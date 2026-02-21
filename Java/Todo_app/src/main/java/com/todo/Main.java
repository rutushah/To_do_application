package com.todo;

import com.todo.util.DB;
import java.sql.Connection;

public class Main {
    public static void main(String[] args) {
        try {
            Connection connection = DB.getConnection();
            if(connection!= null){
                System.out.println("Connected to todo_app successfully!!!!");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
