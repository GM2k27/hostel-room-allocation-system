-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hostel_db;

USE hostel_db;

-- Create hostels table
CREATE TABLE IF NOT EXISTS hostels (
    hostel_id INT PRIMARY KEY,
    hostel_name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    total_rooms INT
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    gender ENUM('Male', 'Female', 'Other')
);

-- Create room_types table
CREATE TABLE IF NOT EXISTS room_types (
    room_type_id INT PRIMARY KEY,
    room_type_name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    price_per_semester DECIMAL(10, 2)
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    room_id INT PRIMARY KEY,
    hostel_id INT,
    room_type_id INT,
    room_number VARCHAR(20) NOT NULL,
    floor INT,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id) ON DELETE SET NULL
);

-- Create allocations table
CREATE TABLE IF NOT EXISTS allocations (
    allocation_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20),
    room_id INT,
    allocation_date DATE,
    checkout_date DATE,
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    allocation_id INT,
    payment_date DATE,
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    FOREIGN KEY (allocation_id) REFERENCES allocations(allocation_id) ON DELETE CASCADE
);
