-- 1. Departments Table (For Asset Ownership)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE -- e.g., 'Production', 'IT' [cite: 5]
);

-- 2. Maintenance Teams Table
CREATE TABLE maintenance_teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL UNIQUE -- e.g., 'Mechanics', 'Electricians' [cite: 8]
);

-- 3. Technicians (Linked to Teams)
CREATE TABLE technicians (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    team_id INT REFERENCES maintenance_teams(id) ON DELETE SET NULL [cite: 9]
);

-- 4. Equipment Table (The Assets)
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, [cite: 7]
    serial_number VARCHAR(100) UNIQUE NOT NULL, [cite: 7]
    purchase_date DATE, [cite: 7]
    warranty_info TEXT, [cite: 7]
    location VARCHAR(255), [cite: 7]
    is_usable BOOLEAN DEFAULT TRUE, -- Logic for "Scrap" status 
    
    -- Relations
    department_id INT REFERENCES departments(id), [cite: 5]
    assigned_employee_name VARCHAR(255), [cite: 6]
    default_team_id INT REFERENCES maintenance_teams(id), [cite: 6]
    default_technician_id INT REFERENCES technicians(id) [cite: 6]
);

-- 5. Maintenance Requests (The Transactional Table)
CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL, [cite: 12]
    request_type VARCHAR(20) CHECK (request_type IN ('Corrective', 'Preventive')), [cite: 12]
    
    -- Workflow Stages
    stage VARCHAR(20) DEFAULT 'New' CHECK (stage IN ('New', 'To Approve', 'In Progress', 'Repaired', 'Scrap')), [cite: 17, 18, 19, 24]
    
    -- Scheduling & Tracking
    scheduled_date TIMESTAMP, [cite: 13, 21]
    duration_hours DECIMAL(5, 2) DEFAULT 0.00, [cite: 14, 19]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE, [cite: 13]
    maintenance_team_id INT REFERENCES maintenance_teams(id), [cite: 16]
    assigned_technician_id INT REFERENCES technicians(id) [cite: 18]
);

-- Indexes for performance (Search/Group By tracking)
CREATE INDEX idx_equipment_dept ON equipment(department_id); [cite: 5]
CREATE INDEX idx_request_stage ON maintenance_requests(stage); [cite: 24]
CREATE INDEX idx_request_date ON maintenance_requests(scheduled_date); [cite: 22]