-- Nirman 2.0 Database Schema

-- Users table (extends Clerk user data)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('owner', 'contractor') NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(15,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category ENUM('commercial', 'residential', 'infrastructure', 'industrial', 'healthcare', 'education') NOT NULL,
    specifications TEXT,
    deadline DATE NOT NULL,
    status ENUM('draft', 'active', 'bidding', 'awarded', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bids table
CREATE TABLE bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    contractor_id VARCHAR(255) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    materials_cost DECIMAL(15,2),
    labor_cost DECIMAL(15,2),
    equipment_cost DECIMAL(15,2),
    overhead_cost DECIMAL(15,2),
    start_date DATE,
    completion_date DATE,
    project_phases TEXT,
    milestones TEXT,
    technical_risks TEXT,
    financial_risks TEXT,
    timeline_risks TEXT,
    mitigation_strategies TEXT,
    permits TEXT,
    regulations TEXT,
    standards TEXT,
    certifications TEXT,
    profit_margin DECIMAL(5,2),
    roi DECIMAL(5,2),
    breakeven_point VARCHAR(100),
    contingency DECIMAL(5,2),
    status ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn') DEFAULT 'draft',
    ai_analysis JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project progress tracking
CREATE TABLE project_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    contractor_id VARCHAR(255) NOT NULL,
    phase_name VARCHAR(255) NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed', 'delayed') DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document uploads
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    bid_id INT,
    uploaded_by VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    document_type ENUM('specification', 'drawing', 'permit', 'certificate', 'progress_report', 'other') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('bid_received', 'bid_accepted', 'bid_rejected', 'project_update', 'deadline_reminder', 'compliance_alert') NOT NULL,
    related_project_id INT,
    related_bid_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (related_bid_id) REFERENCES bids(id) ON DELETE SET NULL
);

-- Contractor profiles and ratings
CREATE TABLE contractor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    company_description TEXT,
    specializations JSON,
    years_experience INT,
    team_size INT,
    certifications JSON,
    portfolio_images JSON,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project reviews and ratings
CREATE TABLE project_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    reviewer_id VARCHAR(255) NOT NULL,
    reviewed_id VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_bids_project ON bids(project_id);
CREATE INDEX idx_bids_contractor ON bids(contractor_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_progress_project ON project_progress(project_id);
