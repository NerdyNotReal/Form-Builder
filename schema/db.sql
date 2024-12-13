-- Database creation
CREATE DATABASE form_builder_db;
USE form_builder_db;

-- Users Table (For storing basic user information)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,    -- Unique username for login
    email VARCHAR(100) UNIQUE NOT NULL,       -- User's email for notifications and recovery
    password_hash VARCHAR(255) NOT NULL,      -- Securely hashed password
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Forms Table (Stores forms created by users)
CREATE TABLE forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,              -- Form title
    description TEXT,                         -- Description for the form
    owner_id INT NOT NULL,                    -- Owner of the form (user ID)
    status ENUM('draft', 'published') DEFAULT 'draft',  -- Form status
    is_public BOOLEAN DEFAULT FALSE,          -- Whether form is public (viewable by others)
    theme_settings JSON,                      -- Custom styling for the entire form (colors, fonts, etc.)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Form Collaboration Table (Manages access to forms by collaborators)
CREATE TABLE form_collaborators (
    form_id INT NOT NULL,                     -- Form ID
    user_id INT NOT NULL,                     -- Collaborator's user ID
    role ENUM('viewer', 'editor', 'admin') DEFAULT 'viewer',  -- Access level (viewer, editor, admin)
    invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- When the user was invited
    accepted_at DATETIME,                     -- When the user accepted the invitation
    PRIMARY KEY (form_id, user_id),
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Form Elements Table (Stores form fields/elements for each form)
CREATE TABLE form_elements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,                     -- Associated form ID
    element_type VARCHAR(50) NOT NULL,        -- Type of element (e.g., text, checkbox, etc.)
    label VARCHAR(255),                       -- Label for the element
    is_required BOOLEAN DEFAULT FALSE,        -- Whether the element is mandatory
    position INT,                             -- Order of elements within the form
    regex_pattern VARCHAR(255),               -- Regex pattern for validation (e.g., email format, number range)
    properties JSON,                          -- Custom settings (for future flexibility)
    style_settings JSON,                      -- Custom styling for each element (e.g., colors, fonts)
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,                -- Unique file ID
    form_element_id INT NOT NULL,                      -- Foreign key linking to the form element (file upload)
    file_name VARCHAR(255) NOT NULL,                    -- Original file name (can be used to display to the user)
    file_path VARCHAR(255) NOT NULL,                    -- Path where the file is stored (could be on server or cloud storage)
    file_size INT,                                     -- Size of the file in bytes
    file_type VARCHAR(50),                             -- Type of file (e.g., image, document, pdf)
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,    -- When the file was uploaded
    FOREIGN KEY (form_element_id) REFERENCES form_elements(id) ON DELETE CASCADE
);


-- Form Responses Table (Tracks submissions for forms)
CREATE TABLE form_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,                     -- Associated form ID
    respondent_id INT,                        -- User who responded (can be NULL for anonymous users)
    response_data JSON,                       -- Store answers as JSON (e.g., key-value pairs)
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id)
);

-- Simplified index to improve search performance on form elements by form
CREATE INDEX idx_form_elements_form_id ON form_elements(form_id);
