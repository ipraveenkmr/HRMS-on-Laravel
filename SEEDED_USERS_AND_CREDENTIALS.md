# HRMS Seeded Users & System Test Credentials

All users in the seeded database share a default password for quick access during development and testing.

> **Default Password for All Seeded Users:** `12345678`

---

## 1. User Accounts by Role

### 🛡️ Admin / Super Admin Users
Admins have access to all modules, system configurations, superadmin management (companies, branches, departments, pay grades, assets), all employee records, leave approvals, payroll generation, and system reports.

| Username | Password | Full Name | Designation | Department | Branch | Email |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`praveen`** | `12345678` | Praveen Kumar | Principal Architect & Super Admin | Software Engineering | Bengaluru Head Office | `praveen@trickuweb.com` |
| **`admin_sarah`** | `12345678` | Sarah Jenkins | Director of People & Operations | Human Resources | Bengaluru Head Office | `sarah.jenkins@company.com` |
| **`admin_rahul`** | `12345678` | Rahul Sharma | Head of Global Operations | IT Infrastructure & Operations | Mumbai BKC Main Branch | `rahul.sharma@company.com` |

---

### 👔 Manager Users
Managers have access to their assigned team members, employee attendance records, task assignments, daily task reviews, team leave approvals, and travel expense claims.

| Username | Password | Full Name | Designation | Department | Branch | Email |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`mgr_vikram`** | `12345678` | Vikram Malhotra | Engineering Manager | Software Engineering | Bengaluru Head Office | `vikram.malhotra@company.com` |
| **`mgr_anita`** | `12345678` | Anita Roy | HR Manager - Talent & Culture | Human Resources | Bengaluru Head Office | `anita.roy@company.com` |
| **`mgr_david`** | `12345678` | David Wilson | Finance & Accounts Manager | Finance & Accounts | Mumbai BKC Main Branch | `david.wilson@company.com` |
| **`mgr_priya`** | `12345678` | Priya Nair | Marketing & Growth Lead | Marketing & Communications | Hyderabad Studio | `priya.nair@company.com` |
| **`mgr_suresh`** | `12345678` | Suresh Reddy | Customer Success Manager | Customer Support & Success | Hyderabad Innovation Lab | `suresh.reddy@company.com` |

---

### 📦 Asset Admin Users
Asset Admins have specialized permissions for managing hardware inventory, asset categories, warranty lifecycles, and device allocation/returns.

| Username | Password | Full Name | Designation | Department | Branch | Email |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`asset_karan`** | `12345678` | Karan Kapoor | IT Asset & Hardware Manager | IT Infrastructure & Operations | Bengaluru Head Office | `karan.kapoor@company.com` |
| **`asset_neha`** | `12345678` | Neha Gupta | Facilities & Asset Coordinator | Procurement & Facilities | Mumbai BKC Main Branch | `neha.gupta@company.com` |

---

### 👥 Employee Users
Employees have self-service access to mark attendance, apply for leaves, view leave balance calculators, submit daily task logs, view assigned tasks, view payslips, claim travel expenses, apply for loans, and manage their profile.

| Username | Password | Full Name | Designation | Department | Reporting Manager | Email |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`emp_john`** | `12345678` | John Doe | Senior Full Stack Engineer | Software Engineering | Vikram Malhotra | `john.doe@company.com` |
| **`emp_emma`** | `12345678` | Emma Watson | Backend Engineer (Laravel/Go) | Software Engineering | Vikram Malhotra | `emma.watson@company.com` |
| **`emp_arun`** | `12345678` | Arun Verma | DevOps & SRE Engineer | DevOps & Cloud Infrastructure | Vikram Malhotra | `arun.verma@company.com` |
| **`emp_sneha`** | `12345678` | Sneha Patel | QA Automation Lead | Quality Assurance & Testing | Vikram Malhotra | `sneha.patel@company.com` |
| **`emp_rohit`** | `12345678` | Rohit Singh | Senior UI/UX Designer | UI/UX Design | Vikram Malhotra | `rohit.singh@company.com` |
| **`emp_pooja`** | `12345678` | Pooja Mehra | HR Operations Specialist | Human Resources | Anita Roy | `pooja.mehra@company.com` |
| **`emp_manish`** | `12345678` | Manish Tiwari | Senior Financial Analyst | Finance & Accounts | David Wilson | `manish.tiwari@company.com` |
| **`emp_divya`** | `12345678` | Divya Iyer | Payroll & Tax Executive | Finance & Accounts | David Wilson | `divya.iyer@company.com` |
| **`emp_raj`** | `12345678` | Rajesh Khanna | Performance Marketing Manager | Marketing & Communications | Priya Nair | `rajesh.khanna@company.com` |
| **`emp_meera`** | `12345678` | Meera Joshi | Content & Brand Strategist | Marketing & Communications | Priya Nair | `meera.joshi@company.com` |
| **`emp_alok`** | `12345678` | Alok Mishra | Technical Support Specialist L2 | Customer Support & Success | Suresh Reddy | `alok.mishra@company.com` |
| **`emp_tanya`** | `12345678` | Tanya Sen | Customer Success Specialist | Customer Support & Success | Suresh Reddy | `tanya.sen@company.com` |

