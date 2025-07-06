-- HLA Architects Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately as a superuser)
-- CREATE DATABASE hla_architects;
-- \c hla_architects;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ENUM types
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled');
CREATE TYPE project_category AS ENUM ('residential', 'commercial', 'education', 'container_architecture', 'leisure', 'mixed_use');
CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'in_discussion', 'quoted', 'accepted', 'declined', 'archived');
CREATE TYPE user_role AS ENUM ('admin', 'architect', 'project_manager', 'client', 'viewer');

-- ================================================
-- CORE TABLES
-- ================================================

-- Users/Team Members Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    phone VARCHAR(20),
    title VARCHAR(100),
    bio TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    years_experience INTEGER,
    specializations TEXT[],
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255),
    contact_person_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'South Africa',
    website_url TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Categories Table (for flexible category management)
CREATE TABLE project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    color_hex VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    category_id UUID REFERENCES project_categories(id),
    client_id UUID REFERENCES clients(id),
    lead_architect_id UUID REFERENCES users(id),
    
    -- Project Details
    location VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_area_sqm DECIMAL(10, 2),
    built_area_sqm DECIMAL(10, 2),
    number_of_floors INTEGER,
    
    -- Dates
    start_date DATE,
    planned_completion_date DATE,
    actual_completion_date DATE,
    design_start_date DATE,
    construction_start_date DATE,
    
    -- Financial
    estimated_budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'ZAR',
    
    -- Status and Visibility
    status project_status NOT NULL DEFAULT 'planning',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    show_on_website BOOLEAN DEFAULT true,
    
    -- SEO and Display
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured_image_url TEXT,
    
    -- Certifications and Awards
    leed_certification VARCHAR(50),
    green_star_rating VARCHAR(10),
    awards TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Images Table
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text VARCHAR(255),
    caption TEXT,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    image_type VARCHAR(50), -- 'exterior', 'interior', 'aerial', 'construction', 'detail', 'plan'
    photographer VARCHAR(100),
    date_taken DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Features Table (for flexible feature management)
CREATE TABLE project_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    feature_description TEXT,
    feature_category VARCHAR(100), -- 'sustainable', 'technology', 'design', 'structural'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Team Members (Many-to-Many relationship)
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- 'lead_architect', 'project_manager', 'designer', 'engineer'
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id, role)
);

-- Project Documents Table
CREATE TABLE project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    document_type VARCHAR(100), -- 'plan', 'elevation', 'section', 'detail', 'specification', 'report'
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    version VARCHAR(20),
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- CONTACT & LEADS TABLES
-- ================================================

-- Contact Form Submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    project_type VARCHAR(100),
    project_budget_range VARCHAR(100),
    message TEXT NOT NULL,
    status contact_status DEFAULT 'new',
    assigned_to UUID REFERENCES users(id),
    follow_up_date DATE,
    source VARCHAR(100), -- 'website', 'referral', 'social_media', 'advertising'
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscriptions
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    interests TEXT[], -- 'residential', 'commercial', 'sustainability', 'news'
    subscription_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- CONTENT MANAGEMENT TABLES
-- ================================================

-- Blog/News Articles
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_id UUID REFERENCES users(id),
    category VARCHAR(100), -- 'news', 'project_update', 'sustainability', 'design_insights'
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company Information/Settings
CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text', -- 'text', 'number', 'boolean', 'json', 'url'
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- ANALYTICS & TRACKING TABLES
-- ================================================

-- Website Analytics
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_url TEXT NOT NULL,
    page_title VARCHAR(255),
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project View Tracking
CREATE TABLE project_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Projects indexes
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_completion_date ON projects(actual_completion_date);
CREATE INDEX idx_projects_location ON projects(location);
CREATE INDEX idx_projects_slug ON projects(slug);

-- Project images indexes
CREATE INDEX idx_project_images_project ON project_images(project_id);
CREATE INDEX idx_project_images_featured ON project_images(is_featured);
CREATE INDEX idx_project_images_sort ON project_images(project_id, sort_order);

-- Project features indexes
CREATE INDEX idx_project_features_project ON project_features(project_id);

-- Project team indexes
CREATE INDEX idx_project_team_project ON project_team_members(project_id);
CREATE INDEX idx_project_team_user ON project_team_members(user_id);
CREATE INDEX idx_project_team_active ON project_team_members(is_active);

-- Contact submissions indexes
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at);
CREATE INDEX idx_contact_assigned ON contact_submissions(assigned_to);

-- Articles indexes
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_date ON articles(published_at);
CREATE INDEX idx_articles_slug ON articles(slug);

-- Analytics indexes
CREATE INDEX idx_page_views_date ON page_views(created_at);
CREATE INDEX idx_page_views_url ON page_views(page_url);
CREATE INDEX idx_project_views_project ON project_views(project_id);
CREATE INDEX idx_project_views_date ON project_views(created_at);

-- ================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ================================================
-- SEED DATA
-- ================================================

