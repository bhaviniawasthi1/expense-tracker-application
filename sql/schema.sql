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
