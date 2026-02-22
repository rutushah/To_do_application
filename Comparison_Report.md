# Cross-Language Implementation Comparison Report: Java vs. JavaScript To-Do Application

**Team Members:** Rutu Ketankumar Shah, Monica Pasupuleti, Tanmayee Swathi Moganti  
**University:** University of the Cumberlands  
**Course:** MSCS-632-M20 – Advanced Programming Languages  
**Professor:** Dr. Jay Thom  
**Date:** February 20, 2026

---

## Abstract

This report presents a comparative analysis of a collaborative to-do list application implemented in both Java and JavaScript. The application supports multi-user task management with PostgreSQL database integration, featuring user authentication, task CRUD operations, status tracking, and concurrent access capabilities. The comparison examines language-specific characteristics, implementation approaches, syntax differences, concurrency models, and development experiences. Key findings reveal that Java's strongly-typed, object-oriented paradigm offers compile-time safety and explicit threading mechanisms, while JavaScript's dynamic typing and asynchronous programming model provides flexibility and simplified concurrent operations through Promises and async/await patterns.

---

## 1. Introduction

Modern software development often requires evaluating multiple programming languages to determine optimal solutions for specific problem domains. This report analyzes the implementation of a collaborative to-do list application in Java and JavaScript, two fundamentally different programming languages. Java represents a statically-typed, compiled, object-oriented language with explicit concurrency control, while JavaScript embodies a dynamically-typed, interpreted language with event-driven asynchronous execution. Both implementations interact with a shared PostgreSQL database and provide identical functionality through command-line interfaces, enabling direct comparison of language characteristics and development approaches.

---

## 2. Architecture and Design Comparison

### 2.1 Project Structure

Both implementations follow a layered architecture pattern with clear separation of concerns:

**Java Implementation:**
```
Java/Todo_app/src/main/java/com/todo/
├── cli/          # Command-line interface
├── dao/          # Data Access Objects
├── model/        # Domain models
├── service/      # Business logic
├── util/         # Database utilities
└── Main.java     # Application entry point
```

**JavaScript Implementation:**
```
JavaScript/src/
├── config/       # Database configuration
├── dao/          # Data Access Objects
├── models/       # Domain models
├── services/     # Business logic
└── index.js      # Application entry point
```

The structural similarity demonstrates that both languages support modular, maintainable architecture. However, Java enforces package-based organization through its file system structure, while JavaScript uses ES6 modules with explicit import/export statements.

### 2.2 Type Systems

**Java (Static Typing):**
```java
public class Task {
    private int id;
    private String taskName;
    private String statusName;
    private String username;
    private String categoryName;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    
    public Task(int id, String taskName, String statusName, 
                String username, String categoryName, 
                LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.taskName = taskName;
        this.statusName = statusName;
        this.username = username;
        this.categoryName = categoryName;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
```

**JavaScript (Dynamic Typing):**
```javascript
export class Task {
  constructor(id, taskName, statusId, userId, categoryId, createdDate, updatedDate) {
    this.id = id;
    this.taskName = taskName;
    this.statusId = statusId;
    this.userId = userId;
    this.categoryId = categoryId;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
```

Java's static typing provides compile-time type checking, preventing type-related errors before runtime. The explicit type declarations (int, String, LocalDateTime) serve as documentation and enable IDE autocomplete features. JavaScript's dynamic typing offers flexibility but shifts type validation to runtime, requiring more comprehensive testing to catch type-related issues.

---

## 3. Database Integration

### 3.1 Connection Management

**Java (JDBC):**
```java
public class DB {

    private static String jdbcURL = System.getProperty("TODO_DB_URL","jdbc:postgresql://localhost:5432/todo_app");
    private static String username = System.getProperty("TODO_DB_USER", "rutushah");
    private static String password = System.getProperty("TODO_DB_PASS", "todo_pwd");

    public static Connection getConnection() throws SQLException{
        Connection c = DriverManager.getConnection(jdbcURL, username, password);
        return c;
    }
}
```

