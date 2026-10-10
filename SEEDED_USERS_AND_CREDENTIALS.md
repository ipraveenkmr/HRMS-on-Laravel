# HRMS Users & System Test Credentials (from `hrms.sql`)

All user accounts present in [hrms.sql](file:///d:/work/2026/HRMS-on-Laravel/hrms.sql) are initialized with active status and share the same default password for authentication across Web & Mobile apps.

> 🔑 **Default Password for All Accounts:** `12345678`  
> 🌐 **Live Server API:** `https://test.escl.in/api/`  
> 💾 **Database SQL Dump:** [hrms.sql](file:///d:/work/2026/HRMS-on-Laravel/hrms.sql)

---

## 1. User Accounts by Role & Permissions

### 🛡️ Admin / Super Admin Users (3 Accounts)
Full access to all HRMS administrative modules: Companies, Branches, Departments, Pay Grades, Asset Inventory, Employee Management, Leave Configurations, Payroll, and System Reports.

| Username | Password | Full Name | Employee ID | Designation | Department | Branch & Company | Email | Phone |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`praveen`** | `12345678` | Praveen Kumar | `EMP-0100` | Principal Architect & Super Admin | Software Engineering | Bengaluru Head Office (TechVanguard) | `praveen@trickuweb.com` | `9876543210` |
| **`admin_sarah`** | `12345678` | Sarah Jenkins | `EMP-0101` | Director of People & Operations | Human Resources | Bengaluru Head Office (TechVanguard) | `sarah.jenkins@company.com` | `9876543211` |
| **`admin_rahul`** | `12345678` | Rahul Sharma | `EMP-0102` | Head of Global Operations | IT Infrastructure & Operations | Mumbai BKC Main Branch (GlobalFin) | `rahul.sharma@company.com` | `9876543212` |

---

### 👔 Manager Users (5 Accounts)
Department heads and team leads with access to their direct reports, team attendance logs, daily task reviews, team leave approvals, and travel expense reviews.

| Username | Password | Full Name | Employee ID | Designation | Department | Branch & Company | Email | Phone |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`mgr_vikram`** | `12345678` | Vikram Malhotra | `EMP-0103` | Engineering Manager | Software Engineering | Bengaluru Head Office (TechVanguard) | `vikram.malhotra@company.com` | `9876543213` |
| **`mgr_anita`** | `12345678` | Anita Roy | `EMP-0104` | HR Manager - Talent & Culture | Human Resources | Bengaluru Head Office (TechVanguard) | `anita.roy@company.com` | `9876543214` |
| **`mgr_david`** | `12345678` | David Wilson | `EMP-0105` | Finance & Accounts Manager | Finance & Accounts | Mumbai BKC Main Branch (GlobalFin) | `david.wilson@company.com` | `9876543215` |
| **`mgr_priya`** | `12345678` | Priya Nair | `EMP-0106` | Marketing & Growth Lead | Marketing & Communications | Hyderabad Studio (Horizon Media) | `priya.nair@company.com` | `9876543216` |
| **`mgr_suresh`** | `12345678` | Suresh Reddy | `EMP-0107` | Customer Success Manager | Customer Support & Success | Hyderabad Innovation Lab (TechVanguard) | `suresh.reddy@company.com` | `9876543217` |

---

### 📦 Asset Admin Users (2 Accounts)
Responsible for IT hardware assets, category definitions, serial numbers, allocation records, and equipment maintenance.

| Username | Password | Full Name | Employee ID | Designation | Department | Branch & Company | Email | Phone |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`asset_karan`** | `12345678` | Karan Kapoor | `EMP-0108` | IT Asset & Hardware Manager | IT Infrastructure & Operations | Bengaluru Head Office (TechVanguard) | `karan.kapoor@company.com` | `9876543218` |
| **`asset_neha`** | `12345678` | Neha Gupta | `EMP-0109` | Facilities & Asset Coordinator | Procurement & Facilities | Mumbai BKC Main Branch (GlobalFin) | `neha.gupta@company.com` | `9876543219` |

---

### 👥 Employee Users (12 Accounts)
Self-service mobile & web portal access: Clock in/out attendance, apply for leaves, check leave quotas, log daily tasks, view assigned tasks, download payslips, claim travel expenses, and apply for loans.

| Username | Password | Full Name | Employee ID | Designation | Department | Reporting Manager | Email | Phone |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`emp_john`** | `12345678` | John Doe | `EMP-0110` | Senior Full Stack Engineer | Software Engineering | Vikram Malhotra | `john.doe@company.com` | `9876543220` |
| **`emp_emma`** | `12345678` | Emma Watson | `EMP-0111` | Backend Engineer (Laravel/Go) | Software Engineering | Vikram Malhotra | `emma.watson@company.com` | `9876543221` |
| **`emp_arun`** | `12345678` | Arun Verma | `EMP-0112` | DevOps & SRE Engineer | DevOps & Cloud Infrastructure | Vikram Malhotra | `arun.verma@company.com` | `9876543222` |
| **`emp_sneha`** | `12345678` | Sneha Patel | `EMP-0113` | QA Automation Lead | Quality Assurance & Testing | Vikram Malhotra | `sneha.patel@company.com` | `9876543223` |
| **`emp_rohit`** | `12345678` | Rohit Singh | `EMP-0114` | Senior UI/UX Designer | UI/UX Design | Vikram Malhotra | `rohit.singh@company.com` | `9876543224` |
| **`emp_pooja`** | `12345678` | Pooja Mehra | `EMP-0115` | HR Operations Specialist | Human Resources | Anita Roy | `pooja.mehra@company.com` | `9876543225` |
| **`emp_manish`** | `12345678` | Manish Tiwari | `EMP-0116` | Senior Financial Analyst | Finance & Accounts | David Wilson | `manish.tiwari@company.com` | `9876543226` |
| **`emp_divya`** | `12345678` | Divya Iyer | `EMP-0117` | Payroll & Tax Executive | Finance & Accounts | David Wilson | `divya.iyer@company.com` | `9876543227` |
| **`emp_raj`** | `12345678` | Rajesh Khanna | `EMP-0118` | Performance Marketing Manager | Marketing & Communications | Priya Nair | `rajesh.khanna@company.com` | `9876543228` |
| **`emp_meera`** | `12345678` | Meera Joshi | `EMP-0119` | Content & Brand Strategist | Marketing & Communications | Priya Nair | `meera.joshi@company.com` | `9876543229` |
| **`emp_alok`** | `12345678` | Alok Mishra | `EMP-0120` | Technical Support Specialist L2 | Customer Support & Success | Suresh Reddy | `alok.mishra@company.com` | `9876543230` |
| **`emp_tanya`** | `12345678` | Tanya Sen | `EMP-0121` | Customer Success Specialist | Customer Support & Success | Suresh Reddy | `tanya.sen@company.com` | `9876543231` |

---

## 2. Master Data & Database Summary in `hrms.sql`

The SQL dump [hrms.sql](file:///d:/work/2026/HRMS-on-Laravel/hrms.sql) contains all 34 table structures and clean master records without dummy transactional entries:

| Module | Table Name | Record Count | Description |
| :--- | :--- | :---: | :--- |
| **Users** | `users` | **22** | All 22 user accounts with bcrypt hashed passwords (`12345678`) and `is_active=1`. |
| **Employees** | `employees` | **22** | Linked employee profiles, department mapping, branch, pay grade, and reporting managers. |
| **Companies** | `company_details` | **5** | TechVanguard Solutions, GlobalFin Technologies, Apex Logistics, Horizon Digital Media, CyberPulse. |
| **Branches** | `branch_details` | **15** | Regional branches across Bengaluru, Mumbai, Hyderabad, Pune, Noida, Chennai, Kolkata, etc. |
| **Departments** | `departments` | **16** | Software Eng, DevOps, QA, UI/UX, Product, HR, Finance, Marketing, Sales, Support, InfoSec, etc. |
| **Pay Grades** | `pay_grades` | **15** | Salary grade breakdown bands (Grades 1 to 15) with Basic, HRA, TA, SA, Medical, Edu, and Tax. |
| **Financial Years** | `financial_years` | **15** | Financial cycles (2016-2017 to 2030-2031) with daily shift work hours and loan interest rates. |
| **Asset Categories**| `asset_categories`| **15** | Laptops, Workstations, 4K Monitors, Keyboards, Smartphones, Network Switches, Routers, etc. |
| **Assets Inventory**| `assets` | **20** | Hardware inventory with serial numbers, models, purchase dates, and asset values. |
| **Leave Policies** | `leaves` | **15** | Annual leave quota policies per financial year (CL: 12 days, EI: 15 days, Medical: 10 days, LWP: 30 days). |
| **Leave Balances** | `leave_calculators`| **22** | Initialized leave balance calculator records for each of the 22 employees for FY 2025-2026. |
| **Announcements** | `notification_details`| **15** | Active company notices, policy updates, maintenance schedules, and holiday circulars. |
| **KYC Profiles** | `employee_details` | **20** | Full names, addresses, PAN numbers, Aadhaar numbers, and onboarding metadata. |
| **Bank Accounts** | `account_details` | **20** | Bank accounts (HDFC, ICICI), IFSC codes, UAN numbers, ESI numbers, and tax regimes (New/Old). |
| **References** | `reference_details`| **20** | Verified emergency and professional employer references. |
| **Offboarding** | `offboarding_details`| **5** | Sample exit records, clearance status, and relieving letter dates. |
| **Transactional Data** | `daily_tasks`, `attendance_records`, `leave_trackers`, `payslips`, `loans`, `travel_expenses` | **0** | Clean tables with zero dummy logs. Ready for real user activity. |

---

## 3. Quick Test Guide

### 📱 Flutter Mobile App
- Login URL configured: `https://test.escl.in/api/`
- Test login with any account, for example:
  - **Super Admin**: `praveen` / `12345678`
  - **Manager**: `mgr_vikram` / `12345678`
  - **Employee**: `emp_john` / `12345678`

### 💻 Web App (Frontend)
- Login endpoint configured via React frontend.
- Enter any of the 22 usernames with password `12345678`.

### 🔄 Reset / Reseed Database (Local)
To wipe and re-seed the exact master dataset locally anytime:
```powershell
php artisan migrate:fresh --seed
```
To generate a new SQL export for phpMyAdmin:
```powershell
& "D:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqldump.exe" -h 127.0.0.1 -P 3306 -u root -p12345 --default-character-set=utf8mb4 --add-drop-table --single-transaction --routines --triggers hrmsdb --result-file="d:\work\2026\HRMS-on-Laravel\hrms.sql"
```
