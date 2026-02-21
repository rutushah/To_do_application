# To-Do Application

# 📋 Collaborative To-Do List Application

## 👨‍💻 Team Members
- Rutu Ketankumar Shah  
- Monica Pasupuleti  
- Tanmayee Swathi Moganti  

---

## 📚 Course Information
- **University:** University of the Cumberlands  
- **Course:** MSCS-632-M20 – Advanced Programming Languages  
- **Professor:** Dr. Jay Thom  
- **Submission Date:** 02/20/2026  

---

## 🧾 Project Overview

This project is a **command-line based collaborative To-Do List Application** developed using **Java** and **JavaScript** as part of cross-language application development.

The application allows multiple users to manage tasks collaboratively with features such as:

- User Registration & Login  
- Task Creation, Update & Deletion  
- Task Assignment  
- Task Categorization  
- Task Status Tracking  
- Timestamp-based Audit Logs  
- Task Filtering by Status  
- Concurrent Multi-User Access  

Both implementations are integrated with a **PostgreSQL database** for persistent storage and data consistency.

---

## 🗄️ Database Integration

The application uses a PostgreSQL database consisting of the following entities:

- Users  
- Tasks  
- Category  
- Status  

Task status lifecycle includes:
- NEW  
- MODIFIED  
- COMPLETED  
- DELETED  

---

## ⚙️ Technologies Used

- Java (OOP & Thread-based Concurrency)  
- JavaScript / Node.js (Async Programming)  
- PostgreSQL  
- JDBC  

---

## 🔌 JDBC Connection String

```bash
jdbc:postgresql://localhost:5432/todo_app
## 🗄️ Local PostgreSQL Database Setup & Connection Guide

This application uses a locally hosted PostgreSQL database for development and testing.

### 📌 Database Credentials

| Property | Value      |
|----------|------------|
| Host     | localhost  |
| Port     | 5432       |
| Database | todo_app   |
| Username | rutushah   |
| Password | todo_pwd   |

---

## 🔌 Connect Using DBeaver

### Steps

1. Open **DBeaver**
2. Click on **Database → New Database Connection**
3. Select **PostgreSQL**
4. Enter the following details:

   - Host: `localhost`
   - Port: `5432`
   - Database: `todo_app`
   - Username: `rutushah`
   - Password: `todo_pwd`

5. Click **Test Connection**
6. If prompted, download the PostgreSQL driver.
7. Click **Finish**

You should now see the `todo_app` database in the Database Navigator panel.

---

## 🔌 Connect Using pgAdmin

### Steps

1. Open **pgAdmin**
2. Right-click on **Servers → Register → Server**

#### In the General tab:
- Name: `Local PostgreSQL`

#### In the Connection tab:
- Host name/address: `localhost`
- Port: `5432`
- Maintenance database: `todo_app`
- Username: `rutushah`
- Password: `todo_pwd`

3. Click **Save**

The `todo_app` database will now be available under your registered server.
