# Laravel HRMS (Human Resource Management System)

This is a comprehensive Laravel-based HRMS system converted from the original Django implementation. The system provides complete HR management functionality including employee management, attendance tracking, payroll, leave management, asset allocation, and loan management.

## Features

### Core Modules
- **Employee Management**: Complete employee lifecycle management with detailed profiles
- **Attendance Tracking**: Location-based check-in/out with time tracking
- **Task Management**: Daily tasks and assigned job tracking
- **Leave Management**: Leave application, approval, and balance tracking
- **Payroll System**: Payslip generation with detailed salary breakdowns
- **Asset Management**: Asset allocation and tracking system
- **Loan Management**: Employee loan applications with EMI calculations

### Technical Features
- **Authentication**: Laravel Sanctum-based API authentication
- **Database**: MySQL with comprehensive migrations
- **API**: RESTful API endpoints for all operations
- **Validation**: Form request validation for data integrity
- **Relationships**: Eloquent ORM relationships between models

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- MySQL 8.0 or higher
- Node.js and NPM (for frontend assets)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd laravel
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database configuration**
   Update your `.env` file with database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hrms_laravel
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

7. **Start the server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | User registration |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout (requires auth) |
| GET | `/api/user` | Get authenticated user |

### Employee Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| POST | `/api/create-employee` | Create new employee |
| GET | `/api/employees/{id}` | Get employee details |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/delete-employee/{id}` | Delete employee |
| GET | `/api/empbydept/{departmentId}` | Get employees by department |

### Attendance Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List all attendance records |
| POST | `/api/create-attendance` | Create attendance record |
| GET | `/api/myattendance/{employeeId}` | Get employee attendance |
| GET | `/api/attendancebydate/{from}/{to}` | Get attendance by date range |
| GET | `/attendance-export-csv/{from}/{to}` | Export attendance to CSV |

### Leave Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves` | List all leave applications |
| POST | `/api/create-leave` | Apply for leave |
| GET | `/api/myleave/{employeeId}` | Get employee leaves |
| GET | `/api/manageleave` | Get pending leave approvals |
| POST | `/api/create-leavemanager` | Approve/reject leave |

### Payroll Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payslip` | List all payslips |
| POST | `/api/create-payslip` | Generate payslip |
| GET | `/api/mypayslip/{employeeId}` | Get employee payslips |

### Asset Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | List all assets |
| POST | `/api/create-asset` | Create new asset |
| GET | `/api/myasset/{employeeId}` | Get employee assets |
| GET | `/api/asset-allocations` | List asset allocations |

### Loan Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loans` | List all loans |
| POST | `/api/create-loan` | Apply for loan |
| GET | `/api/myloan/{employeeId}` | Get employee loans |
| POST | `/api/calculateemi` | Calculate EMI |
| GET | `/api/checkloan/{employeeId}` | Check active loans |

## Database Schema

### Core Tables
- `users` - User authentication
- `employees` - Employee master data
- `departments` - Department management
- `company_details` - Company information
- `branch_details` - Branch information
- `pay_grades` - Salary grade structure

### HR Operations
- `attendance_records` - Daily attendance tracking
- `leave_trackers` - Leave applications
- `leave_calculators` - Leave balance management
- `payslips` - Salary slips
- `assigned_jobs` - Task assignments
- `daily_tasks` - Daily task tracking

### Asset & Finance
- `assets` - Asset master
- `asset_categories` - Asset categorization
- `asset_allocations` - Asset allocation tracking
- `loans` - Loan applications
- `loan_calculators` - Loan EMI calculations
- `financial_years` - Financial year settings

## Models and Relationships

### Employee Model
```php
// Relationships
$employee->department();
$employee->payGrade();
$employee->companyDetail();
$employee->branchDetail();
$employee->attendanceRecords();
$employee->leaveTrackers();
$employee->payslips();
$employee->loans();
$employee->assetAllocations();
```

### Department Model
```php
// Relationships
$department->employees();
$department->attendanceRecords();
$department->leaveTrackers();
$department->payslips();
```

## Security Features

- **API Authentication**: Laravel Sanctum tokens
- **Input Validation**: Form request validation
- **Authorization**: Role-based access control
- **CORS**: Cross-origin resource sharing configured
- **SQL Injection Protection**: Eloquent ORM protection

## Configuration

### Environment Variables
```env
APP_NAME=HRMS
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrms_laravel
DB_USERNAME=username
DB_PASSWORD=password

SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,your-frontend-domain.com
```

## Performance Optimization

- **Database Indexing**: Proper indexes on foreign keys and search fields
- **Eager Loading**: Optimized database queries with relationships
- **Caching**: Laravel cache for frequently accessed data
- **Pagination**: API responses are paginated for better performance

## Testing

Run the test suite:
```bash
php artisan test
```

## Deployment

### Production Checklist
1. Set `APP_ENV=production` and `APP_DEBUG=false`
2. Generate production app key
3. Configure database and cache settings
4. Set up proper file permissions
5. Configure web server (Apache/Nginx)
6. Set up SSL certificates
7. Configure backup strategy

### Docker Deployment
```dockerfile
FROM php:8.2-fpm
# Add your Docker configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoints in Postman collection

## License

This project is licensed under the MIT License.

## Acknowledgments

- Original Django HRMS system
- Laravel Framework
- Laravel Sanctum for API authentication
- MySQL for database management

---

**Note**: This Laravel HRMS system maintains full feature parity with the original Django implementation while leveraging Laravel's robust ecosystem and best practices.