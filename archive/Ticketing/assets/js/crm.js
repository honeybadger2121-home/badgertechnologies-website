// CRM Module - Customer Relationship Management
// Odoo-inspired CRM functionality for Badger Technologies

class CRMManager {
    constructor() {
        this.customers = [];
        this.leads = [];
        this.opportunities = [];
        this.activities = [];
        this.communications = [];
        this.currentCustomer = null;
        this.init();
    }

    init() {
        this.loadCRMData();
        this.setupCRMEventListeners();
        this.initializeSampleData();
    }

    // Data Management
    loadCRMData() {
        // Load from localStorage or database
        const savedCustomers = localStorage.getItem('badger-crm-customers');
        if (savedCustomers) {
            this.customers = JSON.parse(savedCustomers);
        }

        const savedLeads = localStorage.getItem('badger-crm-leads');
        if (savedLeads) {
            this.leads = JSON.parse(savedLeads);
        }

        const savedOpportunities = localStorage.getItem('badger-crm-opportunities');
        if (savedOpportunities) {
            this.opportunities = JSON.parse(savedOpportunities);
        }
    }

    saveCRMData() {
        localStorage.setItem('badger-crm-customers', JSON.stringify(this.customers));
        localStorage.setItem('badger-crm-leads', JSON.stringify(this.leads));
        localStorage.setItem('badger-crm-opportunities', JSON.stringify(this.opportunities));
    }

    initializeSampleData() {
        if (this.customers.length === 0) {
            this.customers = [
                {
                    id: 1,
                    name: 'Ecker Center for Behavioral Health',
                    type: 'Healthcare',
                    primaryContact: 'John Smith',
                    email: 'john@eckercenter.org',
                    phone: '555-0101',
                    address: '123 Healthcare Dr, Medical City, MC 12345',
                    status: 'active',
                    totalTickets: 15,
                    totalRevenue: 12500,
                    lastContact: new Date(Date.now() - 86400000 * 5).toISOString(),
                    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
                    notes: 'Large healthcare organization with 200+ employees. Primary focus on network security and HIPAA compliance.'
                },
                {
                    id: 2,
                    name: 'Downtown Law Firm',
                    type: 'Legal',
                    primaryContact: 'Sarah Johnson',
                    email: 'sarah@downtownlaw.com',
                    phone: '555-0102',
                    address: '456 Legal Ave, Downtown, DT 67890',
                    status: 'active',
                    totalTickets: 8,
                    totalRevenue: 8500,
                    lastContact: new Date(Date.now() - 86400000 * 2).toISOString(),
                    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
                    notes: 'Mid-size law firm specializing in corporate law. Needs reliable email and document management systems.'
                },
                {
                    id: 3,
                    name: 'Riverside Medical Practice',
                    type: 'Healthcare',
                    primaryContact: 'Dr. Michael Davis',
                    email: 'michael@riverside-med.com',
                    phone: '555-0103',
                    address: '789 Riverside Rd, Riverside, RS 13579',
                    status: 'prospect',
                    totalTickets: 3,
                    totalRevenue: 2500,
                    lastContact: new Date(Date.now() - 86400000 * 1).toISOString(),
                    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
                    notes: 'Small medical practice interested in our managed services package. Currently evaluating options.'
                }
            ];

            this.leads = [
                {
                    id: 1,
                    title: 'IT Infrastructure Upgrade',
                    company: 'Metro Manufacturing',
                    contact: 'Tom Wilson',
                    email: 'tom@metro-mfg.com',
                    phone: '555-0201',
                    stage: 'qualified',
                    value: 25000,
                    probability: 70,
                    expectedCloseDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                    source: 'Website Inquiry',
                    description: 'Complete network infrastructure overhaul for manufacturing facility with 150 employees.',
                    createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
                },
                {
                    id: 2,
                    title: 'Managed Security Services',
                    company: 'Sunrise Financial',
                    contact: 'Lisa Chen',
                    email: 'lisa@sunrise-fin.com',
                    phone: '555-0202',
                    stage: 'proposal',
                    value: 18000,
                    probability: 60,
                    expectedCloseDate: new Date(Date.now() + 86400000 * 21).toISOString(),
                    source: 'Referral',
                    description: 'Comprehensive cybersecurity package including monitoring, backup, and incident response.',
                    createdAt: new Date(Date.now() - 86400000 * 21).toISOString()
                },
                {
                    id: 3,
                    title: 'Cloud Migration Project',
                    company: 'Creative Design Studio',
                    contact: 'Alex Rodriguez',
                    email: 'alex@creativestudio.com',
                    phone: '555-0203',
                    stage: 'initial',
                    value: 15000,
                    probability: 30,
                    expectedCloseDate: new Date(Date.now() + 86400000 * 45).toISOString(),
                    source: 'Cold Call',
                    description: 'Migration from on-premises servers to Azure cloud infrastructure.',
                    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
                }
            ];

            this.opportunities = [
                {
                    id: 1,
                    name: 'Enterprise Support Contract',
                    customer: 'Ecker Center for Behavioral Health',
                    value: 45000,
                    probability: 80,
                    stage: 'negotiation',
                    expectedCloseDate: new Date(Date.now() + 86400000 * 15).toISOString(),
                    description: '3-year enterprise support contract with 24/7 monitoring and response.',
                    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
                },
                {
                    id: 2,
                    name: 'Network Security Audit',
                    customer: 'Downtown Law Firm',
                    value: 8500,
                    probability: 90,
                    stage: 'proposal-sent',
                    expectedCloseDate: new Date(Date.now() + 86400000 * 10).toISOString(),
                    description: 'Comprehensive security audit and penetration testing services.',
                    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
                }
            ];

            this.saveCRMData();
        }
    }

