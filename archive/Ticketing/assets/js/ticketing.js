// Badger Technologies Ticketing System JavaScript

// Global state management
class TicketingSystem {
    constructor() {
        this.currentUser = null;
        this.tickets = [];
        this.filters = {
            status: 'all',
            priority: 'all',
            assignee: 'all',
            search: ''
        };
        this.database = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.initializeDatabase();
        this.bindEvents();
        this.loadInitialData();
        this.setupNotifications();
    }

    initializeDatabase() {
        // Initialize database service
        if (window.DatabaseService) {
            this.database = new DatabaseService();
            console.log('Database service initialized');
        } else {
            console.warn('Database service not available, using localStorage fallback');
        }
    }

    checkAuthentication() {
        const isLoggedIn = sessionStorage.getItem('badger-logged-in');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
        
        const userData = sessionStorage.getItem('badger-user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserDisplay();
        }
    }

    updateUserDisplay() {
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name || this.currentUser.username;
        }
    }

    logout() {
        sessionStorage.removeItem('badger-logged-in');
        sessionStorage.removeItem('badger-user');
        window.location.href = 'login.html';
    }

    // Event listeners
    bindEvents() {
        // Navigation
        this.setupNavigation();
        this.setupForms();
        this.setupFilters();
        this.setupModals();

        // Responsive menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', this.toggleMobileMenu);
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                
                // Handle page navigation
                const href = e.target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateToSection(href.substring(1));
                }
            });
        });
    }

    navigateToSection(sectionId) {
        // Hide all sections (both page-section and content-section)
        const pageSections = document.querySelectorAll('.page-section');
        const contentSections = document.querySelectorAll('.content-section');
        
        pageSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        contentSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active', 'fade-in');
            
            // Special handling for CRM and leads sections
            if (sectionId === 'crm' && window.crmManager) {
                window.crmManager.loadCustomers();
            } else if (sectionId === 'leads' && window.crmManager) {
                window.crmManager.loadLeads();
            }
        }

        // Update page title
        this.updatePageTitle(sectionId);
    }

    updatePageTitle(sectionId) {
        const titles = {
            'dashboard': 'Dashboard',
            'tickets': 'All Tickets',
            'new-ticket': 'Create New Ticket',
            'my-tickets': 'My Tickets',
            'crm': 'Customer Relationship Management',
            'leads': 'Sales Pipeline',
            'reports': 'Reports & Analytics',
            'settings': 'System Settings'
        };
        
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle && titles[sectionId]) {
            pageTitle.textContent = titles[sectionId];
        }
    }

    // Form handling
    setupForms() {
        const forms = document.querySelectorAll('form');
        console.log('Setting up forms, found:', forms.length);
        
        forms.forEach(form => {
            const formType = form.getAttribute('data-form-type');
            console.log('Setting up form with type:', formType);
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted:', formType);
                this.handleFormSubmit(form);
            });
        });

        // Auto-save drafts
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', this.debounce((e) => {
                this.saveDraft(e.target);
            }, 1000));
        });
    }

    handleFormSubmit(form) {
        const formType = form.getAttribute('data-form-type');
        const formData = new FormData(form);
        
        switch (formType) {
            case 'new-ticket':
                this.createTicket(formData);
                break;
            case 'ticket-update':
                this.updateTicket(formData);
                break;
            case 'user-settings':
                this.updateUserSettings(formData);
                break;
            default:
                console.log('Unknown form type:', formType);
        }
    }

    // Ticket management
    async createTicket(formData) {
        console.log('Creating ticket with data:', formData);
        
        const ticketData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            category: formData.get('category'),
            assignee: formData.get('assignee') || 'unassigned',
            customer: formData.get('customer'),
            contact: formData.get('contact')
        };
        
        console.log('Ticket data processed:', ticketData);

        try {
            let newTicket;
            if (this.database) {
                console.log('Using database service to create ticket');
                // Use database service
                newTicket = await this.database.createTicket(ticketData);
            } else {
                console.log('Using localStorage fallback to create ticket');
                // Fallback to localStorage
                newTicket = {
                    id: this.generateTicketId(),
                    ...ticketData,
                    status: 'open',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    comments: []
                };
                this.tickets.push(newTicket);
                this.saveTickets();
            }

            console.log('Ticket created successfully:', newTicket);
            this.showNotification('Ticket created successfully', 'success');
            await this.refreshTicketList();
            this.navigateToSection('tickets');
            
            // Clear form
            const form = document.querySelector('[data-form-type="new-ticket"]');
            if (form) form.reset();
        } catch (error) {
            console.error('Error creating ticket:', error);
            this.showNotification('Error creating ticket. Please try again.', 'error');
        }
    }

    updateTicket(formData) {
        const ticketId = formData.get('ticket-id');
        const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
        
        if (ticketIndex !== -1) {
            const ticket = this.tickets[ticketIndex];
            
            // Update ticket properties
            ticket.status = formData.get('status') || ticket.status;
            ticket.priority = formData.get('priority') || ticket.priority;
            ticket.assignee = formData.get('assignee') || ticket.assignee;
            ticket.updatedAt = new Date().toISOString();
            
            // Add comment if provided
            const comment = formData.get('comment');
            if (comment && comment.trim()) {
                ticket.comments.push({
                    id: Date.now(),
                    author: this.currentUser?.name || 'System',
                    content: comment,
                    timestamp: new Date().toISOString()
                });
            }
            
            this.saveTickets();
            this.showNotification('Ticket updated successfully', 'success');
            this.refreshTicketList();
        }
    }

    generateTicketId() {
        const prefix = 'BT';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }

    // Data management
    async loadInitialData() {
        try {
            // Load user data
            const savedUser = sessionStorage.getItem('badger-user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            } else {
                this.currentUser = {
                    id: 1,
                    name: 'Benjamin Sherman',
                    email: 'benjamin@badgertechnologies.us',
                    role: 'admin'
                };
            }

            // Load tickets
            if (this.database) {
                // Try to load from database
                this.tickets = await this.database.getTickets(this.filters);
            } else {
                // Fallback to localStorage
                const savedTickets = localStorage.getItem('badger-tickets');
                if (savedTickets) {
                    this.tickets = JSON.parse(savedTickets);
                } else {
                    this.tickets = this.generateSampleData();
                }
            }
            
            this.refreshDashboard();
            this.refreshTicketList();
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Fallback to sample data
            this.tickets = this.generateSampleData();
            this.refreshDashboard();
            this.refreshTicketList();
        }
    }

    saveTickets() {
        localStorage.setItem('badger-tickets', JSON.stringify(this.tickets));
    }

    generateSampleData() {
        const sampleTickets = [
            {
                id: 'BT-001234-001',
                title: 'Email server configuration issue',
                description: 'Unable to send emails through Exchange server. Getting authentication errors.',
                priority: 'high',
                category: 'Email & Communication',
                assignee: 'Benjamin Sherman',
                status: 'in-progress',
                customer: 'Ecker Center',
                contact: 'John Smith - john@eckercenter.org',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 3600000).toISOString(),
                comments: [
                    {
                        id: 1,
                        author: 'Benjamin Sherman',
                        content: 'Investigating Exchange server logs. Found authentication issues with TLS settings.',
                        timestamp: new Date(Date.now() - 3600000).toISOString()
                    }
                ]
            },
            {
                id: 'BT-001234-002',
                title: 'Network printer offline',
                description: 'Reception area printer showing offline status. Unable to print documents.',
                priority: 'medium',
                category: 'Hardware',
                assignee: 'unassigned',
                status: 'open',
                customer: 'Medical Practice',
                contact: 'Sarah Johnson - sarah@medicalpractice.com',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString(),
                comments: []
            },
            {
                id: 'BT-001234-003',
                title: 'Software license renewal',
                description: 'Microsoft Office licenses expiring next month. Need to renew for 25 users.',
                priority: 'low',
                category: 'Software',
                assignee: 'Benjamin Sherman',
                status: 'resolved',
                customer: 'Law Firm',
                contact: 'Mike Davis - mike@lawfirm.com',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                comments: [
                    {
                        id: 2,
                        author: 'Benjamin Sherman',
                        content: 'Contacted Microsoft licensing team. Renewal quote prepared and sent to client.',
                        timestamp: new Date(Date.now() - 86400000).toISOString()
                    }
                ]
            }
        ];
        
        return sampleTickets;
    }

    // UI updates
    refreshDashboard() {
        this.updateStatsCards();
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityContainer = document.querySelector('.recent-activity');
        if (!activityContainer) return;

        // Get recent tickets for activity
        const recentTickets = this.tickets
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

        let activityHTML = '<h3>Recent Activity</h3>';
        
        if (recentTickets.length === 0) {
            activityHTML += '<p class="no-activity">No recent activity</p>';
        } else {
            activityHTML += '<div class="activity-list">';
            recentTickets.forEach(ticket => {
                const timeAgo = this.getTimeAgo(new Date(ticket.updatedAt));
                activityHTML += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-ticket-alt"></i>
                        </div>
                        <div class="activity-content">
                            <p><strong>${ticket.title}</strong></p>
                            <p class="activity-meta">
                                ${ticket.customer} • ${ticket.status} • ${timeAgo}
                            </p>
                        </div>
                    </div>
                `;
            });
            activityHTML += '</div>';
        }
        
        activityContainer.innerHTML = activityHTML;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    updateStatsCards() {
        const stats = this.calculateStats();
        
        const statElements = {
            total: document.querySelector('.stat-total .stat-value'),
            open: document.querySelector('.stat-open .stat-value'),
            inProgress: document.querySelector('.stat-in-progress .stat-value'),
            resolved: document.querySelector('.stat-resolved .stat-value')
        };
        
        if (statElements.total) statElements.total.textContent = stats.total;
        if (statElements.open) statElements.open.textContent = stats.open;
        if (statElements.inProgress) statElements.inProgress.textContent = stats.inProgress;
        if (statElements.resolved) statElements.resolved.textContent = stats.resolved;
    }

    calculateStats() {
        return {
            total: this.tickets.length,
            open: this.tickets.filter(t => t.status === 'open').length,
            inProgress: this.tickets.filter(t => t.status === 'in-progress').length,
            resolved: this.tickets.filter(t => t.status === 'resolved').length,
            urgent: this.tickets.filter(t => t.priority === 'urgent').length,
            high: this.tickets.filter(t => t.priority === 'high').length
        };
    }

    refreshTicketList() {
        const ticketTableBody = document.querySelector('.ticket-table tbody');
        if (!ticketTableBody) return;
        
        const filteredTickets = this.getFilteredTickets();
        ticketTableBody.innerHTML = '';
        
        filteredTickets.forEach(ticket => {
            const row = this.createTicketRow(ticket);
            ticketTableBody.appendChild(row);
        });
    }

    getFilteredTickets() {
        return this.tickets.filter(ticket => {
            const matchesStatus = this.filters.status === 'all' || ticket.status === this.filters.status;
            const matchesPriority = this.filters.priority === 'all' || ticket.priority === this.filters.priority;
            const matchesAssignee = this.filters.assignee === 'all' || ticket.assignee === this.filters.assignee;
            const matchesSearch = !this.filters.search || 
                ticket.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                ticket.customer.toLowerCase().includes(this.filters.search.toLowerCase());
            
            return matchesStatus && matchesPriority && matchesAssignee && matchesSearch;
        });
    }

    createTicketRow(ticket) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="ticketSystem.viewTicket('${ticket.id}')" class="ticket-link">${ticket.id}</a></td>
            <td>${ticket.title}</td>
            <td>${ticket.customer}</td>
            <td><span class="priority-badge priority-${ticket.priority}">${ticket.priority}</span></td>
            <td><span class="status-badge status-${ticket.status.replace('-', '')}">${ticket.status.replace('-', ' ')}</span></td>
            <td>${ticket.assignee}</td>
            <td>${this.formatDate(ticket.updatedAt)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="ticketSystem.viewTicket('${ticket.id}')" class="btn btn-sm btn-primary">View</button>
                    <button onclick="ticketSystem.editTicket('${ticket.id}')" class="btn btn-sm btn-secondary">Edit</button>
                </div>
            </td>
        `;
        return row;
    }

    // Filter and search
    setupFilters() {
        const filterElements = document.querySelectorAll('.filter-select, .search-input');
        filterElements.forEach(element => {
            element.addEventListener('change', (e) => {
                this.updateFilter(e.target.name, e.target.value);
            });
            
            if (element.type === 'text') {
                element.addEventListener('input', this.debounce((e) => {
                    this.updateFilter('search', e.target.value);
                }, 300));
            }
        });
    }

    updateFilter(filterType, value) {
        this.filters[filterType] = value;
        this.refreshTicketList();
    }

    // Ticket actions
    viewTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            this.showTicketModal(ticket);
        }
    }

    editTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            this.showEditTicketModal(ticket);
        }
    }

    deleteTicket(ticketId) {
        if (confirm('Are you sure you want to delete this ticket?')) {
            this.tickets = this.tickets.filter(t => t.id !== ticketId);
            this.saveTickets();
            this.refreshTicketList();
            this.refreshDashboard();
            this.showNotification('Ticket deleted successfully', 'success');
        }
    }

    // Modal management
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close, .close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal));
            }
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    showTicketModal(ticket) {
        // Create or update ticket modal content
        const modalContent = this.generateTicketModalContent(ticket);
        this.showModal('ticket-modal', modalContent);
    }

    generateTicketModalContent(ticket) {
        return `
            <div class="modal-header">
                <h3>Ticket Details - ${ticket.id}</h3>
                <span class="close" onclick="ticketSystem.closeModal('ticket-modal')">&times;</span>
            </div>
            <div class="modal-body">
                <div class="ticket-details">
                    <div class="detail-row">
                        <label>Title:</label>
                        <span>${ticket.title}</span>
                    </div>
                    <div class="detail-row">
                        <label>Customer:</label>
                        <span>${ticket.customer}</span>
                    </div>
                    <div class="detail-row">
                        <label>Priority:</label>
                        <span class="priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                        <label>Status:</label>
                        <span class="status-${ticket.status}">${ticket.status.toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                        <label>Category:</label>
                        <span>${ticket.category}</span>
                    </div>
                    <div class="detail-row">
                        <label>Assignee:</label>
                        <span>${ticket.assignee}</span>
                    </div>
                    <div class="detail-row">
                        <label>Created:</label>
                        <span>${new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <label>Updated:</label>
                        <span>${new Date(ticket.updatedAt).toLocaleString()}</span>
                    </div>
                    <div class="detail-row full-width">
                        <label>Description:</label>
                        <p>${ticket.description}</p>
                    </div>
                    ${ticket.contact ? `
                    <div class="detail-row">
                        <label>Contact:</label>
                        <span>${ticket.contact}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${ticket.comments && ticket.comments.length > 0 ? `
                <div class="ticket-comments">
                    <h4>Comments</h4>
                    ${ticket.comments.map(comment => `
                        <div class="comment">
                            <div class="comment-header">
                                <strong>${comment.author}</strong>
                                <span class="comment-date">${new Date(comment.timestamp).toLocaleString()}</span>
                            </div>
                            <p>${comment.content}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="ticketSystem.editTicket('${ticket.id}')">Edit Ticket</button>
                <button class="btn btn-secondary" onclick="ticketSystem.closeModal('ticket-modal')">Close</button>
            </div>
        `;
    }

    showEditTicketModal(ticket) {
        const modalContent = this.generateEditTicketModalContent(ticket);
        this.showModal('edit-ticket-modal', modalContent);
    }

    generateEditTicketModalContent(ticket) {
        return `
            <div class="modal-header">
                <h3>Edit Ticket - ${ticket.id}</h3>
                <span class="close" onclick="ticketSystem.closeModal('edit-ticket-modal')">&times;</span>
            </div>
            <div class="modal-body">
                <form id="edit-ticket-form" data-form-type="ticket-update">
                    <input type="hidden" name="ticket-id" value="${ticket.id}">
                    
                    <div class="form-group">
                        <label for="edit-title">Title:</label>
                        <input type="text" id="edit-title" name="title" value="${ticket.title}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-customer">Customer:</label>
                        <input type="text" id="edit-customer" name="customer" value="${ticket.customer}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-priority">Priority:</label>
                        <select id="edit-priority" name="priority">
                            <option value="low" ${ticket.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${ticket.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${ticket.priority === 'high' ? 'selected' : ''}>High</option>
                            <option value="urgent" ${ticket.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-status">Status:</label>
                        <select id="edit-status" name="status">
                            <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Open</option>
                            <option value="in-progress" ${ticket.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-category">Category:</label>
                        <select id="edit-category" name="category">
                            <option value="Hardware" ${ticket.category === 'Hardware' ? 'selected' : ''}>Hardware</option>
                            <option value="Software" ${ticket.category === 'Software' ? 'selected' : ''}>Software</option>
                            <option value="Network" ${ticket.category === 'Network' ? 'selected' : ''}>Network</option>
                            <option value="Email & Communication" ${ticket.category === 'Email & Communication' ? 'selected' : ''}>Email & Communication</option>
                            <option value="Security" ${ticket.category === 'Security' ? 'selected' : ''}>Security</option>
                            <option value="General Support" ${ticket.category === 'General Support' ? 'selected' : ''}>General Support</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-assignee">Assignee:</label>
                        <select id="edit-assignee" name="assignee">
                            <option value="unassigned" ${ticket.assignee === 'unassigned' ? 'selected' : ''}>Unassigned</option>
                            <option value="Benjamin Sherman" ${ticket.assignee === 'Benjamin Sherman' ? 'selected' : ''}>Benjamin Sherman</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-contact">Contact:</label>
                        <input type="text" id="edit-contact" name="contact" value="${ticket.contact || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-description">Description:</label>
                        <textarea id="edit-description" name="description" rows="4" required>${ticket.description}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="document.getElementById('edit-ticket-form').dispatchEvent(new Event('submit'))">Save Changes</button>
                <button class="btn btn-secondary" onclick="ticketSystem.closeModal('edit-ticket-modal')">Cancel</button>
            </div>
        `;
    }

    showModal(modalId, content) {
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = this.createModal(modalId);
            document.body.appendChild(modal);
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody && content) {
            modalBody.innerHTML = content;
        }
        
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalOrId) {
        let modal;
        if (typeof modalOrId === 'string') {
            modal = document.getElementById(modalOrId);
        } else {
            modal = modalOrId;
        }
        
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('fade-in');
            document.body.style.overflow = 'auto';
        }
    }

    createModal(id) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Modal Title</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Content will be inserted here -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">Close</button>
                </div>
            </div>
        `;
        return modal;
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    formatDateRelative(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    // Notifications
    setupNotifications() {
        // Create notification container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.remove();
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
        
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'mobile-overlay';
            newOverlay.addEventListener('click', this.toggleMobileMenu);
            document.body.appendChild(newOverlay);
        } else {
            overlay.remove();
        }
    }

    // Draft saving
    saveDraft(textarea) {
        const draftKey = `draft-${textarea.name || 'unnamed'}`;
        localStorage.setItem(draftKey, textarea.value);
    }

    loadDraft(textarea) {
        const draftKey = `draft-${textarea.name || 'unnamed'}`;
        const draft = localStorage.getItem(draftKey);
        if (draft) {
            textarea.value = draft;
        }
    }

    // Export functionality
    exportTickets(format = 'csv') {
        const data = this.getFilteredTickets();
        
        if (format === 'csv') {
            this.exportToCSV(data);
        } else if (format === 'json') {
            this.exportToJSON(data);
        }
    }

    exportToCSV(tickets) {
        const headers = ['ID', 'Title', 'Customer', 'Priority', 'Status', 'Assignee', 'Created', 'Updated'];
        const csvContent = [
            headers.join(','),
            ...tickets.map(ticket => [
                ticket.id,
                `"${ticket.title}"`,
                `"${ticket.customer}"`,
                ticket.priority,
                ticket.status,
                ticket.assignee,
                ticket.createdAt,
                ticket.updatedAt
            ].join(','))
        ].join('\n');
        
        this.downloadFile(csvContent, 'tickets.csv', 'text/csv');
    }

    exportToJSON(tickets) {
        const jsonContent = JSON.stringify(tickets, null, 2);
        this.downloadFile(jsonContent, 'tickets.json', 'application/json');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize the ticketing system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const ticketSystem = new TicketingSystem();
    
    // Global functions for onclick handlers
    window.ticketSystem = ticketSystem;
});