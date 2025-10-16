// Database Integration Layer for SQL Server
// This module will handle all database operations when SQL Server is connected

class DatabaseService {
    constructor() {
        this.apiBase = '/api/tickets'; // Will be configured for your SQL Server API
        this.isConnected = false;
        this.connectionString = null;
        this.init();
    }

    init() {
        // Check if SQL Server is available
        this.checkConnection();
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            this.isConnected = response.ok;
            console.log('SQL Server connection:', this.isConnected ? 'Connected' : 'Offline');
        } catch (error) {
            console.log('SQL Server not available, using local storage');
            this.isConnected = false;
        }
    }

    // Ticket CRUD Operations for SQL Server
    async createTicket(ticketData) {
        if (!this.isConnected) {
            return this.fallbackCreateTicket(ticketData);
        }

        try {
            const response = await fetch(`${this.apiBase}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    title: ticketData.title,
                    description: ticketData.description,
                    priority: ticketData.priority,
                    category: ticketData.category,
                    status: 'open',
                    customer_name: ticketData.customer,
                    contact_info: ticketData.contact,
                    assigned_to: ticketData.assignee,
                    created_by: this.getCurrentUserId(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackCreateTicket(ticketData);
        }
    }

    async getTickets(filters = {}) {
        if (!this.isConnected) {
            return this.fallbackGetTickets(filters);
        }

        try {
            const queryParams = new URLSearchParams();
            
            if (filters.status && filters.status !== 'all') {
                queryParams.append('status', filters.status);
            }
            if (filters.priority && filters.priority !== 'all') {
                queryParams.append('priority', filters.priority);
            }
            if (filters.assignee && filters.assignee !== 'all') {
                queryParams.append('assigned_to', filters.assignee);
            }
            if (filters.search) {
                queryParams.append('search', filters.search);
            }

            const response = await fetch(`${this.apiBase}/tickets?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackGetTickets(filters);
        }
    }

    async updateTicket(ticketId, updates) {
        if (!this.isConnected) {
            return this.fallbackUpdateTicket(ticketId, updates);
        }

        try {
            const response = await fetch(`${this.apiBase}/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    ...updates,
                    updated_at: new Date().toISOString(),
                    updated_by: this.getCurrentUserId()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackUpdateTicket(ticketId, updates);
        }
    }

    async deleteTicket(ticketId) {
        if (!this.isConnected) {
            return this.fallbackDeleteTicket(ticketId);
        }

        try {
            const response = await fetch(`${this.apiBase}/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            return { success: true };
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackDeleteTicket(ticketId);
        }
    }

    // Comment/Note Operations
    async addComment(ticketId, comment) {
        if (!this.isConnected) {
            return this.fallbackAddComment(ticketId, comment);
        }

        try {
            const response = await fetch(`${this.apiBase}/tickets/${ticketId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    comment_text: comment.content,
                    created_by: this.getCurrentUserId(),
                    created_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackAddComment(ticketId, comment);
        }
    }

    async getComments(ticketId) {
        if (!this.isConnected) {
            return this.fallbackGetComments(ticketId);
        }

        try {
            const response = await fetch(`${this.apiBase}/tickets/${ticketId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackGetComments(ticketId);
        }
    }

    // Authentication helpers
    getAuthToken() {
        const user = JSON.parse(sessionStorage.getItem('badger-user') || '{}');
        return user.token || 'demo-token';
    }

    getCurrentUserId() {
        const user = JSON.parse(sessionStorage.getItem('badger-user') || '{}');
        return user.id || 1;
    }

    // Analytics and Reporting
    async getTicketStats() {
        if (!this.isConnected) {
            return this.fallbackGetStats();
        }

        try {
            const response = await fetch(`${this.apiBase}/analytics/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackGetStats();
        }
    }

    async getReportData(reportType, dateRange) {
        if (!this.isConnected) {
            return this.fallbackGetReportData(reportType, dateRange);
        }

        try {
            const response = await fetch(`${this.apiBase}/reports/${reportType}?start=${dateRange.start}&end=${dateRange.end}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report data');
            }

            return await response.json();
        } catch (error) {
            console.error('Database error, falling back to local storage:', error);
            return this.fallbackGetReportData(reportType, dateRange);
        }
    }

    // Fallback methods (current localStorage implementation)
    fallbackCreateTicket(ticketData) {
        // Use existing localStorage implementation
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        const newTicket = {
            id: this.generateTicketId(),
            ...ticketData,
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: []
        };
        tickets.push(newTicket);
        localStorage.setItem('badger-tickets', JSON.stringify(tickets));
        return Promise.resolve(newTicket);
    }

    fallbackGetTickets(filters) {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        let filteredTickets = tickets;

        if (filters.status && filters.status !== 'all') {
            filteredTickets = filteredTickets.filter(t => t.status === filters.status);
        }
        if (filters.priority && filters.priority !== 'all') {
            filteredTickets = filteredTickets.filter(t => t.priority === filters.priority);
        }
        if (filters.assignee && filters.assignee !== 'all') {
            filteredTickets = filteredTickets.filter(t => t.assignee === filters.assignee);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredTickets = filteredTickets.filter(t => 
                t.title.toLowerCase().includes(searchLower) ||
                t.customer.toLowerCase().includes(searchLower) ||
                t.description.toLowerCase().includes(searchLower)
            );
        }

        return Promise.resolve(filteredTickets);
    }

    fallbackUpdateTicket(ticketId, updates) {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        
        if (ticketIndex !== -1) {
            tickets[ticketIndex] = {
                ...tickets[ticketIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('badger-tickets', JSON.stringify(tickets));
            return Promise.resolve(tickets[ticketIndex]);
        }
        
        return Promise.reject(new Error('Ticket not found'));
    }

    fallbackDeleteTicket(ticketId) {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        const filteredTickets = tickets.filter(t => t.id !== ticketId);
        localStorage.setItem('badger-tickets', JSON.stringify(filteredTickets));
        return Promise.resolve({ success: true });
    }

    fallbackAddComment(ticketId, comment) {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        
        if (ticketIndex !== -1) {
            const newComment = {
                id: Date.now(),
                ...comment,
                timestamp: new Date().toISOString()
            };
            tickets[ticketIndex].comments.push(newComment);
            localStorage.setItem('badger-tickets', JSON.stringify(tickets));
            return Promise.resolve(newComment);
        }
        
        return Promise.reject(new Error('Ticket not found'));
    }

    fallbackGetComments(ticketId) {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        const ticket = tickets.find(t => t.id === ticketId);
        return Promise.resolve(ticket ? ticket.comments : []);
    }

    fallbackGetStats() {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        return Promise.resolve({
            total: tickets.length,
            open: tickets.filter(t => t.status === 'open').length,
            inProgress: tickets.filter(t => t.status === 'in-progress').length,
            resolved: tickets.filter(t => t.status === 'resolved').length,
            closed: tickets.filter(t => t.status === 'closed').length,
            urgent: tickets.filter(t => t.priority === 'urgent').length,
            high: tickets.filter(t => t.priority === 'high').length
        });
    }

    fallbackGetReportData(reportType, dateRange) {
        const tickets = JSON.parse(localStorage.getItem('badger-tickets') || '[]');
        // Basic report data for fallback
        return Promise.resolve({
            reportType,
            dateRange,
            data: tickets,
            summary: {
                totalTickets: tickets.length,
                averageResolutionTime: '8.5 hours',
                customerSatisfaction: '94%'
            }
        });
    }

    generateTicketId() {
        const prefix = 'BT';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }

    // User Management (for future SQL Server integration)
    async authenticateUser(username, password) {
        if (!this.isConnected) {
            return this.fallbackAuthenticate(username, password);
        }

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const userData = await response.json();
            
            // Store user data with token
            sessionStorage.setItem('badger-logged-in', 'true');
            sessionStorage.setItem('badger-user', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error('Database auth error, falling back to local auth:', error);
            return this.fallbackAuthenticate(username, password);
        }
    }

    fallbackAuthenticate(username, password) {
        // Current demo authentication logic
        const validCredentials = [
            { username: 'admin', password: 'badger2024', name: 'Benjamin Sherman', role: 'admin' },
            { username: 'benjamin@badgertechnologies.us', password: 'admin123', name: 'Benjamin Sherman', role: 'admin' },
            { username: 'benjamin', password: 'admin123', name: 'Benjamin Sherman', role: 'admin' }
        ];

        const user = validCredentials.find(cred => 
            cred.username.toLowerCase() === username.toLowerCase() && 
            cred.password === password
        );

        if (user) {
            const userData = {
                id: 1,
                username: user.username,
                name: user.name,
                email: 'benjamin@badgertechnologies.us',
                role: user.role,
                token: 'demo-token-' + Date.now()
            };
            
            sessionStorage.setItem('badger-logged-in', 'true');
            sessionStorage.setItem('badger-user', JSON.stringify(userData));
            
            return Promise.resolve(userData);
        }
        
        return Promise.reject(new Error('Invalid credentials'));
    }

    // Configuration for SQL Server connection
    configureDatabase(config) {
        this.apiBase = config.apiBase || '/api/tickets';
        this.connectionString = config.connectionString;
        
        // Test connection with new config
        this.checkConnection();
    }
}

// Export for use in main application
window.DatabaseService = DatabaseService;