**JavaScript (pg library):**
```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'todo_app',
  user: 'todoappuser',
  password: 'todo_pwd'
});

export const query = (text, params) => pool.query(text, params);
```

Java uses JDBC with individual connection creation per operation, requiring explicit resource management through try-with-resources statements. JavaScript employs connection pooling via the pg library, automatically managing connection lifecycle and improving performance through connection reuse.

### 3.2 Query Execution

**Java (PreparedStatement):**
```java
public List<Task> listByUser(int userId) throws Exception {
    String sql = "SELECT t.id, u.name AS username, t.task_name, " +
                 "s.status_name, c.category_name, " +
                 "t.created_date, t.updated_date " +
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
```

**JavaScript (Parameterized Queries):**
```javascript
async getTasksByUserId(userId) {
  const sql = `SELECT t.id, u.name AS username, t.task_name,
                      s.status_name, c.category_name,
                      t.created_date, t.updated_date
               FROM tasks t
               LEFT JOIN status s ON t.status_id = s.id
               LEFT JOIN category c ON t.category_id = c.id
               LEFT JOIN users u ON t.user_id = u.id
               WHERE t.user_id = $1 AND s.status_name != 'deleted'
               ORDER BY t.updated_date DESC`;
  const result = await query(sql, [userId]);
  return result.rows;
}
```

Java requires nested try-with-resources blocks for proper resource cleanup, with explicit iteration through ResultSet. JavaScript's async/await syntax provides cleaner, more readable code with automatic resource management. The parameterization differs: Java uses `?` placeholders with positional binding, while PostgreSQL's JavaScript driver uses `$1, $2` notation.

---

## 4. Concurrency Models

### 4.1 Java Thread-Based Concurrency

Java implements concurrency through explicit thread management:

```java
// Simulated concurrent access in tests
ExecutorService executor = Executors.newFixedThreadPool(2);
Future<?> future1 = executor.submit(() -> {
    taskService.editTask(taskId, "Updated by Thread 1");
});
Future<?> future2 = executor.submit(() -> {
    taskService.editTask(taskId, "Updated by Thread 2");
});
```

Java's concurrency model requires:
- Explicit thread creation and management
- Synchronization mechanisms (synchronized blocks, locks)
- Thread pool management for resource efficiency
- Exception handling across thread boundaries

### 4.2 JavaScript Asynchronous Concurrency

JavaScript implements concurrency through asynchronous operations:

```javascript
async function handleConcurrentOperations() {
  const promise1 = taskService.editTaskName(taskId, "Updated by User 1", userId1);
  const promise2 = taskService.editTaskName(taskId, "Updated by User 2", userId2);
  
  await Promise.all([promise1, promise2]);
}
```

JavaScript's concurrency model features:
- Single-threaded event loop with non-blocking I/O
- Promise-based asynchronous operations
- Async/await syntax for sequential-looking asynchronous code
- Automatic handling of concurrent database operations

The fundamental difference lies in execution models: Java uses true parallelism with multiple threads executing simultaneously, while JavaScript uses cooperative multitasking where operations yield control during I/O operations.

---

## 5. Error Handling

**Java (Checked Exceptions):**
```java
public Task addTask(String taskName, int userId, String categoryName) throws Exception {
    if (taskName == null || taskName.trim().isEmpty())
        throw new IllegalArgumentException("Task name cannot be empty.");
    
    int categoryId = categoryDao.getIdByName(categoryName);
    int ready = statusDao.getIdByName("ready_to_pick");
    
    return taskDao.createTask(taskName.trim(), ready, userId, categoryId);
}
```

**JavaScript (Try-Catch):**
```javascript
async addTask(taskName, userId, categoryId) {
  const statusId = 1; // ready_to_pick
  return await this.taskDAO.createTask(taskName, statusId, userId, categoryId);
}

// Error handling at service layer
async editTaskName(taskId, taskName, userId) {
  const task = await this.taskDAO.getTaskById(taskId);
  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized');
  }
  if (task.statusId === 5) {
    throw new Error('Cannot edit deleted task');
  }
  return await this.taskDAO.updateTaskName(taskId, taskName);
}
```

