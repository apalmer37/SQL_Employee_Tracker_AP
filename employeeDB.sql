DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(37) NOT NULL,
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(37) NOT NULL,
    salary DECIMAL(8, 0) NOT NULL,
    department_id INT,
    PRIMARY KEY (id)
)

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    name_first VARCHAR(37) NOT NULL,
    name_last VARCHAR(37) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
)