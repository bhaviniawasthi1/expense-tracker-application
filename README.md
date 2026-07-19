# VaultIQ — Expense Tracker Application

A full-stack expense tracker built with **Spring Boot**, **Hibernate**, **REST API**, and **MySQL**. Users can record transactions, categorize expenses, and generate reports.

## Features

- **Add Transactions** — Record income or expense entries with description, amount, date, and category
- **Categorize Expenses** — Assign every transaction to a category (Food, Transport, Shopping, etc.)
- **Generate Reports** — View total income, total expense, balance, and an expense breakdown by category with visual bar charts
- **Dashboard** — Summary cards and recent transactions at a glance
- **Transaction Management** — View all transactions and delete unwanted ones

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Backend   | Java 17, Spring Boot 3.2.4     |
| ORM       | Hibernate (JPA)                |
| API       | REST (JSON)                    |
| Database  | MySQL                          |
| Frontend  | HTML, CSS, JavaScript (vanilla) |

## Project Structure

```
expense-tracker-application/
├── pom.xml
├── sql/schema.sql
└── src/main/
    ├── java/com/vaultiq/
    │   ├── VaultIqApplication.java
    │   ├── config/WebConfig.java
    │   ├── model/Category.java
    │   ├── model/Transaction.java
    │   ├── repository/CategoryRepository.java
    │   ├── repository/TransactionRepository.java
    │   ├── service/CategoryService.java
    │   ├── service/TransactionService.java
    │   ├── controller/CategoryController.java
    │   └── controller/TransactionController.java
    └── resources/
        ├── application.properties
        └── static/
            ├── index.html
            ├── add-transaction.html
            ├── transactions.html
            ├── reports.html
            ├── css/style.css
            └── js/app.js
```

## Setup Instructions

### Prerequisites

- Java 17 or later
- Maven
- MySQL Server

### Step 1 — Create the database

Open your MySQL command line and run:

```sql
CREATE DATABASE IF NOT EXISTS vaultiq;
USE vaultiq;
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
INSERT IGNORE INTO categories (name, description) VALUES
    ('Food & Dining', 'Meals, groceries, and dining out'),
    ('Transportation', 'Fuel, public transit, and vehicle maintenance'),
    ('Shopping', 'Clothing, electronics, and retail purchases'),
    ('Entertainment', 'Movies, games, and leisure activities'),
    ('Bills & Utilities', 'Electricity, water, internet, and subscriptions'),
    ('Healthcare', 'Medical expenses and pharmacy'),
    ('Income', 'Salary, freelance, and other earnings');
```

Or run the SQL file directly:

```sql
source C:/Users/BIT/IdeaProjects/expense-tracker-application/sql/schema.sql;
```

### Step 2 — Configure database credentials

Edit `src/main/resources/application.properties` and update the password if your MySQL root password is different:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vaultiq
spring.datasource.username=root
spring.datasource.password=root
```

### Step 3 — Start the server

```bash
mvn spring-boot:run
```

The server starts at `http://localhost:8080`.

### Step 4 — Open the frontend

Open your browser and navigate to:

```
http://localhost:8080/index.html
```

## API Endpoints

| Method | Endpoint                          | Description                 |
|--------|-----------------------------------|-----------------------------|
| GET    | `/api/transactions`               | List all transactions       |
| GET    | `/api/transactions/{id}`          | Get a single transaction    |
| POST   | `/api/transactions`               | Create a transaction        |
| DELETE | `/api/transactions/{id}`          | Delete a transaction        |
| GET    | `/api/transactions/report`        | Get income/expense report   |
| GET    | `/api/categories`                 | List all categories         |
| POST   | `/api/categories`                 | Create a category           |

## Pages

| Page              | URL                        | Purpose                          |
|-------------------|----------------------------|----------------------------------|
| Dashboard         | `/index.html`               | Summary cards + recent entries   |
| Add Transaction   | `/add-transaction.html`     | Form to add income/expense       |
| Transactions      | `/transactions.html`        | Full list with delete            |
| Reports           | `/reports.html`             | Balance + category breakdown     |

## Built By

**Bhavini Awasthi**
