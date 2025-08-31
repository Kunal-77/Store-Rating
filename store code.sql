-- Drop existing database if it exists
DROP DATABASE IF EXISTS store_ratings;

-- Create new database
CREATE DATABASE store_ratings;
USE store_ratings;

-- Create 'users' table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('ADMIN', 'USER', 'OWNER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create 'stores' table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(400),
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create 'ratings' table
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Insert demo users
INSERT INTO users (name, email, password, address, role) VALUES
('Admin Demo User With Long Name', 'admin@example.com', '$2b$12$lxekEsErIdSPvGi4ik6etpFUB75LF9yvTNACLtLS1B1yZi8DMVa', 'Demo Admin Address', 'ADMIN'),
('Store Owner Demo With Long Name', 'owner@example.com', '$2b$12$EYgejC1CELi6Wp.LG/f75zu/F73V8YHaQgNDy/HR8EtBfxAF0tUG', 'Demo Owner Address', 'OWNER'),
('Normal User Demo With Long Name', 'user@example.com', '$2b$12$Awria/26btvXLaT4zPDdb.ByIihYK4fQ0dLr14W3iTy3i8j5kO15m', 'Demo User Address', 'USER');

-- Insert demo stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('Demo Store One', 'store1@example.com', 'Demo Store Address 1', (SELECT id FROM users WHERE email = 'owner@example.com')),
('Demo Store Two', 'store2@example.com', 'Demo Store Address 2', (SELECT id FROM users WHERE email = 'owner@example.com'));

-- Insert demo ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
((SELECT id FROM users WHERE email = 'user@example.com'), (SELECT id FROM stores WHERE name = 'Demo Store One'), 5),
((SELECT id FROM users WHERE email = 'user@example.com'), (SELECT id FROM stores WHERE name = 'Demo Store Two'), 4);