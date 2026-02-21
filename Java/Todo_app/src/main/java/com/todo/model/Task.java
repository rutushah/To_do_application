package com.todo.model;

import java.time.LocalDateTime;

public class Task {

    private int id;
    private String task_name;
    private String username;
//    private int statusId;
    private int userId;
//    private int categoryId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String status_name;
    private String category_name;




    public Task(int id, String task_name, String status_name, String username, String category_name,
                LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.task_name = task_name;
        this.status_name = status_name;
        this.username = username;
        this.category_name = category_name;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public int getId() {
        return id;
    }

    public String getTask_name() {
        return task_name;
    }

//    public int getStatusId() {
//        return statusId;
//    }

//    public int getUserId() {
//        return userId;
//    }

//    public int getCategoryId() {
//        return categoryId;
//    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public String getUsername() {
        return username;
    }

    public String getStatusName() {
        return status_name;
    }

    public String getCategoryName() {
        return category_name;
    }
}
