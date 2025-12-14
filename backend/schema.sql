-- Database schema for Smart Service Center
-- Run this SQL script to create the necessary tables

CREATE DATABASE IF NOT EXISTS smart_service;
USE smart_service;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  vehicles VARCHAR(255) DEFAULT NULL,
  memberSince DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX idx_email ON users(email);