---

## 2. Seeded Modules & Record Summary

Every module in the system has been populated with realistic, interconnected dataset records:

| Module | Table Name | Record Count | Description |
| :--- | :--- | :---: | :--- |
| **Users & Auth** | `users` | **22** | Authentication records with hashed credentials and active flags. |
| **Employees** | `employees` | **22** | Core HR profile records linked to companies, branches, departments, and pay grades. |
| **Companies** | `company_details` | **5** | Multi-company setup (TechVanguard, GlobalFin, Apex Logistics, Horizon Media, CyberPulse). |
| **Branches** | `branch_details` | **15** | Office locations with address, GPS coordinates (Bengaluru, Mumbai, Hyderabad, Pune, etc.). |
| **Departments** | `departments` | **16** | Corporate divisions (Engineering, DevOps, QA, Design, HR, Finance, Marketing, etc.). |
| **Pay Grades** | `pay_grades` | **15** | Salary bands (Grades 1 to 15) with Basic, HRA, TA, SA, Medical, and Tax breakdowns. |
| **Financial Years** | `financial_years` | **15** | FY cycles from 2016-2017 to 2030-2031 with daily working hours and interest rates. |
| **Asset Categories** | `asset_categories` | **15** | Categories (Laptops, Monitors, Workstations, Mobile Devices, Network Switches, etc.). |
| **Assets Inventory** | `assets` | **20** | Hardware inventory with serial numbers, purchase dates, models, and values. |
| **Asset Allocations** | `asset_allocations` | **20** | Hardware assigned to employees with issue dates, statuses (In Use, Returned). |
| **Leave Policies** | `leaves` | **15** | Yearly entitlements for CL, EI, LWP, Medical Leave, and Other Leave. |
| **Leave Balances** | `leave_calculators` | **22** | Individual remaining balance tracking per employee for FY 2025-2026. |
| **Leave Applications** | `leave_trackers` | **20** | Leave requests across statuses (`Approved`, `Pending`, `Rejected`). |
| **Leave Audit Logs** | `leave_audits` | **20** | Audit trails for leave transitions and status changes. |
| **Attendance Records** | `attendance_records` | **25** | Daily punch-in/out logs with status (`Present`, `Work From Home`, `Half Day`), timings, and IP addresses. |
| **Assigned Tasks** | `assigned_jobs` | **20** | Manager-assigned deliverables with deadlines and status (`Completed`, `In Progress`, `Pending`). |
| **Daily Tasks** | `daily_tasks` | **20** | Daily work logs submitted by employees. |
| **Loans** | `loans` | **16** | Employee loan applications for emergency, education, medical, with interest rates and tenures. |
| **Loan Calculators** | `loan_calculators` | **16** | EMI schedules and remaining loan balances. |
| **Payslips / Payroll** | `payslips` | **20** | Generated payroll slips with earnings (Basic, HRA, TA, SA), deductions (PF, ESI, Tax), and Net pay. |
| **Travel Expenses** | `travel_expenses` | **20** | Travel reimbursement claims with locations, purposes, receipts, and approval statuses. |
| **Notifications** | `notification_details` | **15** | Company-wide announcements, policy updates, and holiday notices. |
| **Employee Details** | `employee_details` | **20** | Comprehensive KYC, PAN, Aadhaar, and background verification records. |
| **Account Details** | `account_details` | **20** | Bank accounts, IFSC codes, UAN, ESI numbers, and tax regimes (Old/New). |
| **Reference Details** | `reference_details` | **20** | Academic and professional reference contacts. |
| **Offboarding Details**| `offboarding_details`| **5** | Exit interview status, clearance, relieving letters, and final settlement records. |

---

## 3. How to Test & Re-seed

To reset the database and re-seed the full test dataset anytime, run:

```bash
php artisan migrate:fresh --seed
```