-- Insert default project categories
INSERT INTO project_categories (name, slug, description, icon_name, color_hex, sort_order) VALUES
('Residential', 'residential', 'Custom homes and residential developments that enhance living experiences', 'home', '#2D5A3D', 1),
('Commercial', 'commercial', 'Office buildings and commercial spaces that drive business success', 'building2', '#2D5A3D', 2),
('Education', 'education', 'Learning environments that inspire and facilitate education', 'graduation-cap', '#2D5A3D', 3),
('Container Architecture', 'container-architecture', 'Innovative solutions using sustainable container construction', 'container', '#2D5A3D', 4),
('Leisure', 'leisure', 'Recreation and hospitality spaces that enhance experiences', 'palm-tree', '#2D5A3D', 5),
('Mixed Use', 'mixed-use', 'Multi-purpose developments combining residential, commercial, and community spaces', 'layers', '#2D5A3D', 6);

-- Insert default admin user (password should be hashed in real application)
INSERT INTO users (email, password_hash, first_name, last_name, role, title, bio, years_experience) VALUES
('admin@hla.co.za', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBz4Oz6C8OZOX6', 'Admin', 'User', 'admin', 'System Administrator', 'System administrator for HLA Architects website', 5);

-- Insert Martin Lewison
INSERT INTO users (email, password_hash, first_name, last_name, role, title, bio, years_experience, specializations) VALUES
('martin@hla.co.za', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBz4Oz6C8OZOX6', 'Martin', 'Lewison', 'admin', 'Principal & Registered Professional Architect', 'Martin joined the company in 1991 and became partner in 2002. With approximately 25 years of practice, he has contributed his expertise and vision to the quality of design, creativity and high level of service that forms the backbone of HLArchitects.', 25, ARRAY['Sustainable Design', 'Residential Architecture', 'Commercial Design', 'Project Management']);

-- Insert default company settings
INSERT INTO company_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('company_name', 'HLArchitects', 'text', 'Company name', true),
('company_email', 'hla@hla.co.za', 'text', 'Main company email', true),
('company_phone', '+27 11 123 4567', 'text', 'Main company phone', true),
('company_address', 'Johannesburg, South Africa', 'text', 'Company address', true),
('company_description', 'Creating beautiful, vibrant and sustainable buildings for over 20 years.', 'text', 'Company description', true),
('website_title', 'HLArchitects - Beautiful, Vibrant & Sustainable Buildings', 'text', 'Website title', true),
('website_description', 'HLArchitects is a Johannesburg-based architectural and design firm creating functional, cost-effective and beautiful buildings with meaning and value.', 'text', 'Website meta description', true),
('google_analytics_id', '', 'text', 'Google Analytics tracking ID', false),
('facebook_url', '', 'url', 'Facebook page URL', true),
('linkedin_url', '', 'url', 'LinkedIn page URL', true),
('instagram_url', '', 'url', 'Instagram page URL', true);

-- ================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================

-- View for published projects with category info
CREATE VIEW published_projects AS
SELECT 
    p.*,
    pc.name as category_name,
    pc.slug as category_slug,
    pc.color_hex as category_color,
    u.first_name || ' ' || u.last_name as lead_architect_name,
    c.company_name as client_name,
    c.contact_person_name as client_contact
FROM projects p
LEFT JOIN project_categories pc ON p.category_id = pc.id
LEFT JOIN users u ON p.lead_architect_id = u.id
LEFT JOIN clients c ON p.client_id = c.id
WHERE p.is_published = true AND p.show_on_website = true;

-- View for project statistics
CREATE VIEW project_statistics AS
SELECT 
    pc.name as category,
    COUNT(p.id) as project_count,
    AVG(p.total_area_sqm) as avg_area_sqm,
    SUM(p.total_area_sqm) as total_area_sqm,
    MIN(p.actual_completion_date) as earliest_completion,
    MAX(p.actual_completion_date) as latest_completion
FROM project_categories pc
LEFT JOIN projects p ON pc.id = p.category_id AND p.is_published = true
GROUP BY pc.id, pc.name, pc.sort_order
ORDER BY pc.sort_order;

-- ================================================
-- SAMPLE DATA INSERTION QUERIES
-- ================================================

-- These would be used to populate the database with the existing project data
-- (You would run these after the schema is created)

/*
-- Example: Insert a sample project
INSERT INTO projects (
    title, slug, description, category_id, location, total_area_sqm, 
    status, is_published, show_on_website, is_featured, estimated_budget, 
    actual_completion_date, featured_image_url
) VALUES (
    'Sustainable Family Home',
    'sustainable-family-home',
    'A modern sustainable family home featuring natural materials, energy-efficient systems, and seamless indoor-outdoor living spaces.',
    (SELECT id FROM project_categories WHERE slug = 'residential'),
    'Johannesburg, South Africa',
    350.00,
    'completed',
    true,
    true,
    true,
    3000000.00,
    '2024-06-01',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
);
*/

COMMENT ON DATABASE hla_architects IS 'Database for HLA Architects website and project management system';