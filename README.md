# Task Management Toolkit

Task Management Toolkit is a React-based web application that allows users to manage tasks and generate QR codes. It supports CSV file operations and provides functionality to export QR codes as CSV files or PDFs. The backend is powered by an Express.js API and a MySQL database to store QR codes.

## Features

- Upload and display CSV files.
- Generate QR codes for custom text inputs.
- Display generated QR codes in a table.
- Export QR codes to CSV files.
- Export QR codes to PDF files, including the QR code images.

## Installation

To get started with the Task Management Toolkit, follow these steps:

1. Install the necessary packages using npm:

   ```bash
   npm install and npm install express mysql cors nodemon

2. Create a Database

CREATE DATABASE task_management_toolkit;
USE task_management_toolkit;

CREATE TABLE qrcodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  qr_code_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


## Run Project

1. In different terminals input npm start (for database connection) and npm run dev (to run the project) 




dev@rodylinBernales