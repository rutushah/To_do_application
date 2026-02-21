package com.todo;

import com.todo.cli.AuthCli;
import com.todo.cli.TaskCli;
import com.todo.model.User;
import com.todo.util.DB;
import java.sql.Connection;

public class Main {
    public static void main(String[] args) {
        try {
            AuthCli authCli = new AuthCli();
           while (true){
               User user = authCli.startAuthFlow();
               new TaskCli().start(user);
               authCli.logout();
           }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
