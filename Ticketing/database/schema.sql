-- Badger Technologies Ticketing System
-- SQL Server Database Schema
-- Version 1.0 - October 2024

-- Create database (run separately if needed)
-- CREATE DATABASE BadgerTicketing;
-- USE BadgerTicketing;

-- =============================================
-- Users Table
-- =============================================
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) UNIQUE NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL, -- Store hashed passwords only
    full_name NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin', 'technician', 'user'
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    last_login DATETIME2 NULL,
    
    INDEX IX_Users_Username (username),
    INDEX IX_Users_Email (email),
    INDEX IX_Users_Role (role)
);

-- =============================================
-- Customers/Organizations Table
-- =============================================
CREATE TABLE Customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    organization_name NVARCHAR(255) NOT NULL,
    primary_contact NVARCHAR(255) NULL,
    email NVARCHAR(255) NULL,
    phone NVARCHAR(50) NULL,
    address NVARCHAR(500) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    INDEX IX_Customers_Name (organization_name),
    INDEX IX_Customers_Email (email)
);

-- =============================================
-- Ticket Categories Table
-- =============================================
CREATE TABLE TicketCategories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    INDEX IX_Categories_Name (category_name)
);

-- =============================================
-- Main Tickets Table
-- =============================================
CREATE TABLE Tickets (
    ticket_id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_number NVARCHAR(50) NOT NULL UNIQUE, -- Format: BT-XXXXXX-XXX
    title NVARCHAR(255) NOT NULL,
    description NTEXT NOT NULL,
    
    -- Status and Priority
    status NVARCHAR(50) NOT NULL DEFAULT 'open',
        CONSTRAINT CK_Tickets_Status CHECK (status IN ('open', 'in-progress', 'resolved', 'closed', 'on-hold')),
    priority NVARCHAR(50) NOT NULL DEFAULT 'medium',
        CONSTRAINT CK_Tickets_Priority CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    
    -- Foreign Keys
    customer_id INT NOT NULL,
    category_id INT NOT NULL,
    created_by INT NOT NULL,
    assigned_to INT NULL,
    resolved_by INT NULL,
    
    -- Contact Information
    contact_name NVARCHAR(255) NULL,
    contact_email NVARCHAR(255) NULL,
    contact_phone NVARCHAR(50) NULL,
    
    -- Timestamps
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    due_date DATETIME2 NULL,
    resolved_at DATETIME2 NULL,
    closed_at DATETIME2 NULL,
    
    -- Resolution tracking
    resolution_time_minutes INT NULL, -- Calculated field
    resolution_notes NTEXT NULL,
    
    CONSTRAINT FK_Tickets_Customer FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    CONSTRAINT FK_Tickets_Category FOREIGN KEY (category_id) REFERENCES TicketCategories(category_id),
    CONSTRAINT FK_Tickets_CreatedBy FOREIGN KEY (created_by) REFERENCES Users(user_id),
    CONSTRAINT FK_Tickets_AssignedTo FOREIGN KEY (assigned_to) REFERENCES Users(user_id),
    CONSTRAINT FK_Tickets_ResolvedBy FOREIGN KEY (resolved_by) REFERENCES Users(user_id),
    
    INDEX IX_Tickets_Number (ticket_number),
    INDEX IX_Tickets_Status (status),
    INDEX IX_Tickets_Priority (priority),
    INDEX IX_Tickets_Customer (customer_id),
    INDEX IX_Tickets_Category (category_id),
    INDEX IX_Tickets_AssignedTo (assigned_to),
    INDEX IX_Tickets_CreatedAt (created_at),
    INDEX IX_Tickets_UpdatedAt (updated_at)
);

-- =============================================
-- Ticket Comments/Notes Table
-- =============================================
CREATE TABLE TicketComments (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text NTEXT NOT NULL,
    is_internal BIT NOT NULL DEFAULT 0, -- Internal notes vs customer-visible comments
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Comments_Ticket FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_User FOREIGN KEY (user_id) REFERENCES Users(user_id),
    
    INDEX IX_Comments_Ticket (ticket_id),
    INDEX IX_Comments_CreatedAt (created_at)
);

