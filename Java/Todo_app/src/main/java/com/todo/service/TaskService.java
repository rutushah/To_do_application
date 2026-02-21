package com.todo.service;

import com.todo.dao.CategoryDao;
import com.todo.dao.StatusDao;
import com.todo.dao.TaskDao;
import com.todo.model.Task;

import java.util.List;

public class TaskService {
    private final TaskDao taskDao = new TaskDao();
    private final StatusDao statusDao = new StatusDao();
    private final CategoryDao categoryDao = new CategoryDao();

    public Task addTask(String taskName, int userId, String categoryName) throws Exception {
        if (taskName == null || taskName.trim().isEmpty())
            throw new IllegalArgumentException("Task name cannot be empty.");

        int categoryId = categoryDao.getIdByName(categoryName);

        int ready = statusDao.getIdByName("ready_to_pick");

        return taskDao.createTask(taskName.trim(), ready, userId, categoryId);
    }


    public void editTask(int taskId, String newName) throws Exception {
        if (newName == null || newName.trim().isEmpty())
            throw new IllegalArgumentException("Task name cannot be empty.");

        int inProgress = statusDao.getIdByName("in_progress");
        taskDao.updateTask(taskId, newName.trim(), inProgress);
    }

    public void assignTask(int taskId, int assigneeUserId) throws Exception {
        int inProgress = statusDao.getIdByName("in_progress");
        taskDao.assignTask(taskId, assigneeUserId, inProgress);
    }

    public void markCompleted(int taskId) throws Exception {
        int completed = statusDao.getIdByName("completed");
        taskDao.markTaskStatus(taskId, completed);
    }

    public void markBlocked(int taskId) throws Exception {
        int blocked = statusDao.getIdByName("blocked");
        taskDao.markTaskStatus(taskId, blocked);
    }

    public void deleteTask(int taskId) throws Exception {
        int deleted = statusDao.getIdByName("deleted");
        taskDao.markTaskStatus(taskId, deleted); // soft delete
    }

    public List<Task> viewMyTasks(int userId) throws Exception {
        return taskDao.listByUser(userId);
    }

//    public List<Task> filterMyTasks(int userId, Integer statusId, Integer categoryId) throws Exception {
//        return taskDao.filter(userId, statusId, categoryId);
//    }

    public List<Task> filterMyTasksByNames(int userId, String statusName, String categoryName) throws Exception {
        return taskDao.filterByNames(userId, statusName, categoryName);
    }

}

