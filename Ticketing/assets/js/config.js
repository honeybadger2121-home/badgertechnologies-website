// Badger Technologies Ticketing System
// SQL Server Configuration File

// Database Configuration
const DATABASE_CONFIG = {
    // Set to true when SQL Server is ready
    enabled: false,
    
    // API endpoint for your SQL Server backend
    apiUrl: 'https://your-domain.com/api/tickets',
    
    // Connection test endpoint
    healthCheckUrl: 'https://your-domain.com/api/tickets/health',
    
    // Authentication settings
    auth: {
        tokenKey: 'badger-auth-token',
        refreshUrl: '/api/auth/refresh',
        loginUrl: '/api/auth/login'
    },
    
    // API timeout settings
    timeout: 30000, // 30 seconds
    
    // Retry settings for failed requests
    retry: {
        attempts: 3,
        delay: 1000 // 1 second
    }
};

// Sample SQL Server Connection Strings
const CONNECTION_STRINGS = {
    // Development environment
    development: "Server=localhost;Database=BadgerTicketing;Integrated Security=true;",
    
    // Production environment (use environment variables)
    production: "Server=${DB_SERVER};Database=${DB_NAME};User Id=${DB_USER};Password=${DB_PASSWORD};",
    
    // Azure SQL Database
    azure: "Server=tcp:${AZURE_SERVER}.database.windows.net,1433;Initial Catalog=${DB_NAME};Persist Security Info=False;User ID=${DB_USER};Password=${DB_PASSWORD};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
};

// Table Mapping for API responses
const TABLE_MAPPING = {
    tickets: {
        id: 'ticket_id',
        number: 'ticket_number',
        title: 'title',
        description: 'description',
        status: 'status',
        priority: 'priority',
        customer: 'customer_id',
        category: 'category_id',
        assignee: 'assigned_to',
        createdBy: 'created_by',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    users: {
        id: 'user_id',
        username: 'username',
        email: 'email',
        name: 'full_name',
        role: 'role'
    },
    customers: {
        id: 'customer_id',
        name: 'organization_name',
        contact: 'primary_contact',
        email: 'email',
        phone: 'phone'
    }
};

// API Endpoints Configuration
const API_ENDPOINTS = {
    // Authentication
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    verify: '/api/auth/verify',
    
    // Tickets
    tickets: '/api/tickets',
    ticketById: '/api/tickets/{id}',
    createTicket: '/api/tickets',
    updateTicket: '/api/tickets/{id}',
    deleteTicket: '/api/tickets/{id}',
    
    // Comments
    comments: '/api/tickets/{id}/comments',
    addComment: '/api/tickets/{id}/comments',
    
    // Analytics
    stats: '/api/analytics/stats',
    reports: '/api/reports/{type}',
    
    // Health
    health: '/api/tickets/health'
};

// Enable SQL Server Integration
function enableSQLServer(apiUrl) {
    DATABASE_CONFIG.enabled = true;
    DATABASE_CONFIG.apiUrl = apiUrl;
    DATABASE_CONFIG.healthCheckUrl = `${apiUrl}/health`;
    
    // Reinitialize database service if it exists
    if (window.ticketSystem && window.ticketSystem.database) {
        window.ticketSystem.database.configureDatabase(DATABASE_CONFIG);
    }
    
    console.log('SQL Server integration enabled:', apiUrl);
}

// Disable SQL Server Integration (use localStorage)
function disableSQLServer() {
    DATABASE_CONFIG.enabled = false;
    console.log('SQL Server integration disabled, using localStorage');
}

// Test SQL Server Connection
async function testSQLConnection() {
    if (!DATABASE_CONFIG.enabled) {
        console.log('SQL Server not enabled');
        return false;
    }
    
    try {
        const response = await fetch(DATABASE_CONFIG.healthCheckUrl, {
            method: 'GET',
            timeout: DATABASE_CONFIG.timeout
        });
        
        const isConnected = response.ok;
        console.log('SQL Server connection test:', isConnected ? 'SUCCESS' : 'FAILED');
        return isConnected;
    } catch (error) {
        console.error('SQL Server connection test failed:', error);
        return false;
    }
}

// Export configuration
window.DATABASE_CONFIG = DATABASE_CONFIG;
window.CONNECTION_STRINGS = CONNECTION_STRINGS;
window.TABLE_MAPPING = TABLE_MAPPING;
window.API_ENDPOINTS = API_ENDPOINTS;
window.enableSQLServer = enableSQLServer;
window.disableSQLServer = disableSQLServer;
window.testSQLConnection = testSQLConnection;

// Auto-test connection on page load
document.addEventListener('DOMContentLoaded', function() {
    if (DATABASE_CONFIG.enabled) {
        testSQLConnection();
    }
});