-- =============================================
-- Ticket Attachments Table (for future use)
-- =============================================
CREATE TABLE TicketAttachments (
    attachment_id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    uploaded_by INT NOT NULL,
    original_filename NVARCHAR(255) NOT NULL,
    stored_filename NVARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type NVARCHAR(100) NOT NULL,
    file_path NVARCHAR(500) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Attachments_Ticket FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    CONSTRAINT FK_Attachments_User FOREIGN KEY (uploaded_by) REFERENCES Users(user_id),
    
    INDEX IX_Attachments_Ticket (ticket_id)
);

-- =============================================
-- Ticket Status History Table
-- =============================================
CREATE TABLE TicketStatusHistory (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    changed_by INT NOT NULL,
    old_status NVARCHAR(50) NULL,
    new_status NVARCHAR(50) NOT NULL,
    old_priority NVARCHAR(50) NULL,
    new_priority NVARCHAR(50) NULL,
    old_assigned_to INT NULL,
    new_assigned_to INT NULL,
    change_reason NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_History_Ticket FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    CONSTRAINT FK_History_User FOREIGN KEY (changed_by) REFERENCES Users(user_id),
    
    INDEX IX_History_Ticket (ticket_id),
    INDEX IX_History_CreatedAt (created_at)
);

-- =============================================
-- Insert Initial Data
-- =============================================

-- Insert default categories
INSERT INTO TicketCategories (category_name, description) VALUES
('Hardware', 'Computer hardware, printers, networking equipment issues'),
('Software', 'Software installation, licensing, application issues'),
('Network', 'Network connectivity, internet, WiFi issues'),
('Email & Communication', 'Email, phone systems, communication tools'),
('Security', 'Security incidents, access control, antivirus issues'),
('General Support', 'General IT support requests and questions');

-- Insert default admin user (password should be hashed in production)
INSERT INTO Users (username, email, password_hash, full_name, role) VALUES
('admin', 'benjamin@badgertechnologies.us', 'HASHED_PASSWORD_HERE', 'Benjamin Sherman', 'admin'),
('benjamin', 'benjamin@badgertechnologies.us', 'HASHED_PASSWORD_HERE', 'Benjamin Sherman', 'admin');

-- Insert sample customers
INSERT INTO Customers (organization_name, primary_contact, email, phone) VALUES
('Ecker Center for Behavioral Health', 'John Smith', 'john@eckercenter.org', '555-0101'),
('Sample Medical Practice', 'Sarah Johnson', 'sarah@medicalpractice.com', '555-0102'),
('Local Law Firm', 'Mike Davis', 'mike@lawfirm.com', '555-0103');

-- =============================================
-- Useful Views for Reporting
-- =============================================

-- Active tickets with customer and assignee information
CREATE VIEW vw_ActiveTickets AS
SELECT 
    t.ticket_id,
    t.ticket_number,
    t.title,
    t.status,
    t.priority,
    c.organization_name as customer_name,
    cat.category_name,
    u_assigned.full_name as assigned_to_name,
    u_created.full_name as created_by_name,
    t.created_at,
    t.updated_at,
    t.due_date,
    DATEDIFF(HOUR, t.created_at, GETDATE()) as age_hours
FROM Tickets t
    INNER JOIN Customers c ON t.customer_id = c.customer_id
    INNER JOIN TicketCategories cat ON t.category_id = cat.category_id
    INNER JOIN Users u_created ON t.created_by = u_created.user_id
    LEFT JOIN Users u_assigned ON t.assigned_to = u_assigned.user_id
WHERE t.status NOT IN ('closed');

-- Ticket statistics view
CREATE VIEW vw_TicketStats AS
SELECT 
    COUNT(*) as total_tickets,
    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_tickets,
    SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tickets,
    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_tickets,
    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_tickets,
    SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_tickets,
    SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_tickets,
    AVG(CASE WHEN resolution_time_minutes IS NOT NULL THEN resolution_time_minutes ELSE NULL END) as avg_resolution_minutes
FROM Tickets;

-- =============================================
-- Stored Procedures for Common Operations
-- =============================================