Java enforces exception handling through checked exceptions, requiring explicit throws declarations or try-catch blocks. This compile-time enforcement ensures error handling is considered during development. JavaScript uses unchecked exceptions, providing flexibility but requiring disciplined error handling practices. The async/await pattern in JavaScript necessitates try-catch blocks for proper error handling in asynchronous operations.

---

## 6. Testing Approaches

### 6.1 Java Testing (JUnit + Testcontainers)

```java
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
```

Java testing utilizes:
- JUnit 5 for test framework
- Testcontainers for isolated PostgreSQL instances
- Maven Surefire plugin for test execution
- Strong type checking during test compilation

### 6.2 JavaScript Testing (Jest)

```javascript
test('TC-001: Add task successfully', async () => {
  const mockTaskDAO = {
    createTask: jest.fn().mockResolvedValue({
      id: 1,
      taskName: 'Test Task',
      statusId: 1,
      userId: 1,
      categoryId: 1
    })
  };
  
  const taskService = new TaskService();
  taskService.taskDAO = mockTaskDAO;
  
  const result = await taskService.addTask('Test Task', 1, 1);
  expect(result.taskName).toBe('Test Task');
});
```

JavaScript testing features:
- Jest framework with ES modules support
- Dependency injection for mocking
- Async/await test patterns
- Runtime type validation through assertions

The testing approaches reflect language characteristics: Java's compile-time type checking reduces certain test requirements, while JavaScript's dynamic nature necessitates more comprehensive runtime validation tests.

---

## 7. Dependency Management

**Java (Maven - pom.xml):**
```xml
 <!-- Postgres driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.10</version>
        </dependency>

        <!-- JUnit (API + Engine) -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
```

**JavaScript (npm - package.json):**
```json
{
  "dependencies": {
    "pg": "^8.11.3",
    "readline-sync": "^1.4.10"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "@jest/globals": "^29.7.0"
  }
}
```

Maven provides centralized dependency management with transitive dependency resolution and lifecycle management. npm offers a simpler configuration with semantic versioning and a vast ecosystem of packages. Java's dependency management integrates with the build lifecycle, while JavaScript's approach focuses on runtime dependency resolution.

---

## 8. Development Experience and Challenges

### 8.1 Java Development Experience

**Advantages:**
- Compile-time error detection prevents many runtime issues
- Strong IDE support with intelligent code completion
- Explicit type declarations serve as documentation
- Thread-based concurrency provides fine-grained control
- Enterprise-grade tooling and frameworks

**Challenges:**
- Verbose syntax requires more boilerplate code
- Explicit resource management (try-with-resources)
- Complex exception handling hierarchy
- Longer development cycles due to compilation
- Steeper learning curve for concurrency primitives

### 8.2 JavaScript Development Experience

**Advantages:**
- Concise syntax reduces boilerplate
- Flexible dynamic typing accelerates prototyping
- Async/await simplifies asynchronous code
- Rapid development and testing cycles
- Extensive npm ecosystem

**Challenges:**
- Runtime type errors require comprehensive testing
- Callback hell (mitigated by async/await)
- Implicit type coercion can cause subtle bugs
- Less structured error handling
- ES modules compatibility issues with testing frameworks

---

## 9. Performance Considerations

### 9.1 Execution Performance

Java's compiled bytecode and JVM optimizations (JIT compilation) generally provide superior raw execution performance. The strongly-typed nature enables aggressive compiler optimizations. However, JVM startup time adds overhead for short-running applications.

JavaScript's interpreted nature (with V8 engine optimizations) offers competitive performance for I/O-bound operations like database queries. The single-threaded event loop efficiently handles concurrent I/O operations without thread context-switching overhead.

### 9.2 Memory Management

Java employs automatic garbage collection with configurable collectors (G1, ZGC). The explicit type system allows predictable memory allocation patterns. However, object creation overhead and garbage collection pauses can impact performance.

