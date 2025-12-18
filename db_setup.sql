-- Create database
CREATE DATABASE IF NOT EXISTS hostel_db;
USE hostel_db;

-- ================= HOSTELS =================
CREATE TABLE hostels (
    hostel_id INT PRIMARY KEY,
    hostel_name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    total_rooms INT
);

-- ================= STUDENTS =================
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M','F')),
    phone VARCHAR(15),
    email VARCHAR(100)
);

-- ================= ROOM TYPES =================
CREATE TABLE roomtypes (
    type_name VARCHAR(50) PRIMARY KEY,
    default_price DECIMAL(10,2)
);

-- ================= ROOMS =================
CREATE TABLE rooms (
    room_id INT PRIMARY KEY,
    hostel_id INT,
    type_name VARCHAR(50),
    room_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Available',
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id)
);

-- ================= ALLOCATIONS =================
CREATE TABLE allocations (
    allocation_id INT PRIMARY KEY,
    student_id INT,
    room_id INT,
    allocation_date DATE,
    checkout_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- ================= PAYMENTS =================
CREATE TABLE payments (
    payment_id INT PRIMARY KEY,
    student_id INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    description VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
