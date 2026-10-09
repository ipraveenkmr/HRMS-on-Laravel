<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\CompanyDetail;
use App\Models\BranchDetail;
use App\Models\Department;
use App\Models\PayGrade;
use App\Models\FinancialYear;
use App\Models\AssetCategory;
use App\Models\Asset;
use App\Models\AssetAllocation;
use App\Models\Leave;
use App\Models\LeaveCalculator;
use App\Models\LeaveTracker;
use App\Models\AttendanceRecord;
use App\Models\AssignedJob;
use App\Models\DailyTask;
use App\Models\Loan;
use App\Models\LoanCalculator;
use App\Models\Payslip;
use App\Models\TravelExpense;
use App\Models\NotificationDetail;
use App\Models\EmployeeDetails;
use App\Models\AccountDetails;
use App\Models\ReferenceDetails;
use App\Models\OffboardingDetails;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('12345678');

        // ==========================================
        // 1. COMPANIES (5 records)
        // ==========================================
        $companies = [
            [
                'company_name' => 'TechVanguard Solutions Pvt Ltd',
                'company_address' => 'Plot 42, Silicon Valley Park, Bengaluru, Karnataka',
                'support_email' => 'support@techvanguard.io',
                'longitude' => '77.5946',
                'latitude' => '12.9716',
                'status' => 'Active',
                'logo' => null,
            ],
            [
                'company_name' => 'GlobalFin Technologies Ltd',
                'company_address' => 'Bandra Kurla Complex, Mumbai, Maharashtra',
                'support_email' => 'contact@globalfin.com',
                'longitude' => '72.8697',
                'latitude' => '19.0657',
                'status' => 'Active',
                'logo' => null,
            ],
            [
                'company_name' => 'Apex Logistics & Supply Chain',
                'company_address' => 'Sector 62, Noida, Uttar Pradesh',
                'support_email' => 'help@apexlogistics.com',
                'longitude' => '77.3639',
                'latitude' => '28.6280',
                'status' => 'Active',
                'logo' => null,
            ],
            [
                'company_name' => 'Horizon Digital Media Labs',
                'company_address' => 'HITEC City, Hyderabad, Telangana',
                'support_email' => 'info@horizonmedia.com',
                'longitude' => '78.3817',
                'latitude' => '17.4474',
                'status' => 'Active',
                'logo' => null,
            ],
            [
                'company_name' => 'CyberPulse Security Systems',
                'company_address' => 'Viman Nagar, Pune, Maharashtra',
                'support_email' => 'ops@cyberpulse.com',
                'longitude' => '73.9143',
                'latitude' => '18.5679',
                'status' => 'Active',
                'logo' => null,
            ],
        ];

        $companyModels = [];
        foreach ($companies as $comp) {
            $companyModels[] = CompanyDetail::firstOrCreate(['company_name' => $comp['company_name']], $comp);
        }

        // ==========================================
        // 2. BRANCHES (15 records)
        // ==========================================
        $branchesData = [
            ['company_name_id' => $companyModels[0]->id, 'branch_name' => 'Bengaluru Head Office', 'branch_address' => 'Outer Ring Road, Bellandur, Bengaluru', 'longitude' => '77.6744', 'latitude' => '12.9304'],
            ['company_name_id' => $companyModels[0]->id, 'branch_name' => 'Hyderabad Innovation Lab', 'branch_address' => 'Mindspace, HITEC City, Hyderabad', 'longitude' => '78.3800', 'latitude' => '17.4400'],
            ['company_name_id' => $companyModels[0]->id, 'branch_name' => 'Pune R&D Center', 'branch_address' => 'Magarpatta City, Hadapsar, Pune', 'longitude' => '73.9280', 'latitude' => '18.5158'],
            ['company_name_id' => $companyModels[0]->id, 'branch_name' => 'Noida Cyber Hub', 'branch_address' => 'Expressway Tower, Sector 125, Noida', 'longitude' => '77.3300', 'latitude' => '28.5355'],
            
            ['company_name_id' => $companyModels[1]->id, 'branch_name' => 'Mumbai BKC Main Branch', 'branch_address' => 'G-Block, BKC, Bandra East, Mumbai', 'longitude' => '72.8697', 'latitude' => '19.0657'],
            ['company_name_id' => $companyModels[1]->id, 'branch_name' => 'Chennai Banking Tower', 'branch_address' => 'OMR IT Corridor, Thoraipakkam, Chennai', 'longitude' => '80.2376', 'latitude' => '12.9348'],
            ['company_name_id' => $companyModels[1]->id, 'branch_name' => 'Kolkata Regional Branch', 'branch_address' => 'Salt Lake Sector V, Kolkata', 'longitude' => '88.4312', 'latitude' => '22.5804'],
            ['company_name_id' => $companyModels[1]->id, 'branch_name' => 'Ahmedabad Finance Hub', 'branch_address' => 'SG Highway, Bodakdev, Ahmedabad', 'longitude' => '72.5074', 'latitude' => '23.0373'],
            
            ['company_name_id' => $companyModels[2]->id, 'branch_name' => 'Delhi NCR Central Warehouse', 'branch_address' => 'NH-48, Bilaspur, Gurugram', 'longitude' => '76.8856', 'latitude' => '28.3248'],
            ['company_name_id' => $companyModels[2]->id, 'branch_name' => 'Jaipur Distribution Hub', 'branch_address' => 'Sitapura Industrial Area, Jaipur', 'longitude' => '75.8341', 'latitude' => '26.7828'],
            ['company_name_id' => $companyModels[2]->id, 'branch_name' => 'Indore Logistics Center', 'branch_address' => 'Super Corridor, Indore', 'longitude' => '75.8118', 'latitude' => '22.7533'],
            
            ['company_name_id' => $companyModels[3]->id, 'branch_name' => 'Hyderabad Studio', 'branch_address' => 'Jubilee Hills, Hyderabad', 'longitude' => '78.4073', 'latitude' => '17.4319'],
            ['company_name_id' => $companyModels[3]->id, 'branch_name' => 'Goa Creative Studio', 'branch_address' => 'Panaji Waterfront, Goa', 'longitude' => '73.8278', 'latitude' => '15.4909'],
            
            ['company_name_id' => $companyModels[4]->id, 'branch_name' => 'Pune Security Ops Center', 'branch_address' => 'Kharadi IT Park, Pune', 'longitude' => '73.9472', 'latitude' => '18.5514'],
            ['company_name_id' => $companyModels[4]->id, 'branch_name' => 'Chandigarh Cyber Cell', 'branch_address' => 'Rajiv Gandhi Tech Park, Chandigarh', 'longitude' => '76.8406', 'latitude' => '30.7262'],
        ];

        $branchModels = [];
        foreach ($branchesData as $b) {
            $branchModels[] = BranchDetail::firstOrCreate(
                ['branch_name' => $b['branch_name']],
                $b
            );
        }

        // ==========================================
        // 3. DEPARTMENTS (16 records)
        // ==========================================
        $departmentNames = [
            'Software Engineering',
            'DevOps & Cloud Infrastructure',
            'Quality Assurance & Testing',
            'UI/UX Design',
            'Product Management',
            'Human Resources',
            'Finance & Accounts',
            'Marketing & Communications',
            'Sales & Business Development',
            'Customer Support & Success',
            'IT Infrastructure & Operations',
            'Legal & Regulatory Compliance',
            'Procurement & Facilities',
            'Research & Development',
            'Business Analytics & Data Science',
            'Cyber Security & InfoSec',
        ];

        $deptModels = [];
        foreach ($departmentNames as $dName) {
            $deptModels[] = Department::firstOrCreate(['department_name' => $dName]);
        }

        // ==========================================
        // 4. PAY GRADES (15 records)
        // ==========================================
        $payGradesData = [
            ['grade' => 1, 'min_gross_range' => 20000, 'max_gross_range' => 35000, 'basic' => 45, 'hra' => 20, 'ta' => 10, 'com' => 0, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 0],
            ['grade' => 2, 'min_gross_range' => 35001, 'max_gross_range' => 50000, 'basic' => 45, 'hra' => 20, 'ta' => 10, 'com' => 0, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 2],
            ['grade' => 3, 'min_gross_range' => 50001, 'max_gross_range' => 70000, 'basic' => 40, 'hra' => 20, 'ta' => 10, 'com' => 5, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 5],
            ['grade' => 4, 'min_gross_range' => 70001, 'max_gross_range' => 90000, 'basic' => 40, 'hra' => 20, 'ta' => 10, 'com' => 5, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 8],
            ['grade' => 5, 'min_gross_range' => 90001, 'max_gross_range' => 120000, 'basic' => 40, 'hra' => 20, 'ta' => 10, 'com' => 5, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 10],
            ['grade' => 6, 'min_gross_range' => 120001, 'max_gross_range' => 150000, 'basic' => 35, 'hra' => 20, 'ta' => 10, 'com' => 10, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 12],
            ['grade' => 7, 'min_gross_range' => 150001, 'max_gross_range' => 180000, 'basic' => 35, 'hra' => 20, 'ta' => 10, 'com' => 10, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 15],
            ['grade' => 8, 'min_gross_range' => 180001, 'max_gross_range' => 220000, 'basic' => 35, 'hra' => 20, 'ta' => 10, 'com' => 10, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 18],
            ['grade' => 9, 'min_gross_range' => 220001, 'max_gross_range' => 260000, 'basic' => 30, 'hra' => 20, 'ta' => 10, 'com' => 15, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 20],
            ['grade' => 10, 'min_gross_range' => 260001, 'max_gross_range' => 300000, 'basic' => 30, 'hra' => 20, 'ta' => 10, 'com' => 15, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 22],
            ['grade' => 11, 'min_gross_range' => 300001, 'max_gross_range' => 350000, 'basic' => 30, 'hra' => 20, 'ta' => 10, 'com' => 15, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 25],
            ['grade' => 12, 'min_gross_range' => 350001, 'max_gross_range' => 400000, 'basic' => 30, 'hra' => 20, 'ta' => 10, 'com' => 15, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 28],
            ['grade' => 13, 'min_gross_range' => 400001, 'max_gross_range' => 500000, 'basic' => 25, 'hra' => 20, 'ta' => 10, 'com' => 20, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 30],
            ['grade' => 14, 'min_gross_range' => 500001, 'max_gross_range' => 650000, 'basic' => 25, 'hra' => 20, 'ta' => 10, 'com' => 20, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 30],
            ['grade' => 15, 'min_gross_range' => 650001, 'max_gross_range' => 900000, 'basic' => 25, 'hra' => 20, 'ta' => 10, 'com' => 20, 'medical' => 5, 'edu' => 5, 'sa' => 15, 'income_tax' => 30],
        ];

        $payGradeModels = [];
        foreach ($payGradesData as $pg) {
            $payGradeModels[] = PayGrade::firstOrCreate(['grade' => $pg['grade']], $pg);
        }

        // ==========================================
        // 5. FINANCIAL YEARS (15 records)
        // ==========================================
        $finYears = [
            ['year' => '2016-2017', 'working_hours' => 8.0, 'loan_interest_rate' => 8.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2017-2018', 'working_hours' => 8.0, 'loan_interest_rate' => 8.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2018-2019', 'working_hours' => 8.0, 'loan_interest_rate' => 8.0, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2019-2020', 'working_hours' => 8.0, 'loan_interest_rate' => 7.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2020-2021', 'working_hours' => 8.5, 'loan_interest_rate' => 7.0, 'login_time' => '09:30:00', 'logout_time' => '18:00:00'],
            ['year' => '2021-2022', 'working_hours' => 8.5, 'loan_interest_rate' => 7.0, 'login_time' => '09:30:00', 'logout_time' => '18:00:00'],
            ['year' => '2022-2023', 'working_hours' => 8.5, 'loan_interest_rate' => 7.25, 'login_time' => '09:30:00', 'logout_time' => '18:00:00'],
            ['year' => '2023-2024', 'working_hours' => 8.5, 'loan_interest_rate' => 7.5, 'login_time' => '09:30:00', 'logout_time' => '18:00:00'],
            ['year' => '2024-2025', 'working_hours' => 8.5, 'loan_interest_rate' => 7.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2025-2026', 'working_hours' => 8.5, 'loan_interest_rate' => 7.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2026-2027', 'working_hours' => 8.5, 'loan_interest_rate' => 7.0, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2027-2028', 'working_hours' => 8.5, 'loan_interest_rate' => 7.0, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2028-2029', 'working_hours' => 8.5, 'loan_interest_rate' => 6.75, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2029-2030', 'working_hours' => 8.5, 'loan_interest_rate' => 6.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
            ['year' => '2030-2031', 'working_hours' => 8.5, 'loan_interest_rate' => 6.5, 'login_time' => '09:00:00', 'logout_time' => '17:30:00'],
        ];

        $finYearModels = [];
        foreach ($finYears as $fy) {
            $finYearModels[] = FinancialYear::firstOrCreate(['year' => $fy['year']], $fy);
        }
        $currentFy = $finYearModels[9]; // 2025-2026

        // ==========================================
        // 6. ASSET CATEGORIES (15 records)
        // ==========================================
        $assetCategoryNames = [
            'Laptops & Notebooks',
            'Desktop Workstations',
            'LED & 4K Monitors',
            'Keyboards & Mice',
            'Corporate Smartphones',
            'Tablets & iPads',
            'Network Switches & Hubs',
            'Wi-Fi Routers & APs',
            'Office Printers & Scanners',
            'Conference Projectors',
            'Ergonomic Chairs',
            'Motorized Standing Desks',
            'Rack Servers & Storage',
            'Audio & Video Equipment',
            'Company Fleet Vehicles',
        ];

        $assetCatModels = [];
        foreach ($assetCategoryNames as $catName) {
            $assetCatModels[] = AssetCategory::firstOrCreate(['category' => $catName]);
        }

        // ==========================================
        // 7. ASSETS (20 records)
        // ==========================================
        $assetsData = [
            ['asset_category_id' => $assetCatModels[0]->id, 'asset_name' => 'Apple MacBook Pro 16" M3 Max', 'manufacturer' => 'Apple Inc', 'model_number' => 'MBP-16-M3-64G', 'serial_number' => 'C02G89X0MD6R', 'support_link' => 'https://support.apple.com', 'purchasing_date' => '2024-01-15', 'active_service_date' => '2024-01-20', 'purchasing_value' => '320000', 'description' => '64GB RAM, 1TB SSD Space Gray development laptop'],
            ['asset_category_id' => $assetCatModels[0]->id, 'asset_name' => 'Apple MacBook Pro 14" M3 Pro', 'manufacturer' => 'Apple Inc', 'model_number' => 'MBP-14-M3-36G', 'serial_number' => 'C02F71K9MD6P', 'support_link' => 'https://support.apple.com', 'purchasing_date' => '2024-02-10', 'active_service_date' => '2024-02-15', 'purchasing_value' => '210000', 'description' => '36GB RAM, 512GB SSD Silver laptop for frontend team'],
            ['asset_category_id' => $assetCatModels[0]->id, 'asset_name' => 'Dell XPS 15 9530', 'manufacturer' => 'Dell Technologies', 'model_number' => 'XPS-15-OLED', 'serial_number' => 'DLXPS1599823', 'support_link' => 'https://dell.com/support', 'purchasing_date' => '2024-03-01', 'active_service_date' => '2024-03-05', 'purchasing_value' => '195000', 'description' => 'i9 13th Gen, 32GB RAM, 1TB SSD OLED'],
            ['asset_category_id' => $assetCatModels[0]->id, 'asset_name' => 'Lenovo ThinkPad X1 Carbon Gen 11', 'manufacturer' => 'Lenovo', 'model_number' => 'TP-X1-C11', 'serial_number' => 'LNTPX1887210', 'support_link' => 'https://lenovo.com/support', 'purchasing_date' => '2024-03-12', 'active_service_date' => '2024-03-15', 'purchasing_value' => '175000', 'description' => 'Executive lightweight ultra-portable laptop'],
            ['asset_category_id' => $assetCatModels[1]->id, 'asset_name' => 'Dell Precision 3660 Workstation', 'manufacturer' => 'Dell Technologies', 'model_number' => 'PREC-3660', 'serial_number' => 'DLPR36601149', 'support_link' => 'https://dell.com/support', 'purchasing_date' => '2023-11-20', 'active_service_date' => '2023-11-25', 'purchasing_value' => '240000', 'description' => 'Core i9, 64GB RAM, RTX 4000 GPU ML machine'],
            ['asset_category_id' => $assetCatModels[2]->id, 'asset_name' => 'Dell UltraSharp 32" 4K USB-C Hub Monitor', 'manufacturer' => 'Dell Technologies', 'model_number' => 'U3223QE', 'serial_number' => 'CN0998DL3201', 'support_link' => 'https://dell.com/support', 'purchasing_date' => '2024-01-10', 'active_service_date' => '2024-01-15', 'purchasing_value' => '78000', 'description' => '4K IPS Black IPS Hub with 90W Power Delivery'],
            ['asset_category_id' => $assetCatModels[2]->id, 'asset_name' => 'LG 27" 4K UHD Ergo Monitor', 'manufacturer' => 'LG Electronics', 'model_number' => '27UN880-B', 'serial_number' => 'LG27UN880901', 'support_link' => 'https://lg.com/support', 'purchasing_date' => '2024-01-12', 'active_service_date' => '2024-01-16', 'purchasing_value' => '42000', 'description' => 'Ergonomic arm mount monitor for developers'],
            ['asset_category_id' => $assetCatModels[3]->id, 'asset_name' => 'Logitech MX Master 3S + MX Keys Combo', 'manufacturer' => 'Logitech', 'model_number' => 'MX-COMBO-3S', 'serial_number' => 'LOGIMX3S9981', 'support_link' => 'https://logitech.com/support', 'purchasing_date' => '2024-02-01', 'active_service_date' => '2024-02-05', 'purchasing_value' => '18500', 'description' => 'Quiet wireless ergonomic keyboard and mouse combo'],
            ['asset_category_id' => $assetCatModels[4]->id, 'asset_name' => 'Apple iPhone 15 Pro 256GB', 'manufacturer' => 'Apple Inc', 'model_number' => 'A3102-IP15P', 'serial_number' => 'DNPG1098IP15', 'support_link' => 'https://apple.com/support', 'purchasing_date' => '2023-10-05', 'active_service_date' => '2023-10-10', 'purchasing_value' => '134000', 'description' => 'Natural Titanium QA testing and company phone'],
            ['asset_category_id' => $assetCatModels[4]->id, 'asset_name' => 'Samsung Galaxy S24 Ultra 512GB', 'manufacturer' => 'Samsung', 'model_number' => 'SM-S928B', 'serial_number' => 'R5CW1098S24U', 'support_link' => 'https://samsung.com/support', 'purchasing_date' => '2024-02-15', 'active_service_date' => '2024-02-20', 'purchasing_value' => '139000', 'description' => 'Titanium Black executive mobile device'],
            ['asset_category_id' => $assetCatModels[5]->id, 'asset_name' => 'Apple iPad Pro 12.9" M2 Wi-Fi + Cellular', 'manufacturer' => 'Apple Inc', 'model_number' => 'A2764-IPP12', 'serial_number' => 'DLXQ9980IPAD', 'support_link' => 'https://apple.com/support', 'purchasing_date' => '2023-12-01', 'active_service_date' => '2023-12-05', 'purchasing_value' => '125000', 'description' => 'Design & UI/UX wireframing tablet with Apple Pencil 2'],
            ['asset_category_id' => $assetCatModels[6]->id, 'asset_name' => 'Cisco Catalyst 24-Port Gigabit Managed Switch', 'manufacturer' => 'Cisco Systems', 'model_number' => 'C9200L-24P-4G', 'serial_number' => 'FOC24099811A', 'support_link' => 'https://cisco.com/support', 'purchasing_date' => '2023-08-10', 'active_service_date' => '2023-08-15', 'purchasing_value' => '185000', 'description' => 'Layer 3 PoE+ Network Switch for Server Room'],
            ['asset_category_id' => $assetCatModels[7]->id, 'asset_name' => 'Ubiquiti UniFi Dream Machine Special Edition', 'manufacturer' => 'Ubiquiti Inc', 'model_number' => 'UDM-SE-PRO', 'serial_number' => 'UBQU9980UDM1', 'support_link' => 'https://ui.com/support', 'purchasing_date' => '2023-09-01', 'active_service_date' => '2023-09-05', 'purchasing_value' => '65000', 'description' => 'Enterprise 10G Gateway and Network Controller'],
            ['asset_category_id' => $assetCatModels[8]->id, 'asset_name' => 'HP LaserJet Enterprise MFP M528dn', 'manufacturer' => 'HP Inc', 'model_number' => '1PV64A-M528', 'serial_number' => 'CNB19980HP01', 'support_link' => 'https://hp.com/support', 'purchasing_date' => '2023-07-20', 'active_service_date' => '2023-07-25', 'purchasing_value' => '95000', 'description' => 'High volume office multifunction network printer'],
            ['asset_category_id' => $assetCatModels[9]->id, 'asset_name' => 'BenQ 4K HDR Conference Projector', 'manufacturer' => 'BenQ', 'model_number' => 'LK953ST-4K', 'serial_number' => 'BQ4K99801122', 'support_link' => 'https://benq.com/support', 'purchasing_date' => '2023-06-15', 'active_service_date' => '2023-06-20', 'purchasing_value' => '145000', 'description' => 'Board room short-throw laser projector'],
            ['asset_category_id' => $assetCatModels[10]->id, 'asset_name' => 'Herman Miller Aeron Chair Fully Loaded', 'manufacturer' => 'Herman Miller', 'model_number' => 'AERON-SZ-B', 'serial_number' => 'HMA998120011', 'support_link' => 'https://hermanmiller.com', 'purchasing_date' => '2023-05-10', 'active_service_date' => '2023-05-15', 'purchasing_value' => '120000', 'description' => 'Ergonomic posture-fit executive task chair'],
            ['asset_category_id' => $assetCatModels[11]->id, 'asset_name' => 'ErgoSmart Dual-Motor Electric Standing Desk', 'manufacturer' => 'ErgoSmart Tech', 'model_number' => 'ES-DESK-7230', 'serial_number' => 'ESD723099811', 'support_link' => 'https://ergosmart.com', 'purchasing_date' => '2023-05-12', 'active_service_date' => '2023-05-15', 'purchasing_value' => '48000', 'description' => '72x30 inch solid walnut top with memory preset controller'],
            ['asset_category_id' => $assetCatModels[12]->id, 'asset_name' => 'Dell PowerEdge R760 Rack Server', 'manufacturer' => 'Dell Technologies', 'model_number' => 'PER760-2U', 'serial_number' => 'DLPER7609912', 'support_link' => 'https://dell.com/support', 'purchasing_date' => '2023-04-01', 'active_service_date' => '2023-04-10', 'purchasing_value' => '850000', 'description' => '2x Intel Xeon Gold, 256GB ECC RAM, 8x3.84TB NVMe SSD'],
            ['asset_category_id' => $assetCatModels[13]->id, 'asset_name' => 'Sony WH-1000XM5 Noise Cancelling Headphones', 'manufacturer' => 'Sony Corporation', 'model_number' => 'WH1000XM5-BLK', 'serial_number' => 'SNYXM5998011', 'support_link' => 'https://sony.com/support', 'purchasing_date' => '2024-01-05', 'active_service_date' => '2024-01-08', 'purchasing_value' => '29990', 'description' => 'Premium ANC wireless headset for dev team'],
            ['asset_category_id' => $assetCatModels[14]->id, 'asset_name' => 'Toyota Innova HyCross Fleet Car (KA-01-MG-9988)', 'manufacturer' => 'Toyota Kirloskar', 'model_number' => 'HYCROSS-ZX', 'serial_number' => 'MBJ110998124', 'support_link' => 'https://toyotabharat.com', 'purchasing_date' => '2023-03-15', 'active_service_date' => '2023-03-20', 'purchasing_value' => '3100000', 'description' => 'Hybrid 7-seater corporate executive transport vehicle'],
        ];

        $assetModels = [];
        foreach ($assetsData as $a) {
            $assetModels[] = Asset::firstOrCreate(['serial_number' => $a['serial_number']], $a);
        }

        // ==========================================
        // 8. USERS & EMPLOYEES (22 records)
        // Categorized by Role: Admin (3), Manager (5), Asset Admin (2), Employee (12)
        // ==========================================
        $usersData = [
            // ADMINS (3)
            [
                'username' => 'praveen',
                'name' => 'Praveen Kumar',
                'email' => 'praveen@trickuweb.com',
                'role' => 'Admin',
                'designation' => 'Principal Architect & Super Admin',
                'gender' => 'Male',
                'dept_idx' => 0, // Software Engineering
                'branch_idx' => 0,
                'grade_idx' => 14,
                'salary' => 350000,
                'ctc' => 4800000,
                'phone' => '9876543210',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'admin_sarah',
                'name' => 'Sarah Jenkins',
                'email' => 'sarah.jenkins@company.com',
                'role' => 'Admin',
                'designation' => 'Director of People & Operations',
                'gender' => 'Female',
                'dept_idx' => 5, // Human Resources
                'branch_idx' => 0,
                'grade_idx' => 13,
                'salary' => 280000,
                'ctc' => 3800000,
                'phone' => '9876543211',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'admin_rahul',
                'name' => 'Rahul Sharma',
                'email' => 'rahul.sharma@company.com',
                'role' => 'Admin',
                'designation' => 'Head of Global Operations',
                'gender' => 'Male',
                'dept_idx' => 10, // IT Infrastructure & Operations
                'branch_idx' => 4,
                'grade_idx' => 13,
                'salary' => 270000,
                'ctc' => 3600000,
                'phone' => '9876543212',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ],

            // MANAGERS (5)
            [
                'username' => 'mgr_vikram',
                'name' => 'Vikram Malhotra',
                'email' => 'vikram.malhotra@company.com',
                'role' => 'Manager',
                'designation' => 'Engineering Manager',
                'gender' => 'Male',
                'dept_idx' => 0, // Software Engineering
                'branch_idx' => 0,
                'grade_idx' => 11,
                'salary' => 220000,
                'ctc' => 3000000,
                'phone' => '9876543213',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'mgr_anita',
                'name' => 'Anita Roy',
                'email' => 'anita.roy@company.com',
                'role' => 'Manager',
                'designation' => 'HR Manager - Talent & Culture',
                'gender' => 'Female',
                'dept_idx' => 5, // Human Resources
                'branch_idx' => 0,
                'grade_idx' => 9,
                'salary' => 160000,
                'ctc' => 2200000,
                'phone' => '9876543214',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'mgr_david',
                'name' => 'David Wilson',
                'email' => 'david.wilson@company.com',
                'role' => 'Manager',
                'designation' => 'Finance & Accounts Manager',
                'gender' => 'Male',
                'dept_idx' => 6, // Finance & Accounts
                'branch_idx' => 4,
                'grade_idx' => 10,
                'salary' => 180000,
                'ctc' => 2500000,
                'phone' => '9876543215',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ],
            [
                'username' => 'mgr_priya',
                'name' => 'Priya Nair',
                'email' => 'priya.nair@company.com',
                'role' => 'Manager',
                'designation' => 'Marketing & Growth Lead',
                'gender' => 'Female',
                'dept_idx' => 7, // Marketing
                'branch_idx' => 11,
                'grade_idx' => 9,
                'salary' => 155000,
                'ctc' => 2100000,
                'phone' => '9876543216',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            [
                'username' => 'mgr_suresh',
                'name' => 'Suresh Reddy',
                'email' => 'suresh.reddy@company.com',
                'role' => 'Manager',
                'designation' => 'Customer Success Manager',
                'gender' => 'Male',
                'dept_idx' => 9, // Customer Support
                'branch_idx' => 1,
                'grade_idx' => 8,
                'salary' => 140000,
                'ctc' => 1900000,
                'phone' => '9876543217',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],

            // ASSET ADMINS (2)
            [
                'username' => 'asset_karan',
                'name' => 'Karan Kapoor',
                'email' => 'karan.kapoor@company.com',
                'role' => 'Asset Admin',
                'designation' => 'IT Asset & Hardware Manager',
                'gender' => 'Male',
                'dept_idx' => 10, // IT Infrastructure
                'branch_idx' => 0,
                'grade_idx' => 7,
                'salary' => 115000,
                'ctc' => 1550000,
                'phone' => '9876543218',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'asset_neha',
                'name' => 'Neha Gupta',
                'email' => 'neha.gupta@company.com',
                'role' => 'Asset Admin',
                'designation' => 'Facilities & Asset Coordinator',
                'gender' => 'Female',
                'dept_idx' => 12, // Procurement & Facilities
                'branch_idx' => 4,
                'grade_idx' => 6,
                'salary' => 95000,
                'ctc' => 1300000,
                'phone' => '9876543219',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ],

            // EMPLOYEES (12)
            [
                'username' => 'emp_john',
                'name' => 'John Doe',
                'email' => 'john.doe@company.com',
                'role' => 'Employee',
                'designation' => 'Senior Full Stack Engineer',
                'gender' => 'Male',
                'dept_idx' => 0, // Software Engineering
                'branch_idx' => 0,
                'grade_idx' => 7,
                'salary' => 125000,
                'ctc' => 1700000,
                'phone' => '9876543220',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'emp_emma',
                'name' => 'Emma Watson',
                'email' => 'emma.watson@company.com',
                'role' => 'Employee',
                'designation' => 'Backend Engineer (Laravel/Go)',
                'gender' => 'Female',
                'dept_idx' => 0, // Software Engineering
                'branch_idx' => 0,
                'grade_idx' => 6,
                'salary' => 105000,
                'ctc' => 1400000,
                'phone' => '9876543221',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'emp_arun',
                'name' => 'Arun Verma',
                'email' => 'arun.verma@company.com',
                'role' => 'Employee',
                'designation' => 'DevOps & SRE Engineer',
                'gender' => 'Male',
                'dept_idx' => 1, // DevOps
                'branch_idx' => 0,
                'grade_idx' => 7,
                'salary' => 120000,
                'ctc' => 1650000,
                'phone' => '9876543222',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'emp_sneha',
                'name' => 'Sneha Patel',
                'email' => 'sneha.patel@company.com',
                'role' => 'Employee',
                'designation' => 'QA Automation Lead',
                'gender' => 'Female',
                'dept_idx' => 2, // QA
                'branch_idx' => 0,
                'grade_idx' => 6,
                'salary' => 98000,
                'ctc' => 1350000,
                'phone' => '9876543223',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'emp_rohit',
                'name' => 'Rohit Singh',
                'email' => 'rohit.singh@company.com',
                'role' => 'Employee',
                'designation' => 'Senior UI/UX Designer',
                'gender' => 'Male',
                'dept_idx' => 3, // UI/UX
                'branch_idx' => 12, // Goa
                'grade_idx' => 6,
                'salary' => 110000,
                'ctc' => 1500000,
                'phone' => '9876543224',
                'city' => 'Panaji',
                'state' => 'Goa',
            ],
            [
                'username' => 'emp_pooja',
                'name' => 'Pooja Mehra',
                'email' => 'pooja.mehra@company.com',
                'role' => 'Employee',
                'designation' => 'HR Operations Specialist',
                'gender' => 'Female',
                'dept_idx' => 5, // HR
                'branch_idx' => 0,
                'grade_idx' => 4,
                'salary' => 75000,
                'ctc' => 1000000,
                'phone' => '9876543225',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'username' => 'emp_manish',
                'name' => 'Manish Tiwari',
                'email' => 'manish.tiwari@company.com',
                'role' => 'Employee',
                'designation' => 'Senior Financial Analyst',
                'gender' => 'Male',
                'dept_idx' => 6, // Finance
                'branch_idx' => 4,
                'grade_idx' => 6,
                'salary' => 100000,
                'ctc' => 1380000,
                'phone' => '9876543226',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ],
            [
                'username' => 'emp_divya',
                'name' => 'Divya Iyer',
                'email' => 'divya.iyer@company.com',
                'role' => 'Employee',
                'designation' => 'Payroll & Tax Executive',
                'gender' => 'Female',
                'dept_idx' => 6, // Finance
                'branch_idx' => 4,
                'grade_idx' => 4,
                'salary' => 80000,
                'ctc' => 1100000,
                'phone' => '9876543227',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ],
            [
                'username' => 'emp_raj',
                'name' => 'Rajesh Khanna',
                'email' => 'rajesh.khanna@company.com',
                'role' => 'Employee',
                'designation' => 'Performance Marketing Manager',
                'gender' => 'Male',
                'dept_idx' => 7, // Marketing
                'branch_idx' => 11,
                'grade_idx' => 5,
                'salary' => 88000,
                'ctc' => 1200000,
                'phone' => '9876543228',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            [
                'username' => 'emp_meera',
                'name' => 'Meera Joshi',
                'email' => 'meera.joshi@company.com',
                'role' => 'Employee',
                'designation' => 'Content & Brand Strategist',
                'gender' => 'Female',
                'dept_idx' => 7, // Marketing
                'branch_idx' => 11,
                'grade_idx' => 4,
                'salary' => 72000,
                'ctc' => 980000,
                'phone' => '9876543229',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            [
                'username' => 'emp_alok',
                'name' => 'Alok Mishra',
                'email' => 'alok.mishra@company.com',
                'role' => 'Employee',
                'designation' => 'Technical Support Specialist L2',
                'gender' => 'Male',
                'dept_idx' => 9, // Customer Support
                'branch_idx' => 1,
                'grade_idx' => 3,
                'salary' => 62000,
                'ctc' => 840000,
                'phone' => '9876543230',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            [
                'username' => 'emp_tanya',
                'name' => 'Tanya Sen',
                'email' => 'tanya.sen@company.com',
                'role' => 'Employee',
                'designation' => 'Customer Success Specialist',
                'gender' => 'Female',
                'dept_idx' => 9, // Customer Support
                'branch_idx' => 1,
                'grade_idx' => 3,
                'salary' => 58000,
                'ctc' => 790000,
                'phone' => '9876543231',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
        ];

        $userModels = [];
        $employeeModels = [];

        foreach ($usersData as $idx => $u) {
            $user = User::firstOrCreate(
                ['username' => $u['username']],
                [
                    'hashed_password' => $defaultPassword,
                    'is_active' => true,
                ]
            );
            $userModels[] = $user;

            $branch = $branchModels[$u['branch_idx']] ?? $branchModels[0];
            $companyId = $branch->company_name_id;
            $dept = $deptModels[$u['dept_idx']] ?? $deptModels[0];
            $payGrade = $payGradeModels[$u['grade_idx']] ?? $payGradeModels[0];

            $employee = Employee::firstOrCreate(
                ['username' => $u['username']],
                [
                    'emp_name' => $u['name'],
                    'company_name_id' => $companyId,
                    'branch_name_id' => $branch->id,
                    'department_id' => $dept->id,
                    'pay_grade_id' => $payGrade->id,
                    'emp_email' => $u['email'],
                    'emp_phone' => $u['phone'],
                    'gender' => $u['gender'],
                    'dob' => '199' . ($idx % 9) . '-0' . (($idx % 9) + 1) . '-15',
                    'city' => $u['city'],
                    'state' => $u['state'],
                    'pincode' => '5600' . sprintf('%02d', $idx + 1),
                    'permanent_address' => 'House #' . ($idx + 101) . ', Landmark Street, ' . $u['city'],
                    'present_address' => 'House #' . ($idx + 101) . ', Landmark Street, ' . $u['city'],
                    'pan' => 'ABCDE' . sprintf('%04d', $idx + 1000) . 'F',
                    'aadhaar' => '4589' . sprintf('%04d', $idx + 1000) . '9812',
                    'work_mode' => ($idx % 4 == 0) ? 'Field' : 'Office',
                    'qualification' => ($idx < 5) ? 'Post Graduate' : 'Graduate',
                    'emp_no' => 'EMP-' . sprintf('%04d', $idx + 100),
                    'joining_date' => '2023-0' . (($idx % 9) + 1) . '-01',
                    'designation' => $u['designation'],
                    'emp_type' => $u['role'],
                    'job_type' => 'Permanent',
                    'emp_status' => 'Working',
                    'gross_salary' => $u['salary'],
                    'ctc' => $u['ctc'],
                    'bank_name' => ($idx % 2 == 0) ? 'HDFC Bank' : 'ICICI Bank',
                    'bank_account_number' => '50100' . sprintf('%08d', $idx + 12345),
                    'ifsc_code' => ($idx % 2 == 0) ? 'HDFC0001234' : 'ICIC0005678',
                    'bank_branch' => $u['city'] . ' Main Branch',
                    'bank_city' => $u['city'],
                    'pf' => 12.0,
                    'esi' => ($u['salary'] <= 21000) ? 0.75 : 0.0,
                    'uan_number' => '101234' . sprintf('%06d', $idx + 100),
                    'esi_number' => '319876' . sprintf('%06d', $idx + 100),
                    'pf_employee_percent' => '12',
                    'pf_employer_percent' => '12',
                    'esi_employee_percent' => '0.75',
                    'esi_employer_percent' => '3.25',
                ]
            );
            $employeeModels[] = $employee;
        }

        // Set manager relationships
        // Assign Vikram (mgr_vikram) as manager for Software Engineering, Arun, Sneha, Rohit
        $mgrVikram = $employeeModels[3];
        $mgrAnita = $employeeModels[4];
        $mgrDavid = $employeeModels[5];
        $mgrPriya = $employeeModels[6];
        $mgrSuresh = $employeeModels[7];

        $employeeModels[10]->update(['manager_id' => $mgrVikram->id]); // emp_john
        $employeeModels[11]->update(['manager_id' => $mgrVikram->id]); // emp_emma
        $employeeModels[12]->update(['manager_id' => $mgrVikram->id]); // emp_arun
        $employeeModels[13]->update(['manager_id' => $mgrVikram->id]); // emp_sneha
        $employeeModels[14]->update(['manager_id' => $mgrVikram->id]); // emp_rohit
        $employeeModels[15]->update(['manager_id' => $mgrAnita->id]);  // emp_pooja
        $employeeModels[16]->update(['manager_id' => $mgrDavid->id]);  // emp_manish
        $employeeModels[17]->update(['manager_id' => $mgrDavid->id]);  // emp_divya
        $employeeModels[18]->update(['manager_id' => $mgrPriya->id]);  // emp_raj
        $employeeModels[19]->update(['manager_id' => $mgrPriya->id]);  // emp_meera
        $employeeModels[20]->update(['manager_id' => $mgrSuresh->id]); // emp_alok
        $employeeModels[21]->update(['manager_id' => $mgrSuresh->id]); // emp_tanya

        // ==========================================
        // 9. LEAVE POLICIES (15 records)
        // ==========================================
        foreach ($finYearModels as $fy) {
            Leave::firstOrCreate(
                ['financial_year_id' => $fy->id],
                [
                    'cl_days' => 12.0,
                    'cl_hours' => 96.0,
                    'ei_days' => 15.0,
                    'ei_hours' => 120.0,
                    'lwp_days' => 30.0,
                    'lwp_hours' => 240.0,
                    'medical_leave_in_days' => 10.0,
                    'medical_leave_in_hours' => 80.0,
                    'other_leave_in_days' => 5.0,
                    'other_leave_in_hours' => 40.0,
                ]
            );
        }

        // ==========================================
        // 10. LEAVE CALCULATORS (22 records - for all employees)
        // ==========================================
        foreach ($employeeModels as $idx => $emp) {
            LeaveCalculator::firstOrCreate(
                ['employee_id' => $emp->id],
                [
                    'financial_year_id' => $currentFy->id,
                    'username' => $emp->username,
                    'remaining_cl_days' => max(0, 12 - ($idx % 5)),
                    'remaining_cl_hours' => max(0, (12 - ($idx % 5)) * 8),
                    'remaining_ei_days' => max(0, 15 - ($idx % 4)),
                    'remaining_ei_hours' => max(0, (15 - ($idx % 4)) * 8),
                    'remaining_lwp_days' => 30,
                    'remaining_lwp_hours' => 240,
                    'remaining_medical_leave_in_days' => max(0, 10 - ($idx % 3)),
                    'remaining_medical_leave_in_hours' => max(0, (10 - ($idx % 3)) * 8),
                    'remaining_other_leave_in_days' => 5,
                    'remaining_other_leave_in_hours' => 40,
                ]
            );
        }

        // ==========================================
        // 11. LEAVE TRACKERS & AUDITS (20 records)
        // ==========================================
        $leaveReasons = [
            'Attending family function',
            'Severe viral fever and medical rest',
            'Annual family vacation',
            'Personal urgent administrative work',
            'Dental surgery and recovery',
            'Home shifting and relocation',
            'Sibling wedding ceremony',
            'Medical checkup and consultation',
            'Child school admission and exams',
            'Attending tech conference',
        ];

        $leaveStatuses = ['Approved', 'Pending', 'Rejected', 'Approved', 'Pending'];
        $leaveTypes = ['Casual Leave', 'Medical Leave', 'Earned Leave', 'Leave Without Pay', 'Other Leave'];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $status = $leaveStatuses[$i % count($leaveStatuses)];
            $reason = $leaveReasons[$i % count($leaveReasons)];
            $day = sprintf('%02d', ($i % 25) + 1);

            $lt = LeaveTracker::create([
                'financial_year_id' => $currentFy->id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'cl_days' => ($i % 2 == 0) ? 2.0 : 0.0,
                'cl_hours' => ($i % 2 == 0) ? 16.0 : 0.0,
                'ei_days' => ($i % 3 == 0) ? 3.0 : 0.0,
                'ei_hours' => ($i % 3 == 0) ? 24.0 : 0.0,
                'lwp_days' => 0,
                'lwp_hours' => 0,
                'medical_leave_in_days' => ($i % 4 == 0) ? 2.0 : 0.0,
                'medical_leave_in_hours' => ($i % 4 == 0) ? 16.0 : 0.0,
                'other_leave_in_days' => 0,
                'other_leave_in_hours' => 0,
                'leave_status' => $status,
                'leave_reason' => $reason,
                'leave_from_date' => $day,
                'leave_from_month' => '10',
                'leave_from_year' => '2026',
                'leave_to_date' => sprintf('%02d', ($i % 25) + 3),
                'leave_to_month' => '10',
                'leave_to_year' => '2026',
            ]);

            // Leave Audit
            DB::table('leave_audits')->insert([
                'leave_tracker_id' => $lt->id,
                'actor_user_id' => $userModels[0]->id,
                'action' => ($status === 'Approved') ? 'approve' : (($status === 'Rejected') ? 'reject' : 'apply'),
                'before' => json_encode(['leave_status' => 'Pending']),
                'after' => json_encode(['leave_status' => $status]),
                'created_at' => now()->subDays(20 - $i),
            ]);
        }

        // ==========================================
        // 12. ATTENDANCE RECORDS (25 records)
        // ==========================================
        $attendanceTypes = ['Present', 'Present', 'Work From Home', 'Present', 'Half Day'];
        for ($i = 0; $i < 25; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $dayNum = ($i % 28) + 1;
            $attDate = '2026-10-' . sprintf('%02d', $dayNum);
            $attType = $attendanceTypes[$i % count($attendanceTypes)];

            AttendanceRecord::firstOrCreate(
                [
                    'employee_id' => $emp->id,
                    'attendance_date' => $attDate,
                ],
                [
                    'financial_year_id' => $currentFy->id,
                    'department_id' => $emp->department_id,
                    'username' => $emp->username,
                    'attendance' => $attType,
                    'login_at' => '09:1' . ($i % 9) . ':00',
                    'logout_at' => '18:0' . ($i % 9) . ':00',
                    'log_time' => 8.5,
                    'longitude' => '77.5946',
                    'latitude' => '12.9716',
                    'device' => 'Web Browser (Chrome/Windows)',
                    'ip_address' => '192.168.1.' . (10 + $i),
                    'login_date' => sprintf('%02d', $dayNum),
                    'login_month' => '10',
                    'login_year' => '2026',
                ]
            );
        }

        // ==========================================
        // 13. ASSIGNED JOBS (20 records)
        // ==========================================
        $jobTitles = [
            'Refactor Sanctum API authentication controller',
            'Design Figma mockups for Mobile Dashboard',
            'Setup GitHub Actions CI/CD Pipeline for staging',
            'Conduct quarterly penetration testing and audit',
            'Migrate database tables to support audit trails',
            'Prepare monthly financial compliance reports',
            'Implement dark mode toggle on React front-end',
            'Setup automated Redis cache for leave calculation',
            'Optimize MySQL queries for large payroll generation',
            'Configure AWS S3 bucket policies for document storage',
            'Review candidates for Senior DevOps Engineer role',
            'Draft internal cybersecurity guideline documentation',
            'Resolve customer support escalations for enterprise tier',
            'Deploy Kubernetes Helm charts for microservices',
            'Create interactive charts for HR analytics dashboard',
            'Implement export to Excel/CSV for travel claims',
            'Conduct quarterly employee performance review cycle',
            'Audit all physical IT hardware assets in branch 1',
            'Integrate Razorpay payment gateway for vendor payouts',
            'Create automated backup script with cron triggers',
        ];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            AssignedJob::create([
                'task' => $jobTitles[$i],
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'manager' => 'Vikram Malhotra',
                'task_time' => '4 hours',
                'comment' => 'High priority deliverable for sprint ' . (($i % 4) + 1),
                'submission_date' => '2026-10-' . sprintf('%02d', ($i % 25) + 5),
                'status' => ($i % 3 == 0) ? 'Completed' : (($i % 3 == 1) ? 'In Progress' : 'Pending'),
                'document' => null,
                'description' => 'Detailed task specifications: please review standard coding guidelines before PR.',
            ]);
        }

        // ==========================================
        // 14. DAILY TASKS (20 records)
        // ==========================================
        $dailyTaskSummaries = [
            'Fixed critical bug in attendance login calculation logic',
            'Reviewed 6 pull requests on GitHub for Sprint 12',
            'Attended weekly engineering sprint planning and standup',
            'Created unit tests for payslip deduction calculator',
            'Deployed release v2.4.1 to staging environment',
            'Onboarded 3 new junior software engineering recruits',
            'Conducted financial reconciliation for September bank statement',
            'Organized team building workshop for Marketing department',
            'Configured Cloudflare WAF rules for DDoS prevention',
            'Updated Swagger OpenAPI documentation for auth endpoints',
            'Resolved 14 tickets on Jira support desk',
            'Tested responsive breakpoints across iPad and mobile screens',
            'Optimized Docker image builds reducing size by 40%',
            'Audited employee KYC documents and verified PAN cards',
            'Prepared monthly TDS and GST tax filings draft',
            'Organized all hardware inventory in server room racks',
            'Conducted client onboarding demo call with UK client',
            'Implemented real-time toast notifications for leave approvals',
            'Upgraded npm packages to latest security patches',
            'Benchmarked database query execution times under 500 RPS',
        ];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            DailyTask::create([
                'task' => $dailyTaskSummaries[$i],
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'manager' => 'Vikram Malhotra',
                'submission_date' => '2026-10-' . sprintf('%02d', ($i % 28) + 1),
                'document' => null,
                'description' => 'Completed regular daily duties and reported blockers to team lead.',
            ]);
        }

        // ==========================================
        // 15. LOANS & LOAN CALCULATORS (16 records)
        // ==========================================
        $loanPurposes = [
            'Home renovation and electrical repair',
            'Higher education course fee payment',
            'Emergency medical treatment and surgery',
            'Purchase of two-wheeler vehicle',
            'Relocation and house deposit advance',
            'Personal family emergency',
            'Professional certification course',
            'Purchase of specialized ergonomic furniture',
        ];

        $loanAmounts = [50000, 100000, 150000, 200000, 75000, 120000, 250000, 80000];

        for ($i = 0; $i < 16; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $amount = $loanAmounts[$i % count($loanAmounts)];
            $tenure = ($i % 2 == 0) ? 12 : 24;
            $rate = 7.5;
            $interest = ($amount * $rate * ($tenure / 12)) / 100;
            $totalAmount = $amount + $interest;
            $emi = round($totalAmount / $tenure, 2);

            $loan = Loan::create([
                'financial_year_id' => $currentFy->id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'loan_amount' => $amount,
                'loan_period_in_month' => $tenure,
                'interest_rate' => $rate,
                'status' => ($i % 4 == 0) ? 'Closed' : 'Active',
                'apply_date' => '2026-0' . (($i % 9) + 1) . '-10',
                'purpose' => $loanPurposes[$i % count($loanPurposes)],
            ]);

            LoanCalculator::create([
                'loan_id' => $loan->id,
                'financial_year_id' => $currentFy->id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'total_amount' => $totalAmount,
                'status' => $loan->status,
                'emi' => $emi,
                'remaining_loan_amount' => ($loan->status === 'Closed') ? 0 : round($totalAmount - ($emi * ($i % 6)), 2),
                'remaining_loan_period_in_month' => ($loan->status === 'Closed') ? 0 : max(0, $tenure - ($i % 6)),
            ]);
        }

        // ==========================================
        // 16. PAYSLIPS (20 records)
        // ==========================================
        $months = ['2026-08', '2026-09'];
        $pCount = 0;
        foreach ($months as $m) {
            foreach ($employeeModels as $emp) {
                if ($pCount >= 20) break 2;
                $gross = $emp->gross_salary;
                $basic = round($gross * 0.40, 2);
                $hra = round($gross * 0.20, 2);
                $ta = round($gross * 0.10, 2);
                $sa = round($gross * 0.20, 2);
                $medical = round($gross * 0.05, 2);
                $edu = round($gross * 0.05, 2);
                $pf = round($basic * 0.12, 2);
                $esi = ($gross <= 21000) ? round($gross * 0.0075, 2) : 0;
                $tax = ($gross > 100000) ? round($gross * 0.10, 2) : 0;
                $totalDeductions = $pf + $esi + $tax;
                $netSalary = $gross - $totalDeductions;

                Payslip::firstOrCreate(
                    [
                        'employee_id' => $emp->id,
                        'month_year' => $m,
                    ],
                    [
                        'username' => $emp->username,
                        'department_id' => $emp->department_id,
                        'date' => $m . '-30',
                        'basic' => $basic,
                        'hra' => $hra,
                        'ta' => $ta,
                        'com' => 0,
                        'medical' => $medical,
                        'edu' => $edu,
                        'sa' => $sa,
                        'pf' => $pf,
                        'esi' => $esi,
                        'income_tax' => $tax,
                        'cl_taken' => 0,
                        'ei_taken' => 0,
                        'lwp_taken' => 0,
                        'advance_pay' => 0,
                        'leave_travel_allowance' => 0,
                        'telephone_expense' => 1500,
                        'fuel_and_maint_two_wheeler' => 0,
                        'fuel_and_maint_four_wheeler' => 0,
                        'other_expense' => 0,
                        'paid_days' => 30,
                        'total_days' => 30,
                        'total_earning' => $gross,
                        'total_deduction' => $totalDeductions,
                        'total_reimbursement' => 1500,
                        'net_current_salary' => $netSalary + 1500,
                        'salary_status' => 'Paid',
                        'esi_number' => $emp->esi_number,
                        'uan_number' => $emp->uan_number,
                    ]
                );
                $pCount++;
            }
        }

        // ==========================================
        // 17. ASSET ALLOCATIONS (20 records)
        // ==========================================
        for ($i = 0; $i < 20; $i++) {
            $asset = $assetModels[$i % count($assetModels)];
            $emp = $employeeModels[$i % count($employeeModels)];

            AssetAllocation::create([
                'asset_id' => $asset->id,
                'asset_category' => $asset->asset_category_id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'allocation_date' => '2024-0' . (($i % 9) + 1) . '-15',
                'allocation_upto' => '2026-12-31',
                'return_date' => ($i % 5 == 0) ? '2025-06-30' : null,
                'status' => ($i % 5 == 0) ? 'Returned' : 'In Use',
                'description' => 'Assigned for official work purposes in good working condition.',
            ]);
        }

        // ==========================================
        // 18. TRAVEL EXPENSES (20 records)
        // ==========================================
        $travelData = [
            ['from' => 'Bengaluru', 'to' => 'Hyderabad', 'purpose' => 'Client onsite architecture workshop', 'amount' => 14500, 'type' => 'Flight & Hotel'],
            ['from' => 'Mumbai', 'to' => 'Delhi', 'purpose' => 'Annual Banking Summit keynote', 'amount' => 18200, 'type' => 'Flight & Lodging'],
            ['from' => 'Bengaluru', 'to' => 'Pune', 'purpose' => 'Security audit and server migration', 'amount' => 9500, 'type' => 'Cab & Hotel'],
            ['from' => 'Hyderabad', 'to' => 'Chennai', 'purpose' => 'Vendor negotiation for cloud hardware', 'amount' => 11200, 'type' => 'Train & Food'],
            ['from' => 'Noida', 'to' => 'Jaipur', 'purpose' => 'Logistics branch inspection and review', 'amount' => 6400, 'type' => 'Fuel & Tolls'],
            ['from' => 'Bengaluru', 'to' => 'Kochi', 'purpose' => 'Offshore team setup and training', 'amount' => 13800, 'type' => 'Flight & Hotel'],
            ['from' => 'Mumbai', 'to' => 'Ahmedabad', 'purpose' => 'Quarterly tax compliance meeting', 'amount' => 7800, 'type' => 'Train & Meals'],
            ['from' => 'Pune', 'to' => 'Goa', 'purpose' => 'Design sprint team offsite', 'amount' => 16500, 'type' => 'Flight & Resort'],
            ['from' => 'Bengaluru', 'to' => 'Mumbai', 'purpose' => 'Investor relations and board presentation', 'amount' => 22000, 'type' => 'Flight & Hotel'],
            ['from' => 'Hyderabad', 'to' => 'Bengaluru', 'purpose' => 'Quarterly company townhall', 'amount' => 12500, 'type' => 'Flight & Stay'],
        ];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $t = $travelData[$i % count($travelData)];
            $status = ($i % 3 == 0) ? 'Approved' : (($i % 3 == 1) ? 'Pending' : 'Approved');

            TravelExpense::create([
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'expense_type' => $t['type'],
                'amount' => $t['amount'],
                'currency' => 'INR',
                'description' => 'Travel expense claim for ' . $t['purpose'],
                'expense_date' => '2026-09-' . sprintf('%02d', ($i % 25) + 1),
                'from_location' => $t['from'],
                'to_location' => $t['to'],
                'purpose' => $t['purpose'],
                'receipt_document' => null,
                'status' => $status,
                'approved_by' => ($status === 'Approved') ? $employeeModels[0]->id : null,
                'approval_date' => ($status === 'Approved') ? now()->subDays(10 - ($i % 5)) : null,
                'remarks' => ($status === 'Approved') ? 'Approved as per corporate travel policy limits.' : 'Under review.',
                'username' => $emp->username,
            ]);
        }

        // ==========================================
        // 19. NOTIFICATION DETAILS (15 records)
        // ==========================================
        $announcements = [
            ['title' => 'Diwali Festive Holiday Notice & Celebrations', 'desc' => 'Office will remain closed on 28th-30th October for Diwali celebrations.'],
            ['title' => 'Quarterly Town Hall Meeting - Q3 2026', 'desc' => 'Join the CEO address this Friday at 4 PM in the main auditorium or via Zoom.'],
            ['title' => 'Annual Performance Appraisal Cycle Launch', 'desc' => 'Self-appraisal submissions are now open on the HRMS portal until October 31st.'],
            ['title' => 'Scheduled IT Infrastructure Maintenance', 'desc' => 'Server maintenance scheduled this Sunday from 2 AM to 6 AM IST. Portal might be briefly unavailable.'],
            ['title' => 'New Health Insurance Policy Card Distribution', 'desc' => 'Updated cashless medical insurance cards for 2026-2027 are available for download.'],
            ['title' => 'Work From Home Policy Update', 'desc' => 'Hybrid working guidelines updated: all employees requested to attend office min 3 days weekly.'],
            ['title' => 'Information Security & Phishing Awareness Alert', 'desc' => 'Do not click on unexpected email links or enter OTPs. Report suspicious emails to security@company.com.'],
            ['title' => 'Welcome New Team Members - September Batch', 'desc' => 'Please join us in giving a warm welcome to our 12 new colleagues joining across engineering and product.'],
            ['title' => 'Annual Hackathon 2026 Registration Open', 'desc' => 'Register your 4-member teams for the 48-hour Innovation Hackathon with prizes up to 5 Lakhs INR.'],
            ['title' => 'Updated Travel Expense Claim Guidelines', 'desc' => 'All domestic flight bookings must be submitted at least 7 days in advance for best fares.'],
            ['title' => 'Mental Health & Wellness Counseling Sessions', 'desc' => 'Free confidential counseling sessions available every Wednesday with certified wellness coaches.'],
            ['title' => 'Gym & Fitness Center Reopening in Bengaluru Hub', 'desc' => 'The on-campus fitness facility is fully revamped with new equipment and certified trainers.'],
            ['title' => 'TDS Declaration Submission Window Open', 'desc' => 'Submit your proposed investment proofs under the Old Tax Regime before November 15th.'],
            ['title' => 'Cafeteria Menu Revision & Feedback Poll', 'desc' => 'Vote for your favorite lunch and breakfast cuisines in the employee portal survey.'],
            ['title' => 'Emergency Contact & Nominee Details Update Required', 'desc' => 'Kindly review and update your emergency contact details in the profile edit section.'],
        ];

        foreach ($announcements as $ann) {
            NotificationDetail::firstOrCreate(
                ['title' => $ann['title']],
                [
                    'status' => 'Active',
                    'description' => $ann['desc'],
                ]
            );
        }

        // ==========================================
        // 20. EMPLOYEE DETAILS & ONBOARDING (20 records)
        // ==========================================
        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i];
            $ed = EmployeeDetails::firstOrCreate(
                ['email' => $emp->emp_email],
                [
                    'full_name' => $emp->emp_name,
                    'phone_number' => $emp->emp_phone ?? '98765432' . sprintf('%02d', $i),
                    'gender' => ($emp->gender === 'Female') ? 'Female' : 'Male',
                    'dob' => $emp->dob ?? '1992-05-15',
                    'marital_status' => ($i % 2 == 0) ? 'Married' : 'Single',
                    'nationality' => 'Indian',
                    'address' => $emp->permanent_address ?? (($i + 1) . ', Corporate Park, Tech Zone'),
                    'city' => $emp->city ?? 'Bengaluru',
                    'state' => $emp->state ?? 'Karnataka',
                    'pin_code' => $emp->pincode ?? '560001',
                    'pan_number' => $emp->pan ?? ('ABCDE' . sprintf('%04d', $i + 1) . 'F'),
                    'aadhaar_number' => $emp->aadhaar ?? ('9876' . sprintf('%04d', $i + 1) . '1234'),
                    'employee_number' => $emp->emp_no ?? ('EMP' . sprintf('%03d', $i + 1)),
                    'employment_type' => 'Permanent',
                    'department' => $deptModels[$i % count($deptModels)]->department_name,
                    'designation' => $emp->designation ?? 'Software Engineer',
                    'reporting_manager' => 'Vikram Malhotra',
                    'joining_date' => $emp->joining_date ?? '2023-01-15',
                    'work_mode' => ($emp->work_mode === 'Field') ? 'Hybrid' : 'On-site',
                    'shift_type' => 'Day',
                    'qualification' => $emp->qualification ?? 'Bachelor of Engineering',
                    'specialization' => 'Computer Science / Management',
                    'experience_years' => 3 + ($i % 10),
                ]
            );

            // Account Details
            AccountDetails::firstOrCreate(
                ['employee_details_id' => $ed->id],
                [
                    'email' => $ed->email,
                    'pay_grade' => 'Grade ' . (($i % 15) + 1),
                    'gross_salary' => $emp->gross_salary,
                    'net_salary' => round($emp->gross_salary * 0.82, 2),
                    'ctc' => $emp->ctc,
                    'pf_account_number' => $emp->uan_number ?? ('PF' . sprintf('%08d', $i + 1)),
                    'uan_number' => $emp->uan_number ?? ('1009' . sprintf('%08d', $i + 1)),
                    'esi_number' => $emp->esi_number ?? ('3100' . sprintf('%08d', $i + 1)),
                    'bank_name' => $emp->bank_name ?? 'HDFC Bank',
                    'bank_account_number' => $emp->bank_account_number ?? ('50100' . sprintf('%07d', $i + 1)),
                    'ifsc_code' => $emp->ifsc_code ?? 'HDFC0001234',
                    'branch_name' => $emp->bank_branch ?? 'Indiranagar Branch',
                    'bank_city' => $emp->bank_city ?? 'Bengaluru',
                    'tax_regime' => ($i % 2 == 0) ? 'New' : 'Old',
                ]
            );

            // Reference Details
            ReferenceDetails::firstOrCreate(
                ['employee_details_id' => $ed->id],
                [
                    'email' => $ed->email,
                    'reference_name' => 'Prof. S. R. Murthy',
                    'reference_email' => 'srmurthy@university.edu.in',
                    'phone' => '9845012345',
                    'designation' => 'Dean & Department Head',
                    'company_department' => 'Academic / Previous Employer',
                ]
            );

            // Offboarding Details for inactive/exit testing (sample 5 records)
            if ($i >= 15) {
                OffboardingDetails::firstOrCreate(
                    ['employee_details_id' => $ed->id],
                    [
                        'email' => $ed->email,
                        'resignation_date' => '2026-08-01',
                        'last_working_day' => '2026-09-30',
                        'exit_interview_status' => 'Completed',
                        'reason_for_leaving' => 'Relocating to higher studies abroad',
                        'documents_handover_status' => 'Complete',
                        'clearance_status' => 'Approved',
                        'final_settlement_date' => '2026-10-05',
                        'experience_certificate_issued' => true,
                        'experience_certificate_date' => '2026-10-05',
                        'relieving_letter_issued' => true,
                        'relieving_letter_date' => '2026-10-05',
                    ]
                );
            }
        }
    }
}