JavaScript uses automatic garbage collection optimized for short-lived objects. The dynamic typing system introduces memory overhead for type information storage. Connection pooling in the JavaScript implementation provides better resource utilization than Java's per-operation connection creation.

---

## 10. Language Characteristics Impact on Implementation

### 10.1 Object-Oriented vs. Prototype-Based

Java's class-based inheritance provides clear hierarchies and interfaces:
```java
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
```

JavaScript's prototype-based inheritance with ES6 classes offers flexibility:
```javascript
export class TaskDAO {
  async createTask(taskName, statusId, userId, categoryId) { }
  async getTasksByUserId(userId) { }
}
```

### 10.2 Functional Programming Features

Both languages support functional programming, but with different emphasis:

**Java (Streams API):**
```java
    public void markCompleted(int taskId, int loggedInUserId) throws Exception {
        if (!taskDao.isTaskOwnedBy(taskId, loggedInUserId))
            throw new IllegalArgumentException("You are not allowed to modify this task.");

        int completed = statusDao.getIdByName("completed");
        taskDao.markTaskStatus(taskId, completed);
    }
```

**JavaScript (Array Methods):**
```javascript
const completedTasks = tasks.filter(t => t.status_name === 'completed');
```

JavaScript's first-class functions and arrow syntax provide more natural functional programming patterns, while Java's functional features feel more like additions to an object-oriented foundation.

---

## 11. Conclusion

The comparative analysis reveals that both Java and JavaScript successfully implement the collaborative to-do list application with identical functionality, yet each language's characteristics significantly influenced implementation approaches. Java's static typing, explicit concurrency control, and compile-time safety make it suitable for large-scale enterprise applications requiring predictable behavior and strong type guarantees. The verbose syntax and explicit resource management increase development time but provide clarity and maintainability.

JavaScript's dynamic typing, asynchronous programming model, and concise syntax enable rapid development and natural handling of I/O-bound operations. The flexibility comes at the cost of runtime type safety, requiring comprehensive testing strategies. The async/await pattern simplifies concurrent database operations compared to Java's explicit thread management.

For this specific application—a database-driven CLI tool with concurrent access requirements—JavaScript's asynchronous model and connection pooling provide practical advantages in code simplicity and resource efficiency. However, Java's type safety and explicit error handling would be preferable for applications requiring stronger compile-time guarantees and complex business logic.

The choice between Java and JavaScript ultimately depends on project requirements, team expertise, and operational context. Java excels in scenarios demanding type safety, explicit control, and enterprise integration, while JavaScript thrives in rapid development environments with I/O-intensive operations and flexible requirements.

---

## References

Oracle. (2024). *Java SE 23 Documentation*. https://docs.oracle.com/en/java/javase/23/

Mozilla Developer Network. (2024). *JavaScript Guide*. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide

Node.js Foundation. (2024). *Node.js Documentation*. https://nodejs.org/docs/latest/api/

PostgreSQL Global Development Group. (2024). *PostgreSQL 15 Documentation*. https://www.postgresql.org/docs/15/

Bloch, J. (2018). *Effective Java* (3rd ed.). Addison-Wesley Professional.

Haverbeke, M. (2018). *Eloquent JavaScript* (3rd ed.). No Starch Press.

---

## Appendix: Key Implementation Statistics

| Metric | Java | JavaScript |
|--------|------|------------|
| Total Lines of Code | ~1,500 | ~800 |
| Number of Classes/Modules | 14 | 8 |
| Testing Framework | JUnit | Node.js Test Suite |
| Dependencies | JDBC, PostgreSQL Drive | pg, Node Modules |
| Average Method Length | 15 lines | 10 lines |
| Database Connection Model | Per-operation JDBC Connection | Connection pool |
| Concurrency Model | Transaction-level Concurrency | Asynchronous |
| Type System | Static | Dynamic |
| Compilation Required | Yes | No |
| Development Time | ~35 hours | ~30 hours |
|Implementation Effort| Higher due to strict typing | Lower due to flexible syntax | 
