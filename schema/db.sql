-- Create the database
CREATE DATABASE form_builder_db;
USE form_builder_db;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the forms table
CREATE TABLE forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the fields table (supports various types of form fields)
CREATE TABLE fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., text, checkbox, radio, file-upload, slider, map-picker, etc.
    label VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255),
    options TEXT, -- JSON for storing configuration options for advanced fields
    required BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

-- Create the responses table
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    response_data JSON NOT NULL, -- JSON for storing user responses
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

-- Create a collaborators table for multi-user collaboration
CREATE TABLE collaborators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'editor') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enforce JSON validation for responses
-- Example: SELECT * FROM responses WHERE JSON_VALID(response_data);

-- Set permissions for a dedicated application user (optional, run as admin)
CREATE USER 'form_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE ON form_builder_db.* TO 'form_user'@'localhost';
REVOKE DELETE ON form_builder_db.* FROM 'form_user'@'localhost';

-- Enable logging (optional for monitoring, run as admin)
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

-- Sample data insertion for testing
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', 'hashed_password_here');

INSERT INTO forms (user_id, title, description, status) VALUES
(1, 'Feedback Form', 'A simple feedback form for website visitors', 'draft');

-- Sample form field entries for various types

-- Text field
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'text', 'Name', 'Enter your name', NULL, TRUE);

-- Email field
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'email', 'Email', 'Enter your email address', NULL, TRUE);

-- Radio button (gender selection)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'radio', 'Gender', NULL, '{"options": ["Male", "Female", "Other"]}', TRUE);

-- Textarea field (comments)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'textarea', 'Comments', 'Your feedback here', NULL, FALSE);

-- Map picker field
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'map-picker', 'Pick a Location', 'Select a location on the map', '{"latitude": "0", "longitude": "0"}', TRUE);

-- QR Code generator field
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'qrcode', 'Generate QR Code', 'Enter the URL or text for the QR code', '{"data": "https://example.com"}', TRUE);

-- Captcha field (e.g., reCAPTCHA)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'captcha', 'Verify You Are Human', NULL, '{"captcha_type": "recaptcha", "site_key": "your_site_key", "secret_key": "your_secret_key"}', TRUE);

-- Button field (for form submission)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'button', 'Submit', NULL, '{"text": "Submit", "action": "submit_form"}', FALSE);

-- File upload field (for resumes or documents)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'file-upload', 'Upload Your Resume', NULL, '{"file_types": ["pdf", "docx"], "max_size": "5MB"}', TRUE);

-- Image upload field (for profile pictures)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'image-upload', 'Upload Your Profile Picture', NULL, '{"image_types": ["jpg", "png"], "max_size": "2MB"}', TRUE);

-- Slider field (for selecting a value, e.g., age)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'slider', 'Select Your Age', NULL, '{"min": 18, "max": 100, "step": 1}', TRUE);

-- Range field (for selecting experience level)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'range', 'Select Your Experience Level', NULL, '{"min": 0, "max": 10, "step": 1}', TRUE);

-- Date input field (for birth date)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'date', 'Select Your Birth Date', NULL, '{"min": "1900-01-01", "max": "2024-12-31", "format": "YYYY-MM-DD"}', TRUE);

-- Rating field (star rating)
INSERT INTO fields (form_id, type, label, placeholder, options, required) 
VALUES (1, 'rating', 'Rate Your Experience', NULL, '{"max_rating": 5, "step": 1}', TRUE);

-- Sample response data
INSERT INTO responses (form_id, response_data) VALUES
(1, '{"Name": "John Doe", "Email": "john@example.com", "Gender": "Male", "Comments": "Great website!"}');