    // Event Listeners
    setupCRMEventListeners() {
        // Customer search functionality
        const customerSearch = document.getElementById('customer-search');
        if (customerSearch) {
            customerSearch.addEventListener('input', (e) => {
                this.filterCustomers(e.target.value);
            });
        }

        // Lead stage updates
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lead-card')) {
                const leadId = e.target.getAttribute('data-lead-id');
                this.showLeadDetails(leadId);
            }
        });

        // Customer selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.customer-item')) {
                const customerId = e.target.closest('.customer-item').getAttribute('data-customer-id');
                this.selectCustomer(customerId);
            }
        });
    }

    // Customer Management
    renderCustomerList() {
        const customerList = document.getElementById('customer-list');
        if (!customerList) return;

        customerList.innerHTML = this.customers.map(customer => `
            <div class="customer-item" data-customer-id="${customer.id}">
                <div class="customer-info">
                    <div>
                        <div class="customer-name">${customer.name}</div>
                        <div class="customer-contact">${customer.primaryContact} • ${customer.email}</div>
                    </div>
                    <div class="customer-stats">
                        <div class="customer-tickets">${customer.totalTickets} tickets</div>
                        <div class="customer-revenue">$${customer.totalRevenue.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterCustomers(searchTerm) {
        const filteredCustomers = this.customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const customerList = document.getElementById('customer-list');
        if (!customerList) return;

        customerList.innerHTML = filteredCustomers.map(customer => `
            <div class="customer-item" data-customer-id="${customer.id}">
                <div class="customer-info">
                    <div>
                        <div class="customer-name">${customer.name}</div>
                        <div class="customer-contact">${customer.primaryContact} • ${customer.email}</div>
                    </div>
                    <div class="customer-stats">
                        <div class="customer-tickets">${customer.totalTickets} tickets</div>
                        <div class="customer-revenue">$${customer.totalRevenue.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectCustomer(customerId) {
        this.currentCustomer = this.customers.find(c => c.id === parseInt(customerId));
        if (this.currentCustomer) {
            this.renderCustomerProfile();
        }
    }

    renderCustomerProfile() {
        if (!this.currentCustomer) return;

        const profileContainer = document.getElementById('customer-profile');
        if (!profileContainer) return;

        const customer = this.currentCustomer;
        const avatarInitials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2);

        profileContainer.innerHTML = `
            <div class="customer-profile-header">
                <div class="customer-avatar">${avatarInitials}</div>
                <div class="customer-profile-name">${customer.name}</div>
                <div class="customer-profile-type">${customer.type} • ${customer.status}</div>
            </div>
            <div class="customer-profile-content">
                <div class="customer-tabs">
                    <button class="customer-tab active" data-tab="overview">Overview</button>
                    <button class="customer-tab" data-tab="tickets">Tickets</button>
                    <button class="customer-tab" data-tab="opportunities">Opportunities</button>
                    <button class="customer-tab" data-tab="communications">Communications</button>
                </div>
                <div class="customer-tab-content" id="customer-tab-content">
                    ${this.renderCustomerOverview(customer)}
                </div>
            </div>
        `;

        // Add tab functionality
        const tabs = profileContainer.querySelectorAll('.customer-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                const tabContent = document.getElementById('customer-tab-content');
                const tabName = e.target.getAttribute('data-tab');
                
                switch(tabName) {
                    case 'overview':
                        tabContent.innerHTML = this.renderCustomerOverview(customer);
                        break;
                    case 'tickets':
                        tabContent.innerHTML = this.renderCustomerTickets(customer);
                        break;
                    case 'opportunities':
                        tabContent.innerHTML = this.renderCustomerOpportunities(customer);
                        break;
                    case 'communications':
                        tabContent.innerHTML = this.renderCustomerCommunications(customer);
                        break;
                }
            });
        });
    }

    renderCustomerOverview(customer) {
        return `
            <div class="customer-overview">
                <div class="customer-details">
                    <h3>Contact Information</h3>
                    <p><strong>Primary Contact:</strong> ${customer.primaryContact}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                    <p><strong>Address:</strong> ${customer.address}</p>
                </div>
                <div class="customer-stats-overview">
                    <h3>Account Summary</h3>
                    <p><strong>Total Tickets:</strong> ${customer.totalTickets}</p>
                    <p><strong>Total Revenue:</strong> $${customer.totalRevenue.toLocaleString()}</p>
                    <p><strong>Last Contact:</strong> ${this.formatDate(customer.lastContact)}</p>
                    <p><strong>Customer Since:</strong> ${this.formatDate(customer.createdAt)}</p>
                </div>
                <div class="customer-notes">
                    <h3>Notes</h3>
                    <p>${customer.notes}</p>
                </div>
            </div>
        `;
    }

    renderCustomerTickets(customer) {
        return `
            <div class="customer-tickets-section">
                <h3>Recent Tickets</h3>
                <p>Integration with ticket system - showing tickets for ${customer.name}</p>
                <button class="btn btn-primary" onclick="window.ticketSystem?.navigateToSection('tickets')">
                    View All Tickets
                </button>
            </div>
        `;
    }

    renderCustomerOpportunities(customer) {
        const customerOpportunities = this.opportunities.filter(opp => opp.customer === customer.name);
        
        return `
            <div class="customer-opportunities-section">
                <h3>Opportunities</h3>
                ${customerOpportunities.map(opp => `
                    <div class="opportunity-item">
                        <h4>${opp.name}</h4>
                        <p><strong>Value:</strong> $${opp.value.toLocaleString()}</p>
                        <p><strong>Probability:</strong> ${opp.probability}%</p>
                        <p><strong>Stage:</strong> ${opp.stage}</p>
                        <p><strong>Expected Close:</strong> ${this.formatDate(opp.expectedCloseDate)}</p>
                    </div>
                `).join('')}
                ${customerOpportunities.length === 0 ? '<p>No active opportunities</p>' : ''}
            </div>
        `;
    }

    renderCustomerCommunications(customer) {
        return `
            <div class="customer-communications-section">
                <h3>Communication History</h3>
                <div class="communication-log">
                    <div class="communication-item">
                        <div class="communication-header">
                            <div class="communication-type">
                                <div class="communication-icon email">📧</div>
                                Email
                            </div>
                            <div class="communication-date">${this.formatDate(new Date(Date.now() - 86400000 * 2))}</div>
                        </div>
                        <div class="communication-content">
                            Follow-up on recent network upgrade project. Customer satisfaction confirmed.
                        </div>
                    </div>
                    <div class="communication-item">
                        <div class="communication-header">
                            <div class="communication-type">
                                <div class="communication-icon call">📞</div>
                                Phone Call
                            </div>
                            <div class="communication-date">${this.formatDate(new Date(Date.now() - 86400000 * 5))}</div>
                        </div>
                        <div class="communication-content">
                            Discussed upcoming security audit requirements and timeline.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Lead Management
    renderLeadPipeline() {
        const pipelineContainer = document.getElementById('lead-pipeline');
        if (!pipelineContainer) return;

        const stages = ['initial', 'qualified', 'proposal', 'negotiation'];
        const stageNames = {
            'initial': 'Initial Contact',
            'qualified': 'Qualified Lead',
            'proposal': 'Proposal Sent',
            'negotiation': 'Negotiation'
        };

        pipelineContainer.innerHTML = stages.map(stage => {
            const stageLeads = this.leads.filter(lead => lead.stage === stage);
            
            return `
                <div class="lead-stage">
                    <div class="lead-stage-header">
                        <div class="lead-stage-title">${stageNames[stage]}</div>
                        <div class="lead-stage-count">${stageLeads.length}</div>
                    </div>
                    <div class="lead-stage-content">
                        ${stageLeads.map(lead => `
                            <div class="lead-card" data-lead-id="${lead.id}">
                                <div class="lead-card-header">
                                    <div class="lead-title">${lead.title}</div>
                                    <div class="lead-value">$${lead.value.toLocaleString()}</div>
                                </div>
                                <div class="lead-company">${lead.company}</div>
                                <div class="lead-progress">
                                    <div class="lead-progress-bar" style="width: ${lead.probability}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Dashboard Statistics
    renderCRMDashboard() {
        const dashboardContainer = document.getElementById('crm-dashboard');
        if (!dashboardContainer) return;

        const totalCustomers = this.customers.length;
        const activeLeads = this.leads.length;
        const totalOpportunities = this.opportunities.reduce((sum, opp) => sum + opp.value, 0);

        dashboardContainer.innerHTML = `
            <div class="crm-card leads">
                <div class="crm-metric">
                    <div>
                        <div class="crm-metric-value">${activeLeads}</div>
                        <div class="crm-metric-label">Active Leads</div>
                    </div>
                    <div class="crm-trend up">
                        <i class="fas fa-arrow-up"></i> 12%
                    </div>
                </div>
            </div>
            <div class="crm-card customers">
                <div class="crm-metric">
                    <div>
                        <div class="crm-metric-value">${totalCustomers}</div>
                        <div class="crm-metric-label">Total Customers</div>
                    </div>
                    <div class="crm-trend up">
                        <i class="fas fa-arrow-up"></i> 8%
                    </div>
                </div>
            </div>
            <div class="crm-card opportunities">
                <div class="crm-metric">
                    <div>
                        <div class="crm-metric-value">$${(totalOpportunities / 1000).toFixed(0)}K</div>
                        <div class="crm-metric-label">Pipeline Value</div>
                    </div>
                    <div class="crm-trend up">
                        <i class="fas fa-arrow-up"></i> 15%
                    </div>
                </div>
            </div>
        `;
    }

    // Utility Functions
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

    // Integration with Main Ticketing System
    getCustomerTickets(customerId) {
        // Integration point with main ticketing system
        if (window.ticketSystem) {
            return window.ticketSystem.tickets.filter(ticket => 
                ticket.customer && ticket.customer.toLowerCase().includes(
                    this.customers.find(c => c.id === customerId)?.name.toLowerCase() || ''
                )
            );
        }
        return [];
    }

    createCustomerFromTicket(ticketData) {
        // Create customer from ticket if not exists
        const existingCustomer = this.customers.find(c => 
            c.name.toLowerCase() === ticketData.customer.toLowerCase()
        );
        
        if (!existingCustomer) {
            const newCustomer = {
                id: Date.now(),
                name: ticketData.customer,
                type: 'Business',
                primaryContact: ticketData.contact || 'Unknown',
                email: '',
                phone: '',
                address: '',
                status: 'active',
                totalTickets: 1,
                totalRevenue: 0,
                lastContact: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                notes: `Customer created from ticket: ${ticketData.title}`
            };
            
            this.customers.push(newCustomer);
            this.saveCRMData();
            return newCustomer;
        }
        
        return existingCustomer;
    }

    // Public API for integration
    refreshCRM() {
        this.renderCRMDashboard();
        this.renderCustomerList();
        this.renderLeadPipeline();
    }
}

// Initialize CRM Manager
const crmManager = new CRMManager();

// Global access for integration
window.crmManager = crmManager;