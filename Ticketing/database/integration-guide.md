# Badger Technologies Ticketing System
# SQL Server Integration Configuration

## Overview
This document outlines the steps needed to integrate the ticketing system with your SQL Server database.

## Prerequisites
1. SQL Server 2016 or later
2. IIS or Node.js/Express server for API endpoints
3. .NET Framework 4.7+ or .NET Core 3.1+ (for C# API)
4. SQL Server authentication configured

## Database Setup

### 1. Create the Database
Run the provided `schema.sql` file in SQL Server Management Studio:
```sql
-- Create database
CREATE DATABASE BadgerTicketing;
USE BadgerTicketing;

-- Run the complete schema.sql file
```

### 2. Configure Connection String
Update your API configuration with your SQL Server connection string:

**For .NET Applications:**
```xml
<connectionStrings>
    <add name="BadgerTicketing" 
         connectionString="Server=YOUR_SERVER;Database=BadgerTicketing;Integrated Security=true;" 
         providerName="System.Data.SqlClient" />
</connectionStrings>
```

**For Node.js Applications:**
```javascript
const config = {
    server: 'YOUR_SERVER_NAME',
    database: 'BadgerTicketing',
    authentication: {
        type: 'default',
        options: {
            userName: 'YOUR_USERNAME',
            password: 'YOUR_PASSWORD'
        }
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
```

## API Endpoints Structure

The ticketing system expects these REST API endpoints:

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Tickets
- `GET /api/tickets` - Get all tickets (with filtering)
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{id}` - Get specific ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket

### Comments
- `GET /api/tickets/{id}/comments` - Get ticket comments
- `POST /api/tickets/{id}/comments` - Add comment

### Analytics
- `GET /api/analytics/stats` - Get dashboard statistics
- `GET /api/reports/{type}` - Get report data

### Health Check
- `GET /api/tickets/health` - Database connectivity check

## Sample API Implementation (C# .NET Core)

### 1. Install Required Packages
```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
```

### 2. Entity Models
```csharp
public class Ticket
{
    public int TicketId { get; set; }
    public string TicketNumber { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string Priority { get; set; }
    public int CustomerId { get; set; }
    public int CategoryId { get; set; }
    public int CreatedBy { get; set; }
    public int? AssignedTo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public Customer Customer { get; set; }
    public TicketCategory Category { get; set; }
    public User CreatedByUser { get; set; }
    public User AssignedToUser { get; set; }
    public List<TicketComment> Comments { get; set; }
}
```

### 3. DbContext Configuration
```csharp
public class BadgerTicketingContext : DbContext
{
    public BadgerTicketingContext(DbContextOptions<BadgerTicketingContext> options)
        : base(options)
    {
    }

    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<TicketCategory> TicketCategories { get; set; }
    public DbSet<TicketComment> TicketComments { get; set; }
}
```

### 4. Sample Controller
```csharp
[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly BadgerTicketingContext _context;

    public TicketsController(BadgerTicketingContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets(
        string status = null, 
        string priority = null, 
        string search = null)
    {
        var query = _context.Tickets
            .Include(t => t.Customer)
            .Include(t => t.Category)
            .Include(t => t.AssignedToUser)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "all")
            query = query.Where(t => t.Status == status);

        if (!string.IsNullOrEmpty(priority) && priority != "all")
            query = query.Where(t => t.Priority == priority);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(t => t.Title.Contains(search) || 
                                   t.Customer.OrganizationName.Contains(search));

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Ticket>> CreateTicket(CreateTicketRequest request)
    {
        var ticket = new Ticket
        {
            TicketNumber = GenerateTicketNumber(),
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            Status = "open",
            CustomerId = request.CustomerId,
            CategoryId = request.CategoryId,
            CreatedBy = GetCurrentUserId(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTicket), new { id = ticket.TicketId }, ticket);
    }
}
```

## Frontend Configuration

Update the JavaScript configuration to connect to your API:

```javascript
// In assets/js/database.js, update the constructor:
class DatabaseService {
    constructor() {
        this.apiBase = 'https://your-api-domain.com/api/tickets'; // Your API URL
        this.isConnected = false;
        this.connectionString = null;
        this.init();
    }
}
```

## Security Considerations

### 1. Authentication
- Implement JWT token authentication
- Use secure password hashing (bcrypt, Argon2)
- Implement proper session management

### 2. Database Security
- Use parameterized queries to prevent SQL injection
- Implement proper database user permissions
- Enable SQL Server encryption in transit

### 3. API Security
- Implement CORS properly
- Use HTTPS only
- Validate all input data
- Implement rate limiting

## Deployment Steps

### 1. Database Deployment
1. Run `schema.sql` on your SQL Server
2. Update connection strings in your API
3. Test database connectivity

### 2. API Deployment
1. Deploy your API to IIS or cloud service
2. Configure environment variables
3. Test all endpoints

### 3. Frontend Configuration
1. Update `database.js` with your API URL
2. Test connectivity from browser
3. Verify all features work with live data

## Testing

### Database Tests
```sql
-- Test ticket creation
EXEC sp_CreateTicket 
    @title = 'Test Ticket',
    @description = 'Test Description',
    @customer_id = 1,
    @category_id = 1,
    @created_by = 1;

-- Test views
SELECT * FROM vw_TicketStats;
SELECT * FROM vw_ActiveTickets;
```

### API Testing
Use tools like Postman or curl to test your API endpoints:
```bash
# Test health check
curl -X GET https://your-api-domain.com/api/tickets/health

# Test ticket creation
curl -X POST https://your-api-domain.com/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Ticket","description":"Test"}'
```

## Monitoring and Maintenance

### 1. Database Performance
- Monitor query performance
- Set up index maintenance
- Regular backup schedule

### 2. API Monitoring
- Implement logging
- Monitor response times
- Set up health checks

### 3. Regular Maintenance
- Update statistics
- Clean up old data
- Security updates

## Support

For implementation assistance:
- Email: benjamin@badgertechnologies.us
- Include database version and specific error messages
- Provide connection string (without credentials) if needed

---

This configuration will seamlessly integrate your ticketing system with SQL Server while maintaining the current functionality as a fallback option.