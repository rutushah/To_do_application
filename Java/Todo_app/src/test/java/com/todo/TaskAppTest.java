package com.todo;

import com.todo.model.Task;
import com.todo.model.User;
import com.todo.service.AuthService;
import com.todo.service.TaskService;
import com.todo.util.DB;
import org.junit.jupiter.api.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TaskAppTest {

    static AuthService authService;
    static TaskService taskService;

    @BeforeAll
    static void setup() throws Exception {

        // Step 1 — ensure DB exists by connecting to default postgres DB
        try (Connection c = DriverManager.getConnection(
                "jdbc:postgresql://localhost:5432/postgres",
                "rutushah",
                ""
        );
             Statement st = c.createStatement()) {

            st.execute("SELECT 1 FROM pg_database WHERE datname = 'todo_test'");
            var rs = st.getResultSet();

            if (!rs.next()) {
                st.execute("CREATE DATABASE todo_test");
            }
        }

        // Step 2 — now point app to todo_test
        System.setProperty("TODO_DB_URL", "jdbc:postgresql://localhost:5432/todo_test");
        System.setProperty("TODO_DB_USER", "rutushah");
        System.setProperty("TODO_DB_PASS", "");

        // Step 3 — reset schema every test run
        try (Connection c = DB.getConnection();
             Statement st = c.createStatement()) {

            st.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
        }

        // Step 4 — run schema.sql
        String schema = Files.readString(Paths.get("src/test/resources/schema.sql"));
        try (Connection c = DB.getConnection();
             Statement st = c.createStatement()) {

            st.execute(schema);
        }

        authService = new AuthService();
        taskService = new TaskService();
        System.out.println("✅ DB schema loaded, starting tests...");
    }

    @Test
    @Order(1)
    void registerUser_success() throws Exception {
        User u = authService.register("rutu_test", "pass123");
        assertNotNull(u);
        assertEquals("rutu_test", u.getName());
    }

    @Test
    @Order(2)
    void login_success() throws Exception {
        User u = authService.login("rutu_test", "pass123");
        assertNotNull(u);
        assertTrue(authService.isLoggedIn());
        assertEquals("rutu_test", authService.getCurrentUser().getName());
    }

    @Test
    @Order(3)
    void addTask_success_shouldSaveCategoryAndStatusNames() throws Exception {
        User u = authService.login("rutu_test", "pass123");

        taskService.addTask("Finish assignment", u.getId(), "work");

        List<Task> tasks = taskService.viewMyTasks(u.getId());
        assertFalse(tasks.isEmpty());

        Task t = tasks.get(0);
        assertEquals("Finish assignment", t.getTask_name());
        assertEquals("work", t.getCategoryName());
        assertEquals("ready_to_pick", t.getStatusName());
        assertNotNull(t.getCreatedDate());
        assertNotNull(t.getUpdatedDate());
    }

    @Test
    @Order(4)
    void filterByNames_shouldWork() throws Exception {
        User u = authService.login("rutu_test", "pass123");

        List<Task> filtered = taskService.filterMyTasksByNames(u.getId(), "ready_to_pick", "work");
        assertFalse(filtered.isEmpty());
        assertTrue(filtered.stream().allMatch(t -> "ready_to_pick".equals(t.getStatusName())));
        assertTrue(filtered.stream().allMatch(t -> "work".equals(t.getCategoryName())));
    }

    @Test
    @Order(5)
    void startTask_onlyReadyOrBlocked_shouldMoveToInProgress() throws Exception {
        User u = authService.login("rutu_test", "pass123");

        List<Task> startable = taskService.getStartableTasks(u.getId());
        assertFalse(startable.isEmpty());

        Task toStart = startable.get(0);
        taskService.startTask(toStart.getId(), u.getId());

        List<Task> inProgress = taskService.filterMyTasksByNames(u.getId(), "in_progress", null);
        assertTrue(inProgress.stream().anyMatch(t -> t.getId() == toStart.getId()));
    }
}