-- Procedure to create a new ticket with automatic ticket number generation
CREATE PROCEDURE sp_CreateTicket
    @title NVARCHAR(255),
    @description NTEXT,
    @customer_id INT,
    @category_id INT,
    @priority NVARCHAR(50) = 'medium',
    @created_by INT,
    @assigned_to INT = NULL,
    @contact_name NVARCHAR(255) = NULL,
    @contact_email NVARCHAR(255) = NULL,
    @contact_phone NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ticket_number NVARCHAR(50);
    DECLARE @ticket_id INT;
    
    -- Generate unique ticket number
    SET @ticket_number = 'BT-' + FORMAT(GETDATE(), 'yyMMdd') + '-' + FORMAT(ABS(CHECKSUM(NEWID())) % 1000, '000');
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM Tickets WHERE ticket_number = @ticket_number)
    BEGIN
        SET @ticket_number = 'BT-' + FORMAT(GETDATE(), 'yyMMdd') + '-' + FORMAT(ABS(CHECKSUM(NEWID())) % 1000, '000');
    END
    
    INSERT INTO Tickets (
        ticket_number, title, description, customer_id, category_id, 
        priority, created_by, assigned_to, contact_name, contact_email, contact_phone
    )
    VALUES (
        @ticket_number, @title, @description, @customer_id, @category_id,
        @priority, @created_by, @assigned_to, @contact_name, @contact_email, @contact_phone
    );
    
    SET @ticket_id = SCOPE_IDENTITY();
    
    -- Log initial status
    INSERT INTO TicketStatusHistory (ticket_id, changed_by, new_status, new_priority, new_assigned_to)
    VALUES (@ticket_id, @created_by, 'open', @priority, @assigned_to);
    
    SELECT @ticket_id as ticket_id, @ticket_number as ticket_number;
END;

-- Procedure to update ticket status
CREATE PROCEDURE sp_UpdateTicketStatus
    @ticket_id INT,
    @new_status NVARCHAR(50),
    @changed_by INT,
    @resolution_notes NTEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @old_status NVARCHAR(50);
    
    SELECT @old_status = status FROM Tickets WHERE ticket_id = @ticket_id;
    
    UPDATE Tickets 
    SET 
        status = @new_status,
        updated_at = GETDATE(),
        resolved_at = CASE WHEN @new_status = 'resolved' THEN GETDATE() ELSE resolved_at END,
        closed_at = CASE WHEN @new_status = 'closed' THEN GETDATE() ELSE closed_at END,
        resolved_by = CASE WHEN @new_status = 'resolved' THEN @changed_by ELSE resolved_by END,
        resolution_notes = ISNULL(@resolution_notes, resolution_notes),
        resolution_time_minutes = CASE 
            WHEN @new_status = 'resolved' AND resolved_at IS NULL 
            THEN DATEDIFF(MINUTE, created_at, GETDATE())
            ELSE resolution_time_minutes 
        END
    WHERE ticket_id = @ticket_id;
    
    -- Log status change
    INSERT INTO TicketStatusHistory (ticket_id, changed_by, old_status, new_status)
    VALUES (@ticket_id, @changed_by, @old_status, @new_status);
END;

-- =============================================
-- Triggers for Auto-Updates
-- =============================================

-- Trigger to update the updated_at timestamp
CREATE TRIGGER tr_Tickets_UpdateTimestamp
ON Tickets
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Tickets 
    SET updated_at = GETDATE()
    FROM Tickets t
    INNER JOIN inserted i ON t.ticket_id = i.ticket_id;
END;

-- =============================================
-- Indexes for Performance
-- =============================================

-- Additional performance indexes
CREATE INDEX IX_Tickets_StatusPriority ON Tickets (status, priority);
CREATE INDEX IX_Tickets_CustomerStatus ON Tickets (customer_id, status);
CREATE INDEX IX_TicketComments_TicketCreated ON TicketComments (ticket_id, created_at);

-- =============================================
-- Sample Queries for Testing
-- =============================================

/*
-- Get all active tickets with details
SELECT * FROM vw_ActiveTickets ORDER BY priority DESC, created_at ASC;

-- Get ticket statistics
SELECT * FROM vw_TicketStats;

-- Get tickets for a specific customer
SELECT * FROM vw_ActiveTickets WHERE customer_name LIKE '%Ecker%';

-- Get overdue tickets (example: due date passed)
SELECT * FROM vw_ActiveTickets WHERE due_date < GETDATE() AND status NOT IN ('resolved', 'closed');

-- Get technician workload
SELECT 
    assigned_to_name,
    COUNT(*) as active_tickets,
    SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_tickets
FROM vw_ActiveTickets 
WHERE assigned_to_name IS NOT NULL
GROUP BY assigned_to_name;
*/