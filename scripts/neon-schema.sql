-- Nirman 2.0 Database Schema for Neon

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('owner', 'contractor')) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(15,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('commercial', 'residential', 'infrastructure', 'industrial', 'healthcare', 'education')) NOT NULL,
    specifications TEXT,
    deadline DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'bidding', 'awarded', 'in_progress', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    contractor_id INTEGER NOT NULL,
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
    status VARCHAR(20) CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'submitted',
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project progress tracking
CREATE TABLE IF NOT EXISTS project_progress (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    contractor_id INTEGER NOT NULL,
    phase_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed')) DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document uploads
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    project_id INTEGER,
    bid_id INTEGER,
    uploaded_by INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    document_type VARCHAR(50) CHECK (document_type IN ('specification', 'drawing', 'permit', 'certificate', 'progress_report', 'other')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('bid_received', 'bid_accepted', 'bid_rejected', 'project_update', 'deadline_reminder', 'compliance_alert')) NOT NULL,
    related_project_id INTEGER,
    related_bid_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (related_bid_id) REFERENCES bids(id) ON DELETE SET NULL
);

-- Contractor profiles and ratings
CREATE TABLE IF NOT EXISTS contractor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    company_description TEXT,
    specializations JSONB,
    years_experience INTEGER,
    team_size INTEGER,
    certifications JSONB,
    portfolio_images JSONB,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_projects INTEGER DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project reviews and ratings
CREATE TABLE IF NOT EXISTS project_reviews (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    reviewed_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_bids_project ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_bids_contractor ON bids(contractor_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_progress_project ON project_progress(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_progress_updated_at BEFORE UPDATE ON project_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contractor_profiles_updated_at BEFORE UPDATE ON contractor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
