# To-Do Application

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
