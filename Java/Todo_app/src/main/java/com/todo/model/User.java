package com.todo.model;

import java.time.LocalDateTime;

public class User {
    private int id;
    private String name;
    private String password;
    private LocalDateTime created_date;

    public User(int id, String name, String password, LocalDateTime created_date){
        this.id = id;
        this.name = name;
        this.password = password;
        this.created_date = created_date;
    }

    // generated getter methods for users
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getCreated_date() {
        return created_date;
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "'}";
    }
}
