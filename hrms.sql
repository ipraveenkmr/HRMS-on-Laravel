-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.24 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table hrmsdb.alembic_version
DROP TABLE IF EXISTS `alembic_version`;
CREATE TABLE IF NOT EXISTS `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.alembic_version: ~0 rows (approximately)
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.assets
DROP TABLE IF EXISTS `assets`;
CREATE TABLE IF NOT EXISTS `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_category_id` int(11) DEFAULT NULL,
  `asset_name` varchar(99) DEFAULT NULL,
  `manufacturer` varchar(99) DEFAULT NULL,
  `model_number` varchar(99) DEFAULT NULL,
  `serial_number` varchar(99) DEFAULT NULL,
  `support_link` varchar(99) DEFAULT NULL,
  `purchasing_date` varchar(99) DEFAULT NULL,
  `active_service_date` varchar(99) DEFAULT NULL,
  `purchasing_value` varchar(99) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_category_id` (`asset_category_id`),
  KEY `ix_assets_id` (`id`),
  CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`asset_category_id`) REFERENCES `asset_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.assets: ~3 rows (approximately)
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
REPLACE INTO `assets` (`id`, `asset_category_id`, `asset_name`, `manufacturer`, `model_number`, `serial_number`, `support_link`, `purchasing_date`, `active_service_date`, `purchasing_value`, `description`, `created_at`) VALUES
	(1, 2, 'Samsung', 'Voluptates ipsa del', '758', '731', 'Voluptas voluptatum ', '2018-04-21', '2009-03-01', '81', 'Aliquid velit nulla ', '2025-08-09 14:04:34'),
	(2, 1, 'Dell', 'Dolore quas ut nihil', '51', '654', 'Aliquid doloremque n', '1978-03-11', '2020-11-08', '25', 'Sit aliquid quasi u', '2025-08-10 13:00:20'),
	(3, 1, 'Lenevo', 'Numquam velit facili', '125', '602', 'Id culpa nisi venia', '2020-09-03', '2000-12-17', '69', 'Voluptatem corporis', '2025-08-10 13:00:33');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.asset_allocations
DROP TABLE IF EXISTS `asset_allocations`;
CREATE TABLE IF NOT EXISTS `asset_allocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) DEFAULT NULL,
  `asset_category` bigint(20) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `allocation_date` varchar(99) DEFAULT NULL,
  `allocation_upto` varchar(99) DEFAULT NULL,
  `return_date` varchar(99) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_asset_allocations_id` (`id`),
  CONSTRAINT `asset_allocations_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  CONSTRAINT `asset_allocations_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `asset_allocations_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.asset_allocations: ~3 rows (approximately)
/*!40000 ALTER TABLE `asset_allocations` DISABLE KEYS */;
REPLACE INTO `asset_allocations` (`id`, `asset_id`, `asset_category`, `username`, `employee_id`, `department_id`, `allocation_date`, `allocation_upto`, `return_date`, `status`, `description`, `created_at`) VALUES
	(3, 3, 1, 'test', 4, 2, '2025-08-10T12:58:03.557Z', NULL, '2025-08-10T12:58:03.557Z', 'Allocated', NULL, '2025-08-10 12:58:26'),
	(4, 1, 2, 'test', 4, 1, '2025-08-10T13:18:57.940Z', NULL, '2025-08-10T13:18:57.940Z', 'Allocated', NULL, '2025-08-10 13:20:56'),
	(5, 3, 1, 'praveen', 7, 1, '2025-08-24T06:53:26.055Z', NULL, '2025-08-24T06:53:26.055Z', 'Allocated', NULL, '2025-08-24 06:53:43');
/*!40000 ALTER TABLE `asset_allocations` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.asset_categories
DROP TABLE IF EXISTS `asset_categories`;
CREATE TABLE IF NOT EXISTS `asset_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(99) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category` (`category`),
  KEY `ix_asset_categories_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.asset_categories: ~2 rows (approximately)
/*!40000 ALTER TABLE `asset_categories` DISABLE KEYS */;
REPLACE INTO `asset_categories` (`id`, `category`, `description`, `created_at`) VALUES
	(1, 'Laptop', '', '2025-08-09 13:52:47'),
	(2, 'Mobile', '', '2025-08-09 13:53:02');
/*!40000 ALTER TABLE `asset_categories` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.assigned_jobs
DROP TABLE IF EXISTS `assigned_jobs`;
CREATE TABLE IF NOT EXISTS `assigned_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` text,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `manager` varchar(200) DEFAULT NULL,
  `task_time` varchar(99) DEFAULT NULL,
  `comment` varchar(99) DEFAULT NULL,
  `submission_date` varchar(99) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `document` varchar(200) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_assigned_jobs_id` (`id`),
  CONSTRAINT `assigned_jobs_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `assigned_jobs_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.assigned_jobs: ~2 rows (approximately)
/*!40000 ALTER TABLE `assigned_jobs` DISABLE KEYS */;
REPLACE INTO `assigned_jobs` (`id`, `task`, `username`, `employee_id`, `department_id`, `manager`, `task_time`, `comment`, `submission_date`, `status`, `document`, `description`, `created_at`) VALUES
	(1, 'Et labore blanditiis', 'test', 4, 2, 'Cailin Huffman', NULL, NULL, NULL, 'Pending', '', 'Aliqua Consectetur', '2025-08-14 13:05:53'),
	(2, 'Dolore dicta tempor ', 'test', 4, 2, 'Cailin Huffman', NULL, NULL, NULL, 'Completed', '', 'Sunt ratione incidi', '2025-08-14 13:06:38');
/*!40000 ALTER TABLE `assigned_jobs` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_asset
DROP TABLE IF EXISTS `attendance_asset`;
CREATE TABLE IF NOT EXISTS `attendance_asset` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `asset_name` varchar(99) DEFAULT NULL,
  `manufacturer` varchar(99) DEFAULT NULL,
  `model_number` varchar(99) DEFAULT NULL,
  `serial_number` varchar(99) DEFAULT NULL,
  `support_link` varchar(99) DEFAULT NULL,
  `purchasing_date` date DEFAULT NULL,
  `active_service_date` date DEFAULT NULL,
  `purchasing_value` varchar(99) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `asset_category_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_asset_asset_category_id_451e3378_fk_attendanc` (`asset_category_id`),
  CONSTRAINT `attendance_asset_asset_category_id_451e3378_fk_attendanc` FOREIGN KEY (`asset_category_id`) REFERENCES `attendance_assetcategory` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_asset: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_asset` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_asset` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_assetallocation
DROP TABLE IF EXISTS `attendance_assetallocation`;
CREATE TABLE IF NOT EXISTS `attendance_assetallocation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `allocation_date` varchar(99) DEFAULT NULL,
  `allocation_upto` varchar(99) DEFAULT NULL,
  `return_date` varchar(99) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `asset_id` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `asset_category` bigint(20) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_assetallo_asset_id_2fa09092_fk_attendanc` (`asset_id`),
  KEY `attendance_assetallo_department_id_01e27fc5_fk_attendanc` (`department_id`),
  KEY `attendance_assetallo_employee_id_57acfa08_fk_attendanc` (`employee_id`),
  CONSTRAINT `attendance_assetallo_asset_id_2fa09092_fk_attendanc` FOREIGN KEY (`asset_id`) REFERENCES `attendance_asset` (`id`),
  CONSTRAINT `attendance_assetallo_department_id_01e27fc5_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_assetallo_employee_id_57acfa08_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_assetallocation: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_assetallocation` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_assetallocation` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_assetcategory
DROP TABLE IF EXISTS `attendance_assetcategory`;
CREATE TABLE IF NOT EXISTS `attendance_assetcategory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(99) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_assetcategory: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_assetcategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_assetcategory` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_assignedjob
DROP TABLE IF EXISTS `attendance_assignedjob`;
CREATE TABLE IF NOT EXISTS `attendance_assignedjob` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task` varchar(200) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `manager` varchar(200) DEFAULT NULL,
  `task_time` varchar(99) DEFAULT NULL,
  `comment` varchar(99) DEFAULT NULL,
  `submission_date` varchar(99) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `document` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_assignedj_department_id_4bb1072e_fk_attendanc` (`department_id`),
  KEY `attendance_assignedj_employee_id_e9fc8118_fk_attendanc` (`employee_id`),
  CONSTRAINT `attendance_assignedj_department_id_4bb1072e_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_assignedj_employee_id_e9fc8118_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_assignedjob: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_assignedjob` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_assignedjob` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_attendancerecord
DROP TABLE IF EXISTS `attendance_attendancerecord`;
CREATE TABLE IF NOT EXISTS `attendance_attendancerecord` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `attendance_date` varchar(99) NOT NULL,
  `username` varchar(200) DEFAULT NULL,
  `attendance` varchar(99) DEFAULT NULL,
  `login_at` varchar(99) DEFAULT NULL,
  `logout_at` varchar(99) DEFAULT NULL,
  `log_time` double NOT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `ip_address` varchar(99) DEFAULT NULL,
  `login_date` varchar(99) DEFAULT NULL,
  `login_month` varchar(99) DEFAULT NULL,
  `login_year` varchar(99) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `financial_year_id` bigint(20) NOT NULL,
  `device` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_date` (`attendance_date`),
  KEY `attendance_attendanc_department_id_c45274f7_fk_attendanc` (`department_id`),
  KEY `attendance_attendanc_employee_id_e7066fe9_fk_attendanc` (`employee_id`),
  KEY `attendance_attendanc_financial_year_id_f6fdfc23_fk_attendanc` (`financial_year_id`),
  CONSTRAINT `attendance_attendanc_department_id_c45274f7_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_attendanc_employee_id_e7066fe9_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`),
  CONSTRAINT `attendance_attendanc_financial_year_id_f6fdfc23_fk_attendanc` FOREIGN KEY (`financial_year_id`) REFERENCES `attendance_financialyear` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_attendancerecord: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_attendancerecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_attendancerecord` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_branchdetail
DROP TABLE IF EXISTS `attendance_branchdetail`;
CREATE TABLE IF NOT EXISTS `attendance_branchdetail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(99) NOT NULL,
  `branch_address` varchar(199) DEFAULT NULL,
  `longitude` varchar(99) NOT NULL,
  `latitude` varchar(99) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `company_name_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_branchdet_company_name_id_ee2f6922_fk_attendanc` (`company_name_id`),
  CONSTRAINT `attendance_branchdet_company_name_id_ee2f6922_fk_attendanc` FOREIGN KEY (`company_name_id`) REFERENCES `attendance_companydetail` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_branchdetail: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_branchdetail` DISABLE KEYS */;
REPLACE INTO `attendance_branchdetail` (`id`, `branch_name`, `branch_address`, `longitude`, `latitude`, `created_at`, `company_name_id`) VALUES
	(1, 'Main', NULL, '24.9988', '87.5566', '2025-07-24 05:20:17.070218', 1);
/*!40000 ALTER TABLE `attendance_branchdetail` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_companydetail
DROP TABLE IF EXISTS `attendance_companydetail`;
CREATE TABLE IF NOT EXISTS `attendance_companydetail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(99) DEFAULT NULL,
  `company_address` varchar(199) DEFAULT NULL,
  `support_email` varchar(99) DEFAULT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `cloudinary_email` varchar(99) DEFAULT NULL,
  `cloudinary_preset` varchar(99) DEFAULT NULL,
  `cloudinary_api` varchar(99) DEFAULT NULL,
  `status` varchar(99) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_companydetail: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_companydetail` DISABLE KEYS */;
REPLACE INTO `attendance_companydetail` (`id`, `company_name`, `company_address`, `support_email`, `longitude`, `latitude`, `cloudinary_email`, `cloudinary_preset`, `cloudinary_api`, `status`, `created_at`) VALUES
	(1, 'Haion', 'Gujrat', NULL, NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-24 05:19:24.580802');
/*!40000 ALTER TABLE `attendance_companydetail` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_dailytask
DROP TABLE IF EXISTS `attendance_dailytask`;
CREATE TABLE IF NOT EXISTS `attendance_dailytask` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task` varchar(200) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `manager` varchar(200) DEFAULT NULL,
  `submission_date` varchar(99) DEFAULT NULL,
  `document` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_dailytask_department_id_8c182e7b_fk_attendanc` (`department_id`),
  KEY `attendance_dailytask_employee_id_bf25ffca_fk_attendanc` (`employee_id`),
  CONSTRAINT `attendance_dailytask_department_id_8c182e7b_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_dailytask_employee_id_bf25ffca_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_dailytask: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_dailytask` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_dailytask` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_department
DROP TABLE IF EXISTS `attendance_department`;
CREATE TABLE IF NOT EXISTS `attendance_department` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(99) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_name` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_department: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_department` DISABLE KEYS */;
REPLACE INTO `attendance_department` (`id`, `department_name`, `created_at`) VALUES
	(1, 'HR', '2025-07-24 05:20:25.089445');
/*!40000 ALTER TABLE `attendance_department` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_employee
DROP TABLE IF EXISTS `attendance_employee`;
CREATE TABLE IF NOT EXISTS `attendance_employee` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) NOT NULL,
  `emp_name` varchar(200) DEFAULT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `emp_email` varchar(99) DEFAULT NULL,
  `dob` varchar(99) DEFAULT NULL,
  `gender` varchar(99) NOT NULL,
  `father_husband_name` varchar(99) DEFAULT NULL,
  `mothers_name` varchar(99) DEFAULT NULL,
  `permanent_address` varchar(99) DEFAULT NULL,
  `present_address` varchar(99) DEFAULT NULL,
  `city` varchar(99) DEFAULT NULL,
  `state` varchar(99) DEFAULT NULL,
  `pincode` varchar(99) DEFAULT NULL,
  `emp_phone` varchar(99) DEFAULT NULL,
  `emp_emergency_phone` varchar(99) DEFAULT NULL,
  `pan` varchar(99) DEFAULT NULL,
  `aadhaar` varchar(99) DEFAULT NULL,
  `work_mode` varchar(99) NOT NULL,
  `qualification` varchar(99) NOT NULL,
  `board_university` varchar(99) DEFAULT NULL,
  `specialization` varchar(99) DEFAULT NULL,
  `name_of_course` varchar(99) DEFAULT NULL,
  `passing_year` varchar(99) DEFAULT NULL,
  `employer` varchar(99) DEFAULT NULL,
  `job_title` varchar(99) DEFAULT NULL,
  `start_date` varchar(99) DEFAULT NULL,
  `end_date` varchar(99) DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `reference_name` varchar(200) DEFAULT NULL,
  `reference_designation` varchar(200) DEFAULT NULL,
  `reference_department` varchar(200) DEFAULT NULL,
  `reference_contact` varchar(200) DEFAULT NULL,
  `reference_email` varchar(200) DEFAULT NULL,
  `reference_name_if_any` varchar(200) DEFAULT NULL,
  `reference_designation_if_any` varchar(200) DEFAULT NULL,
  `reference_department_if_any` varchar(200) DEFAULT NULL,
  `reference_contact_if_any` varchar(200) DEFAULT NULL,
  `reference_email_if_any` varchar(200) DEFAULT NULL,
  `emp_no` varchar(99) DEFAULT NULL,
  `joining_date` varchar(99) DEFAULT NULL,
  `designation` varchar(99) DEFAULT NULL,
  `emp_type` varchar(99) NOT NULL,
  `job_type` varchar(99) NOT NULL,
  `probation_period_in_month` varchar(99) DEFAULT NULL,
  `pf_account_number_uan` varchar(99) DEFAULT NULL,
  `esi_account_number` varchar(99) DEFAULT NULL,
  `emp_file_no` varchar(99) DEFAULT NULL,
  `emp_status` varchar(99) NOT NULL,
  `emp_joining_date` varchar(99) DEFAULT NULL,
  `emp_resignation_date` varchar(99) DEFAULT NULL,
  `emp_last_working_date` varchar(99) DEFAULT NULL,
  `full_and_final_settlement` varchar(99) DEFAULT NULL,
  `gross_salary` bigint(20) DEFAULT NULL,
  `bank_name` varchar(99) DEFAULT NULL,
  `bank_account_number` varchar(99) DEFAULT NULL,
  `ifsc_code` varchar(99) DEFAULT NULL,
  `bank_branch` varchar(99) DEFAULT NULL,
  `bank_city` varchar(99) DEFAULT NULL,
  `photo` varchar(200) DEFAULT NULL,
  `aadhaar_pic` varchar(200) DEFAULT NULL,
  `pan_pic` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `branch_name_id` bigint(20) NOT NULL,
  `company_name_id` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `pay_grade_id` bigint(20) NOT NULL,
  `esi` decimal(5,2) DEFAULT NULL,
  `pf` decimal(5,2) DEFAULT NULL,
  `isbasicpay` tinyint(1) NOT NULL,
  `esi_number` varchar(200) DEFAULT NULL,
  `uan_number` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `attendance_employee_pay_grade_id_3b4649d1_fk_attendanc` (`pay_grade_id`),
  KEY `attendance_employee_branch_name_id_260bf87c_fk_attendanc` (`branch_name_id`),
  KEY `attendance_employee_company_name_id_e24ee4f2_fk_attendanc` (`company_name_id`),
  KEY `attendance_employee_department_id_2c9437d9_fk_attendanc` (`department_id`),
  CONSTRAINT `attendance_employee_branch_name_id_260bf87c_fk_attendanc` FOREIGN KEY (`branch_name_id`) REFERENCES `attendance_branchdetail` (`id`),
  CONSTRAINT `attendance_employee_company_name_id_e24ee4f2_fk_attendanc` FOREIGN KEY (`company_name_id`) REFERENCES `attendance_companydetail` (`id`),
  CONSTRAINT `attendance_employee_department_id_2c9437d9_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_employee_pay_grade_id_3b4649d1_fk_attendanc` FOREIGN KEY (`pay_grade_id`) REFERENCES `attendance_paygrade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_employee: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_employee` DISABLE KEYS */;
REPLACE INTO `attendance_employee` (`id`, `username`, `emp_name`, `longitude`, `latitude`, `emp_email`, `dob`, `gender`, `father_husband_name`, `mothers_name`, `permanent_address`, `present_address`, `city`, `state`, `pincode`, `emp_phone`, `emp_emergency_phone`, `pan`, `aadhaar`, `work_mode`, `qualification`, `board_university`, `specialization`, `name_of_course`, `passing_year`, `employer`, `job_title`, `start_date`, `end_date`, `comment`, `reference_name`, `reference_designation`, `reference_department`, `reference_contact`, `reference_email`, `reference_name_if_any`, `reference_designation_if_any`, `reference_department_if_any`, `reference_contact_if_any`, `reference_email_if_any`, `emp_no`, `joining_date`, `designation`, `emp_type`, `job_type`, `probation_period_in_month`, `pf_account_number_uan`, `esi_account_number`, `emp_file_no`, `emp_status`, `emp_joining_date`, `emp_resignation_date`, `emp_last_working_date`, `full_and_final_settlement`, `gross_salary`, `bank_name`, `bank_account_number`, `ifsc_code`, `bank_branch`, `bank_city`, `photo`, `aadhaar_pic`, `pan_pic`, `created_at`, `branch_name_id`, `company_name_id`, `department_id`, `pay_grade_id`, `esi`, `pf`, `isbasicpay`, `esi_number`, `uan_number`) VALUES
	(1, 'admin', 'Admin', NULL, NULL, 'admin@haion.co.in', NULL, 'Male', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Field', 'Under Graduate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Admin', 'Pemanent', NULL, NULL, NULL, NULL, 'Working', NULL, NULL, NULL, NULL, 85000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-24 05:22:52.762466', 1, 1, 1, 1, 3.00, 6.00, 0, NULL, NULL);
/*!40000 ALTER TABLE `attendance_employee` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_financialyear
DROP TABLE IF EXISTS `attendance_financialyear`;
CREATE TABLE IF NOT EXISTS `attendance_financialyear` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `year` varchar(99) NOT NULL,
  `working_hours` double NOT NULL,
  `loan_interest_rate` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `login_time` varchar(99) DEFAULT NULL,
  `logout_time` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `year` (`year`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_financialyear: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_financialyear` DISABLE KEYS */;
REPLACE INTO `attendance_financialyear` (`id`, `year`, `working_hours`, `loan_interest_rate`, `created_at`, `login_time`, `logout_time`) VALUES
	(1, '2025', 8.5, 7.5, '2025-07-24 05:20:31.403961', NULL, NULL);
/*!40000 ALTER TABLE `attendance_financialyear` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_leave
DROP TABLE IF EXISTS `attendance_leave`;
CREATE TABLE IF NOT EXISTS `attendance_leave` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `CL_Days` double NOT NULL,
  `CL_Hours` double NOT NULL,
  `EI_Days` double NOT NULL,
  `EI_Hours` double NOT NULL,
  `LWP_Days` double NOT NULL,
  `LWP_Hours` double NOT NULL,
  `medical_leave_in_days` double NOT NULL,
  `medical_leave_in_hours` double NOT NULL,
  `other_leave_in_days` double NOT NULL,
  `other_leave_in_hours` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `financial_year_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `financial_year_id` (`financial_year_id`),
  CONSTRAINT `attendance_leave_financial_year_id_98bedb8e_fk_attendanc` FOREIGN KEY (`financial_year_id`) REFERENCES `attendance_financialyear` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_leave: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_leave` DISABLE KEYS */;
REPLACE INTO `attendance_leave` (`id`, `CL_Days`, `CL_Hours`, `EI_Days`, `EI_Hours`, `LWP_Days`, `LWP_Hours`, `medical_leave_in_days`, `medical_leave_in_hours`, `other_leave_in_days`, `other_leave_in_hours`, `created_at`, `financial_year_id`) VALUES
	(1, 11, 0, 3, 0, 5, 0, 0, 0, 0, 0, '2025-07-24 05:20:49.495779', 1);
/*!40000 ALTER TABLE `attendance_leave` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_leavecalculator
DROP TABLE IF EXISTS `attendance_leavecalculator`;
CREATE TABLE IF NOT EXISTS `attendance_leavecalculator` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `remaining_CL_Days` double NOT NULL,
  `remaining_CL_Hours` double NOT NULL,
  `remaining_EI_Days` double NOT NULL,
  `remaining_EI_Hours` double NOT NULL,
  `remaining_LWP_Days` double NOT NULL,
  `remaining_LWP_Hours` double NOT NULL,
  `remaining_medical_leave_in_days` double NOT NULL,
  `remaining_medical_leave_in_hours` double NOT NULL,
  `remaining_other_leave_in_days` double NOT NULL,
  `remaining_other_leave_in_hours` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `financial_year_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `attendance_leavecalc_employee_id_87750d10_fk_attendanc` (`employee_id`),
  KEY `attendance_leavecalc_financial_year_id_928cd090_fk_attendanc` (`financial_year_id`),
  CONSTRAINT `attendance_leavecalc_employee_id_87750d10_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`),
  CONSTRAINT `attendance_leavecalc_financial_year_id_928cd090_fk_attendanc` FOREIGN KEY (`financial_year_id`) REFERENCES `attendance_financialyear` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_leavecalculator: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_leavecalculator` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_leavecalculator` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_leavetracker
DROP TABLE IF EXISTS `attendance_leavetracker`;
CREATE TABLE IF NOT EXISTS `attendance_leavetracker` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `CL_Days` double NOT NULL,
  `CL_Hours` double NOT NULL,
  `EI_Days` double NOT NULL,
  `EI_Hours` double NOT NULL,
  `LWP_Days` double NOT NULL,
  `LWP_Hours` double NOT NULL,
  `medical_leave_in_days` double NOT NULL,
  `medical_leave_in_hours` double NOT NULL,
  `other_leave_in_days` double NOT NULL,
  `other_leave_in_hours` double NOT NULL,
  `leave_status` varchar(99) DEFAULT NULL,
  `leave_reason` varchar(99) DEFAULT NULL,
  `leave_from_date` varchar(99) DEFAULT NULL,
  `leave_from_month` varchar(99) DEFAULT NULL,
  `leave_from_year` varchar(99) DEFAULT NULL,
  `leave_to_date` varchar(99) DEFAULT NULL,
  `leave_to_month` varchar(99) DEFAULT NULL,
  `leave_to_year` varchar(99) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `financial_year_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_leavetrac_department_id_e25a7013_fk_attendanc` (`department_id`),
  KEY `attendance_leavetrac_employee_id_7eb7d66a_fk_attendanc` (`employee_id`),
  KEY `attendance_leavetrac_financial_year_id_143b38af_fk_attendanc` (`financial_year_id`),
  CONSTRAINT `attendance_leavetrac_department_id_e25a7013_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_leavetrac_employee_id_7eb7d66a_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`),
  CONSTRAINT `attendance_leavetrac_financial_year_id_143b38af_fk_attendanc` FOREIGN KEY (`financial_year_id`) REFERENCES `attendance_financialyear` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_leavetracker: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_leavetracker` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_leavetracker` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_loan
DROP TABLE IF EXISTS `attendance_loan`;
CREATE TABLE IF NOT EXISTS `attendance_loan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `loan_amount` double NOT NULL,
  `loan_period_in_month` double NOT NULL,
  `interest_rate` double NOT NULL,
  `status` varchar(99) DEFAULT NULL,
  `apply_date` varchar(99) DEFAULT NULL,
  `purpose` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `financial_year_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_loan_department_id_4d164969_fk_attendanc` (`department_id`),
  KEY `attendance_loan_employee_id_452ff8b8_fk_attendance_employee_id` (`employee_id`),
  KEY `attendance_loan_financial_year_id_2a80f886_fk_attendanc` (`financial_year_id`),
  CONSTRAINT `attendance_loan_department_id_4d164969_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_loan_employee_id_452ff8b8_fk_attendance_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`),
  CONSTRAINT `attendance_loan_financial_year_id_2a80f886_fk_attendanc` FOREIGN KEY (`financial_year_id`) REFERENCES `attendance_financialyear` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_loan: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_loan` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_loan` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_loancalculator
DROP TABLE IF EXISTS `attendance_loancalculator`;
CREATE TABLE IF NOT EXISTS `attendance_loancalculator` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `total_amount` double NOT NULL,
  `status` varchar(99) DEFAULT NULL,
  `emi` double NOT NULL,
  `remaining_loan_amount` double NOT NULL,
  `remaining_loan_period_in_month` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `financial_year_id` bigint(20) NOT NULL,
  `loan_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `loan_id` (`loan_id`),
  KEY `attendance_loancalcu_department_id_23441d32_fk_attendanc` (`department_id`),
  KEY `attendance_loancalcu_employee_id_c1b15770_fk_attendanc` (`employee_id`),
  KEY `attendance_loancalcu_financial_year_id_7e5728cc_fk_attendanc` (`financial_year_id`),
  CONSTRAINT `attendance_loancalcu_department_id_23441d32_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_loancalcu_employee_id_c1b15770_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`),
  CONSTRAINT `attendance_loancalcu_financial_year_id_7e5728cc_fk_attendanc` FOREIGN KEY (`financial_year_id`) REFERENCES `attendance_financialyear` (`id`),
  CONSTRAINT `attendance_loancalculator_loan_id_eeb30a9f_fk_attendance_loan_id` FOREIGN KEY (`loan_id`) REFERENCES `attendance_loan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_loancalculator: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_loancalculator` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_loancalculator` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_notificationdetail
DROP TABLE IF EXISTS `attendance_notificationdetail`;
CREATE TABLE IF NOT EXISTS `attendance_notificationdetail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `status` varchar(99) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_notificationdetail: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_notificationdetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_notificationdetail` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_paygrade
DROP TABLE IF EXISTS `attendance_paygrade`;
CREATE TABLE IF NOT EXISTS `attendance_paygrade` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `grade` int(11) NOT NULL,
  `min_gross_range` bigint(20) NOT NULL,
  `max_gross_range` bigint(20) NOT NULL,
  `basic` bigint(20) NOT NULL,
  `hra` bigint(20) NOT NULL,
  `ta` bigint(20) NOT NULL,
  `com` bigint(20) NOT NULL,
  `medical` bigint(20) NOT NULL,
  `edu` bigint(20) NOT NULL,
  `sa` bigint(20) NOT NULL,
  `income_tax` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `grade` (`grade`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_paygrade: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_paygrade` DISABLE KEYS */;
REPLACE INTO `attendance_paygrade` (`id`, `grade`, `min_gross_range`, `max_gross_range`, `basic`, `hra`, `ta`, `com`, `medical`, `edu`, `sa`, `income_tax`, `created_at`) VALUES
	(1, 1, 80000, 89000, 6, 0, 0, 0, 0, 0, 0, 0, '2025-07-24 05:21:08.951888');
/*!40000 ALTER TABLE `attendance_paygrade` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_payslip
DROP TABLE IF EXISTS `attendance_payslip`;
CREATE TABLE IF NOT EXISTS `attendance_payslip` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `month_year` varchar(99) NOT NULL,
  `username` varchar(200) DEFAULT NULL,
  `date` varchar(99) DEFAULT NULL,
  `basic` bigint(20) NOT NULL,
  `hra` bigint(20) NOT NULL,
  `ta` bigint(20) NOT NULL,
  `com` bigint(20) NOT NULL,
  `medical` bigint(20) NOT NULL,
  `edu` bigint(20) NOT NULL,
  `sa` bigint(20) NOT NULL,
  `pf` bigint(20) DEFAULT NULL,
  `esi` bigint(20) DEFAULT NULL,
  `income_tax` bigint(20) NOT NULL,
  `cl_taken` bigint(20) NOT NULL,
  `ei_taken` bigint(20) NOT NULL,
  `lwp_taken` bigint(20) NOT NULL,
  `advance_pay` bigint(20) DEFAULT NULL,
  `leave_travel_allowance` bigint(20) DEFAULT NULL,
  `telephone_expense` bigint(20) DEFAULT NULL,
  `fuel_and_maint_two_wheeler` bigint(20) DEFAULT NULL,
  `fuel_and_maint_four_wheeler` bigint(20) DEFAULT NULL,
  `other_expense` bigint(20) DEFAULT NULL,
  `paid_days` int(11) DEFAULT NULL,
  `total_days` int(11) DEFAULT NULL,
  `total_earning` bigint(20) DEFAULT NULL,
  `total_deduction` bigint(20) DEFAULT NULL,
  `total_reimbursement` bigint(20) DEFAULT NULL,
  `net_current_salary` bigint(20) DEFAULT NULL,
  `salary_status` varchar(99) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `esi_number` varchar(200) DEFAULT NULL,
  `uan_number` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `month_year` (`month_year`),
  KEY `attendance_payslip_department_id_3c34e70f_fk_attendanc` (`department_id`),
  KEY `attendance_payslip_employee_id_8ed79a48_fk_attendanc` (`employee_id`),
  CONSTRAINT `attendance_payslip_department_id_3c34e70f_fk_attendanc` FOREIGN KEY (`department_id`) REFERENCES `attendance_department` (`id`),
  CONSTRAINT `attendance_payslip_employee_id_8ed79a48_fk_attendanc` FOREIGN KEY (`employee_id`) REFERENCES `attendance_employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_payslip: ~0 rows (approximately)
/*!40000 ALTER TABLE `attendance_payslip` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_payslip` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.attendance_records
DROP TABLE IF EXISTS `attendance_records`;
CREATE TABLE IF NOT EXISTS `attendance_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `financial_year_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `attendance_date` varchar(99) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `attendance` varchar(99) DEFAULT NULL,
  `login_at` varchar(99) DEFAULT NULL,
  `logout_at` varchar(99) DEFAULT NULL,
  `log_time` float DEFAULT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `device` varchar(99) DEFAULT NULL,
  `ip_address` varchar(99) DEFAULT NULL,
  `login_date` varchar(99) DEFAULT NULL,
  `login_month` varchar(99) DEFAULT NULL,
  `login_year` varchar(99) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_date` (`attendance_date`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_attendance_records_id` (`id`),
  CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `attendance_records_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.attendance_records: ~5 rows (approximately)
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
REPLACE INTO `attendance_records` (`id`, `financial_year_id`, `employee_id`, `department_id`, `attendance_date`, `username`, `attendance`, `login_at`, `logout_at`, `log_time`, `longitude`, `latitude`, `device`, `ip_address`, `login_date`, `login_month`, `login_year`, `created_at`) VALUES
	(1, 1, 4, 2, '2025-08-09-test', 'test', 'Present', '7:02', '19:03', 12.02, NULL, NULL, NULL, NULL, '2025-08-09', '', '', '2025-08-09 12:49:11'),
	(2, 1, 7, 2, '2025-08-25-praveen', 'praveen', 'Present', '7:02', '19:03', 12.02, NULL, NULL, NULL, NULL, '2025-08-25', '', '', '2025-08-25 13:05:46'),
	(3, 1, 7, 2, '2025-08-24-praveen', 'praveen', 'Present', '7:02', '19:03', 12.02, NULL, NULL, NULL, NULL, '2025-08-24', '', '', '2025-08-25 13:06:13'),
	(4, 1, 10, 1, '2025-08-25-priyanka', 'priyanka', 'Present', '7:02', '19:00', 11.97, NULL, NULL, NULL, NULL, '2025-08-25', '', '', '2025-08-25 13:06:53'),
	(5, 1, 10, 1, '2025-08-24-priyanka', 'priyanka', 'Present', '9:02', '18:00', 8.97, NULL, NULL, NULL, NULL, '2025-08-24', '', '', '2025-08-25 13:07:10');
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.auth_group
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.auth_group: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.auth_group_permissions
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.auth_group_permissions: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.auth_permission
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.auth_permission: ~100 rows (approximately)
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
REPLACE INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
	(1, 'Can add log entry', 1, 'add_logentry'),
	(2, 'Can change log entry', 1, 'change_logentry'),
	(3, 'Can delete log entry', 1, 'delete_logentry'),
	(4, 'Can view log entry', 1, 'view_logentry'),
	(5, 'Can add permission', 2, 'add_permission'),
	(6, 'Can change permission', 2, 'change_permission'),
	(7, 'Can delete permission', 2, 'delete_permission'),
	(8, 'Can view permission', 2, 'view_permission'),
	(9, 'Can add group', 3, 'add_group'),
	(10, 'Can change group', 3, 'change_group'),
	(11, 'Can delete group', 3, 'delete_group'),
	(12, 'Can view group', 3, 'view_group'),
	(13, 'Can add user', 4, 'add_user'),
	(14, 'Can change user', 4, 'change_user'),
	(15, 'Can delete user', 4, 'delete_user'),
	(16, 'Can view user', 4, 'view_user'),
	(17, 'Can add content type', 5, 'add_contenttype'),
	(18, 'Can change content type', 5, 'change_contenttype'),
	(19, 'Can delete content type', 5, 'delete_contenttype'),
	(20, 'Can view content type', 5, 'view_contenttype'),
	(21, 'Can add session', 6, 'add_session'),
	(22, 'Can change session', 6, 'change_session'),
	(23, 'Can delete session', 6, 'delete_session'),
	(24, 'Can view session', 6, 'view_session'),
	(25, 'Can add asset', 7, 'add_asset'),
	(26, 'Can change asset', 7, 'change_asset'),
	(27, 'Can delete asset', 7, 'delete_asset'),
	(28, 'Can view asset', 7, 'view_asset'),
	(29, 'Can add asset category', 8, 'add_assetcategory'),
	(30, 'Can change asset category', 8, 'change_assetcategory'),
	(31, 'Can delete asset category', 8, 'delete_assetcategory'),
	(32, 'Can view asset category', 8, 'view_assetcategory'),
	(33, 'Can add branch detail', 9, 'add_branchdetail'),
	(34, 'Can change branch detail', 9, 'change_branchdetail'),
	(35, 'Can delete branch detail', 9, 'delete_branchdetail'),
	(36, 'Can view branch detail', 9, 'view_branchdetail'),
	(37, 'Can add company detail', 10, 'add_companydetail'),
	(38, 'Can change company detail', 10, 'change_companydetail'),
	(39, 'Can delete company detail', 10, 'delete_companydetail'),
	(40, 'Can view company detail', 10, 'view_companydetail'),
	(41, 'Can add department', 11, 'add_department'),
	(42, 'Can change department', 11, 'change_department'),
	(43, 'Can delete department', 11, 'delete_department'),
	(44, 'Can view department', 11, 'view_department'),
	(45, 'Can add employee', 12, 'add_employee'),
	(46, 'Can change employee', 12, 'change_employee'),
	(47, 'Can delete employee', 12, 'delete_employee'),
	(48, 'Can view employee', 12, 'view_employee'),
	(49, 'Can add financial year', 13, 'add_financialyear'),
	(50, 'Can change financial year', 13, 'change_financialyear'),
	(51, 'Can delete financial year', 13, 'delete_financialyear'),
	(52, 'Can view financial year', 13, 'view_financialyear'),
	(53, 'Can add loan', 14, 'add_loan'),
	(54, 'Can change loan', 14, 'change_loan'),
	(55, 'Can delete loan', 14, 'delete_loan'),
	(56, 'Can view loan', 14, 'view_loan'),
	(57, 'Can add pay grade', 15, 'add_paygrade'),
	(58, 'Can change pay grade', 15, 'change_paygrade'),
	(59, 'Can delete pay grade', 15, 'delete_paygrade'),
	(60, 'Can view pay grade', 15, 'view_paygrade'),
	(61, 'Can add payslip', 16, 'add_payslip'),
	(62, 'Can change payslip', 16, 'change_payslip'),
	(63, 'Can delete payslip', 16, 'delete_payslip'),
	(64, 'Can view payslip', 16, 'view_payslip'),
	(65, 'Can add loan calculator', 17, 'add_loancalculator'),
	(66, 'Can change loan calculator', 17, 'change_loancalculator'),
	(67, 'Can delete loan calculator', 17, 'delete_loancalculator'),
	(68, 'Can view loan calculator', 17, 'view_loancalculator'),
	(69, 'Can add leave tracker', 18, 'add_leavetracker'),
	(70, 'Can change leave tracker', 18, 'change_leavetracker'),
	(71, 'Can delete leave tracker', 18, 'delete_leavetracker'),
	(72, 'Can view leave tracker', 18, 'view_leavetracker'),
	(73, 'Can add leave calculator', 19, 'add_leavecalculator'),
	(74, 'Can change leave calculator', 19, 'change_leavecalculator'),
	(75, 'Can delete leave calculator', 19, 'delete_leavecalculator'),
	(76, 'Can view leave calculator', 19, 'view_leavecalculator'),
	(77, 'Can add leave', 20, 'add_leave'),
	(78, 'Can change leave', 20, 'change_leave'),
	(79, 'Can delete leave', 20, 'delete_leave'),
	(80, 'Can view leave', 20, 'view_leave'),
	(81, 'Can add daily task', 21, 'add_dailytask'),
	(82, 'Can change daily task', 21, 'change_dailytask'),
	(83, 'Can delete daily task', 21, 'delete_dailytask'),
	(84, 'Can view daily task', 21, 'view_dailytask'),
	(85, 'Can add attendance record', 22, 'add_attendancerecord'),
	(86, 'Can change attendance record', 22, 'change_attendancerecord'),
	(87, 'Can delete attendance record', 22, 'delete_attendancerecord'),
	(88, 'Can view attendance record', 22, 'view_attendancerecord'),
	(89, 'Can add assigned job', 23, 'add_assignedjob'),
	(90, 'Can change assigned job', 23, 'change_assignedjob'),
	(91, 'Can delete assigned job', 23, 'delete_assignedjob'),
	(92, 'Can view assigned job', 23, 'view_assignedjob'),
	(93, 'Can add asset allocation', 24, 'add_assetallocation'),
	(94, 'Can change asset allocation', 24, 'change_assetallocation'),
	(95, 'Can delete asset allocation', 24, 'delete_assetallocation'),
	(96, 'Can view asset allocation', 24, 'view_assetallocation'),
	(97, 'Can add notification detail', 25, 'add_notificationdetail'),
	(98, 'Can change notification detail', 25, 'change_notificationdetail'),
	(99, 'Can delete notification detail', 25, 'delete_notificationdetail'),
	(100, 'Can view notification detail', 25, 'view_notificationdetail');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.auth_user
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.auth_user: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
REPLACE INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
	(1, 'pbkdf2_sha256$320000$AZEnz776GIa8eJacCB6GAQ$DTUDy3aCMRUd3Hzk2PoWcNrqBb+dNUZZuW/YjMQVfkk=', '2025-07-22 13:53:51.830987', 1, 'admin', '', '', '', 1, 1, '2025-07-22 13:53:30.287809'),
	(2, 'pbkdf2_sha256$320000$LZsua90P4wf8jB5NwmC3F3$7DC3mcDgQ+meo1kkyQVQsehie6hXjL5TJN1IiGikNm0=', NULL, 0, 'test-employee', '', '', '', 0, 1, '2025-07-24 05:18:32.247882');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.auth_user_groups
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.auth_user_groups: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.auth_user_user_permissions
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.auth_user_user_permissions: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.branch_details
DROP TABLE IF EXISTS `branch_details`;
CREATE TABLE IF NOT EXISTS `branch_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name_id` int(11) DEFAULT NULL,
  `branch_name` varchar(99) DEFAULT NULL,
  `branch_address` varchar(199) DEFAULT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_name_id` (`company_name_id`),
  KEY `ix_branch_details_id` (`id`),
  CONSTRAINT `branch_details_ibfk_1` FOREIGN KEY (`company_name_id`) REFERENCES `company_details` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.branch_details: ~0 rows (approximately)
/*!40000 ALTER TABLE `branch_details` DISABLE KEYS */;
REPLACE INTO `branch_details` (`id`, `company_name_id`, `branch_name`, `branch_address`, `longitude`, `latitude`, `created_at`) VALUES
	(1, 1, 'Patna', 'Saguna', '', '', '2025-08-05 09:00:47');
/*!40000 ALTER TABLE `branch_details` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.company_details
DROP TABLE IF EXISTS `company_details`;
CREATE TABLE IF NOT EXISTS `company_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(99) DEFAULT NULL,
  `company_address` varchar(199) DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `support_email` varchar(99) DEFAULT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `cloudinary_email` varchar(99) DEFAULT NULL,
  `cloudinary_preset` varchar(99) DEFAULT NULL,
  `cloudinary_api` varchar(99) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_company_details_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.company_details: ~1 rows (approximately)
/*!40000 ALTER TABLE `company_details` DISABLE KEYS */;
REPLACE INTO `company_details` (`id`, `company_name`, `company_address`, `logo`, `support_email`, `longitude`, `latitude`, `cloudinary_email`, `cloudinary_preset`, `cloudinary_api`, `status`, `created_at`) VALUES
	(1, 'CodingMSTR', 'Patna', '/uploads/09d580d4-f69d-464c-979f-5ad20838d413.png', 'admin@trickuweb.com', '', '', '', '', '', 'Active', '2025-08-05 09:00:21');
/*!40000 ALTER TABLE `company_details` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.company_settings
DROP TABLE IF EXISTS `company_settings`;
CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(200) NOT NULL,
  `company_logo` varchar(500) DEFAULT NULL,
  `company_address` text,
  `company_phone` varchar(50) DEFAULT NULL,
  `company_email` varchar(100) DEFAULT NULL,
  `company_website` varchar(200) DEFAULT NULL,
  `tax_id` varchar(100) DEFAULT NULL,
  `registration_number` varchar(100) DEFAULT NULL,
  `bank_name` varchar(200) DEFAULT NULL,
  `bank_account_number` varchar(100) DEFAULT NULL,
  `bank_ifsc_code` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_company_settings_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.company_settings: ~0 rows (approximately)
/*!40000 ALTER TABLE `company_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_settings` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.daily_tasks
DROP TABLE IF EXISTS `daily_tasks`;
CREATE TABLE IF NOT EXISTS `daily_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` text,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `manager` varchar(200) DEFAULT NULL,
  `submission_date` varchar(99) DEFAULT NULL,
  `document` varchar(200) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_daily_tasks_id` (`id`),
  CONSTRAINT `daily_tasks_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `daily_tasks_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.daily_tasks: ~0 rows (approximately)
/*!40000 ALTER TABLE `daily_tasks` DISABLE KEYS */;
REPLACE INTO `daily_tasks` (`id`, `task`, `username`, `employee_id`, `department_id`, `manager`, `submission_date`, `document`, `description`, `created_at`) VALUES
	(1, 'Create Survey Report', 'test', 4, 2, 'Cailin Huffman', '2025-08-14T12:39:47.342Z', NULL, 'Quod voluptas reicie', '2025-08-14 12:39:55'),
	(2, 'Create Survey Report', 'praveen', 7, 2, 'Admin', '2025-08-19T07:26:25.257Z', NULL, 'Quod voluptas reicie', '2025-08-19 07:26:35');
/*!40000 ALTER TABLE `daily_tasks` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.departments
DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(99) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_name` (`department_name`),
  KEY `ix_departments_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.departments: ~2 rows (approximately)
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
REPLACE INTO `departments` (`id`, `department_name`, `created_at`) VALUES
	(1, 'HR', '2025-08-05 09:13:09'),
	(2, 'IT', '2025-08-05 09:13:13');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.django_admin_log
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.django_admin_log: ~8 rows (approximately)
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
REPLACE INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
	(1, '2025-07-24 05:18:32.519902', '2', 'test-employee', 1, '[{"added": {}}]', 4, 1),
	(2, '2025-07-24 05:19:24.583803', '1', 'Haion', 1, '[{"added": {}}]', 10, 1),
	(3, '2025-07-24 05:20:17.072198', '1', 'Main', 1, '[{"added": {}}]', 9, 1),
	(4, '2025-07-24 05:20:25.090453', '1', 'HR', 1, '[{"added": {}}]', 11, 1),
	(5, '2025-07-24 05:20:31.405359', '1', '2025', 1, '[{"added": {}}]', 13, 1),
	(6, '2025-07-24 05:20:49.495779', '1', '2025', 1, '[{"added": {}}]', 20, 1),
	(7, '2025-07-24 05:21:08.952886', '1', '1', 1, '[{"added": {}}]', 15, 1),
	(8, '2025-07-24 05:22:52.763461', '1', 'Admin', 1, '[{"added": {}}]', 12, 1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.django_content_type
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.django_content_type: ~25 rows (approximately)
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
REPLACE INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
	(1, 'admin', 'logentry'),
	(7, 'attendance', 'asset'),
	(24, 'attendance', 'assetallocation'),
	(8, 'attendance', 'assetcategory'),
	(23, 'attendance', 'assignedjob'),
	(22, 'attendance', 'attendancerecord'),
	(9, 'attendance', 'branchdetail'),
	(10, 'attendance', 'companydetail'),
	(21, 'attendance', 'dailytask'),
	(11, 'attendance', 'department'),
	(12, 'attendance', 'employee'),
	(13, 'attendance', 'financialyear'),
	(20, 'attendance', 'leave'),
	(19, 'attendance', 'leavecalculator'),
	(18, 'attendance', 'leavetracker'),
	(14, 'attendance', 'loan'),
	(17, 'attendance', 'loancalculator'),
	(25, 'attendance', 'notificationdetail'),
	(15, 'attendance', 'paygrade'),
	(16, 'attendance', 'payslip'),
	(3, 'auth', 'group'),
	(2, 'auth', 'permission'),
	(4, 'auth', 'user'),
	(5, 'contenttypes', 'contenttype'),
	(6, 'sessions', 'session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.django_migrations
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.django_migrations: ~32 rows (approximately)
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
REPLACE INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
	(1, 'contenttypes', '0001_initial', '2025-07-22 13:50:41.089622'),
	(2, 'auth', '0001_initial', '2025-07-22 13:50:42.018227'),
	(3, 'admin', '0001_initial', '2025-07-22 13:50:42.225222'),
	(4, 'admin', '0002_logentry_remove_auto_add', '2025-07-22 13:50:42.237443'),
	(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-07-22 13:50:42.251964'),
	(6, 'attendance', '0001_initial', '2025-07-22 13:50:45.789946'),
	(7, 'attendance', '0002_rename_notificationdetails_notificationdetail_and_more', '2025-07-22 13:50:45.842776'),
	(8, 'attendance', '0003_notificationdetail_status', '2025-07-22 13:50:45.913488'),
	(9, 'attendance', '0004_assetallocation_asset_category', '2025-07-22 13:50:46.009585'),
	(10, 'attendance', '0005_alter_assetallocation_asset_category', '2025-07-22 13:50:46.121866'),
	(11, 'attendance', '0006_assetallocation_status', '2025-07-22 13:50:46.204432'),
	(12, 'attendance', '0007_alter_employee_full_and_final_settlement', '2025-07-22 13:50:46.321073'),
	(13, 'attendance', '0008_attendancerecord_device', '2025-07-22 13:50:46.405701'),
	(14, 'attendance', '0009_financialyear_login_time_financialyear_logout_time', '2025-07-22 13:50:46.538188'),
	(15, 'attendance', '0010_remove_paygrade_esi_remove_paygrade_pf', '2025-07-22 13:50:46.666937'),
	(16, 'attendance', '0011_employee_esi_employee_pf', '2025-07-22 13:50:46.843384'),
	(17, 'attendance', '0012_alter_employee_esi_alter_employee_pf', '2025-07-22 13:50:47.049620'),
	(18, 'attendance', '0013_employee_isbasicpay', '2025-07-22 13:50:47.149909'),
	(19, 'attendance', '0014_employee_esi_number_employee_uan_number_and_more', '2025-07-22 13:50:47.466718'),
	(20, 'contenttypes', '0002_remove_content_type_name', '2025-07-22 13:50:47.620264'),
	(21, 'auth', '0002_alter_permission_name_max_length', '2025-07-22 13:50:47.646883'),
	(22, 'auth', '0003_alter_user_email_max_length', '2025-07-22 13:50:47.669116'),
	(23, 'auth', '0004_alter_user_username_opts', '2025-07-22 13:50:47.684115'),
	(24, 'auth', '0005_alter_user_last_login_null', '2025-07-22 13:50:47.762807'),
	(25, 'auth', '0006_require_contenttypes_0002', '2025-07-22 13:50:47.770756'),
	(26, 'auth', '0007_alter_validators_add_error_messages', '2025-07-22 13:50:47.785494'),
	(27, 'auth', '0008_alter_user_username_max_length', '2025-07-22 13:50:47.809987'),
	(28, 'auth', '0009_alter_user_last_name_max_length', '2025-07-22 13:50:47.836097'),
	(29, 'auth', '0010_alter_group_name_max_length', '2025-07-22 13:50:47.856323'),
	(30, 'auth', '0011_update_proxy_permissions', '2025-07-22 13:50:47.883599'),
	(31, 'auth', '0012_alter_user_first_name_max_length', '2025-07-22 13:50:47.906082'),
	(32, 'sessions', '0001_initial', '2025-07-22 13:50:47.974585');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.django_session
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.django_session: ~4 rows (approximately)
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
REPLACE INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
	('7fangor4tpsj89iam4nuqc45mzd0q1p8', 'eyJmaWhvdXIiOjguNX0:1ueoQ8:XI2QuQBENWN88-ar931aaqxHKP8a7rj_1g2yqbv3ANs', '2025-08-07 05:23:08.616710'),
	('ercdfocupnblhtweqj5fno2wqgkbszoj', 'eyJmaWhvdXIiOjguNX0:1ueoQ8:XI2QuQBENWN88-ar931aaqxHKP8a7rj_1g2yqbv3ANs', '2025-08-07 05:23:08.490307'),
	('g8o6itt7spf5rgec9rd1xzgu4w8y5tkv', '.eJxVjEsOAiEQBe_C2hA-bSMu3XsG0kAjowaSYWZlvLtOMgvdvqp6LxFoXWpYB89hyuIstDj8bpHSg9sG8p3arcvU2zJPUW6K3OmQ1575edndv4NKo35rY4kjEaLLBhGsOhZyngG0VVbHWKAQm5NHb9gmSEgegDhhNC4hK_H-AOEeN_k:1ueDRH:ehsyZ2-g1SFUutU47TeN8lXjto17HH6UmNsJ9vAd0yQ', '2025-08-05 13:53:51.835115'),
	('irqisckau3uiion96lip02j5mfhy04af', 'eyJmaWhvdXIiOjguNX0:1ueoQ8:XI2QuQBENWN88-ar931aaqxHKP8a7rj_1g2yqbv3ANs', '2025-08-07 05:23:08.534848'),
	('x6mnij44094wyyuv5v8nljkrrbcbukfz', '.eJxVjEsOAiEQBe_C2hA-bSMu3XsG0kAjowaSYWZlvLtOMgvdvqp6LxFoXWpYB89hyuIstDj8bpHSg9sG8p3arcvU2zJPUW6K3OmQ1575edndv4NKo35rY4kjEaLLBhGsOhZyngG0VVbHWKAQm5NHb9gmSEgegDhhNC4hK_H-AOEeN_k:1ueDRH:ehsyZ2-g1SFUutU47TeN8lXjto17HH6UmNsJ9vAd0yQ', '2025-08-05 13:53:51.697693');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.employees
DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `emp_name` varchar(200) DEFAULT NULL,
  `company_name_id` int(11) DEFAULT NULL,
  `branch_name_id` int(11) DEFAULT NULL,
  `longitude` varchar(99) DEFAULT NULL,
  `latitude` varchar(99) DEFAULT NULL,
  `emp_email` varchar(99) DEFAULT NULL,
  `dob` varchar(99) DEFAULT NULL,
  `gender` varchar(99) DEFAULT NULL,
  `father_husband_name` varchar(99) DEFAULT NULL,
  `mothers_name` varchar(99) DEFAULT NULL,
  `permanent_address` text,
  `present_address` text,
  `city` varchar(99) DEFAULT NULL,
  `state` varchar(99) DEFAULT NULL,
  `pincode` varchar(99) DEFAULT NULL,
  `emp_phone` varchar(99) DEFAULT NULL,
  `emp_emergency_phone` varchar(99) DEFAULT NULL,
  `pan` varchar(99) DEFAULT NULL,
  `aadhaar` varchar(99) DEFAULT NULL,
  `work_mode` varchar(99) DEFAULT NULL,
  `qualification` varchar(99) DEFAULT NULL,
  `board_university` varchar(99) DEFAULT NULL,
  `specialization` varchar(99) DEFAULT NULL,
  `name_of_course` varchar(99) DEFAULT NULL,
  `passing_year` varchar(99) DEFAULT NULL,
  `employer` varchar(99) DEFAULT NULL,
  `job_title` varchar(99) DEFAULT NULL,
  `start_date` varchar(99) DEFAULT NULL,
  `end_date` varchar(99) DEFAULT NULL,
  `comment` text,
  `reference_name` varchar(200) DEFAULT NULL,
  `reference_designation` varchar(200) DEFAULT NULL,
  `reference_department` varchar(200) DEFAULT NULL,
  `reference_contact` varchar(200) DEFAULT NULL,
  `reference_email` varchar(200) DEFAULT NULL,
  `reference_name_if_any` varchar(200) DEFAULT NULL,
  `reference_designation_if_any` varchar(200) DEFAULT NULL,
  `reference_department_if_any` varchar(200) DEFAULT NULL,
  `reference_contact_if_any` varchar(200) DEFAULT NULL,
  `reference_email_if_any` varchar(200) DEFAULT NULL,
  `emp_no` varchar(99) DEFAULT NULL,
  `joining_date` varchar(99) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `designation` varchar(99) DEFAULT NULL,
  `emp_type` varchar(99) DEFAULT NULL,
  `job_type` varchar(99) DEFAULT NULL,
  `probation_period_in_month` varchar(99) DEFAULT NULL,
  `pf_account_number_uan` varchar(99) DEFAULT NULL,
  `esi_account_number` varchar(99) DEFAULT NULL,
  `emp_file_no` varchar(99) DEFAULT NULL,
  `emp_status` varchar(99) DEFAULT NULL,
  `emp_joining_date` varchar(99) DEFAULT NULL,
  `emp_resignation_date` varchar(99) DEFAULT NULL,
  `emp_last_working_date` varchar(99) DEFAULT NULL,
  `full_and_final_settlement` varchar(99) DEFAULT NULL,
  `pay_grade_id` int(11) DEFAULT NULL,
  `gross_salary` bigint(20) DEFAULT NULL,
  `ctc` bigint(20) DEFAULT NULL,
  `income_tax` bigint(20) DEFAULT NULL,
  `bank_name` varchar(99) DEFAULT NULL,
  `bank_account_number` varchar(99) DEFAULT NULL,
  `ifsc_code` varchar(99) DEFAULT NULL,
  `bank_branch` varchar(99) DEFAULT NULL,
  `bank_city` varchar(99) DEFAULT NULL,
  `pf` decimal(5,2) DEFAULT NULL,
  `pf_employee_percent` decimal(5,2) NOT NULL DEFAULT '12.00',
  `pf_employer_percent` decimal(5,2) NOT NULL DEFAULT '12.00',
  `esi` decimal(5,2) DEFAULT NULL,
  `esi_employee_percent` decimal(5,2) NOT NULL DEFAULT '0.75',
  `esi_employer_percent` decimal(5,2) NOT NULL DEFAULT '3.25',
  `photo` varchar(200) DEFAULT NULL,
  `aadhaar_pic` varchar(200) DEFAULT NULL,
  `pan_pic` varchar(200) DEFAULT NULL,
  `isbasicpay` tinyint(1) DEFAULT NULL,
  `esi_number` varchar(200) DEFAULT NULL,
  `uan_number` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `company_name_id` (`company_name_id`),
  KEY `branch_name_id` (`branch_name_id`),
  KEY `department_id` (`department_id`),
  KEY `pay_grade_id` (`pay_grade_id`),
  KEY `ix_employees_id` (`id`),
  KEY `fk_manager` (`manager_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`company_name_id`) REFERENCES `company_details` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`branch_name_id`) REFERENCES `branch_details` (`id`),
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`pay_grade_id`) REFERENCES `pay_grades` (`id`),
  CONSTRAINT `fk_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.employees: ~5 rows (approximately)
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
REPLACE INTO `employees` (`id`, `username`, `emp_name`, `company_name_id`, `branch_name_id`, `longitude`, `latitude`, `emp_email`, `dob`, `gender`, `father_husband_name`, `mothers_name`, `permanent_address`, `present_address`, `city`, `state`, `pincode`, `emp_phone`, `emp_emergency_phone`, `pan`, `aadhaar`, `work_mode`, `qualification`, `board_university`, `specialization`, `name_of_course`, `passing_year`, `employer`, `job_title`, `start_date`, `end_date`, `comment`, `reference_name`, `reference_designation`, `reference_department`, `reference_contact`, `reference_email`, `reference_name_if_any`, `reference_designation_if_any`, `reference_department_if_any`, `reference_contact_if_any`, `reference_email_if_any`, `emp_no`, `joining_date`, `department_id`, `manager_id`, `designation`, `emp_type`, `job_type`, `probation_period_in_month`, `pf_account_number_uan`, `esi_account_number`, `emp_file_no`, `emp_status`, `emp_joining_date`, `emp_resignation_date`, `emp_last_working_date`, `full_and_final_settlement`, `pay_grade_id`, `gross_salary`, `ctc`, `income_tax`, `bank_name`, `bank_account_number`, `ifsc_code`, `bank_branch`, `bank_city`, `pf`, `pf_employee_percent`, `pf_employer_percent`, `esi`, `esi_employee_percent`, `esi_employer_percent`, `photo`, `aadhaar_pic`, `pan_pic`, `isbasicpay`, `esi_number`, `uan_number`, `created_at`) VALUES
	(6, 'admin', 'Admin', 1, 1, '', '', 'admin@admin.com', '1995-09-10', 'Male', '', '', '', '', 'Patna', '', '', '9999999999', NULL, '', '', 'Office', 'Graduate', '', '', '', '', '', 'Graduate', '', '', '', '', '', '', '', '', '', '', '', '', '', 'EMP-001', NULL, 1, NULL, 'Manager', 'Admin', 'Pemanent', '', '', '', '', 'Working', '', '', '', 'Pending', 3, 35000, NULL, NULL, '', '998899778877', '', '', '', 0.00, 12.00, 12.00, 0.00, 0.75, 3.25, '', '', '', 0, NULL, '', '2025-08-18 05:54:18'),
	(7, 'praveen', 'Praveen', 1, 1, '', '', 'praveen@trickuweb.com', '', 'Male', '', '', '', '', '', '', '', '8788998877', '', '', '', 'Office', 'Under Graduate', '', 'Computer Science', NULL, '2015', '', 'Under Graduate', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 2, NULL, 'Developer', 'Employee', 'Permanent', NULL, '', '', '', 'Working', NULL, NULL, NULL, NULL, 6, 100000, 1200000, NULL, '', '', '', NULL, '', 0.00, 12.00, 12.00, 0.00, 0.75, 3.25, '/uploads/profile_e68535c2-a678-4cc2-bb59-9eb2d9fdacc0.jpg', '/uploads/aadhaar_93def681-62d1-460a-9892-335cb3e60f54.jpg', '/uploads/pan_0c84c276-f05b-4d6c-b51d-b91dd22bb57f.jpg', 0, NULL, NULL, '2025-08-18 06:39:50'),
	(8, 'test', 'Catherine Bentley', 1, 1, '', '', 'nozoxa@mailinator.com', '2022-05-02', 'Male', 'Lacey Neal', 'Whoopi Howard', 'Aperiam ipsa est n', 'Quam dolorem volupta', 'Omnis similique cons', 'Incididunt dignissim', 'Beatae commodi sed d', '8588778888', '998899999', 'Officiis sunt non eo', 'Repellendus Iure il', 'Office', 'Graduate', 'Nihil est in recusa', 'Sed ad quisquam temp', 'Sybil Sullivan', '1997', 'Voluptas commodo vol', 'Graduate', '1985-05-30', '2016-12-16', 'Tempora pariatur An', 'Madeline Baker', 'Velit molestiae quam', 'Pariatur Voluptate ', '56', 'hyvuwuxo@mailinator.com', '', '', '', '', '', 'Velit tempore eum d', NULL, 2, NULL, 'Laborum Voluptatibu', 'Employee', 'Pemanent', '', '430', '594', 'Ratione et officiis ', 'Working', '2022-10-06', NULL, '2024-12-18', '', 4, 42000, NULL, NULL, 'Rachel Decker', '31', 'Eaque voluptate quia', 'Qui iste quidem vel ', 'Aperiam et quia mole', 0.00, 12.00, 12.00, 0.00, 0.75, 3.25, '', '', '', 1, NULL, '149', '2025-08-18 06:43:56'),
	(9, 'kumar', 'Kumar', 1, 1, NULL, NULL, 'kumar@trickuweb.com', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '9988667777', NULL, NULL, NULL, 'Office', 'Under Graduate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 1, 10, 'Intern', 'Employee', 'Permanent', NULL, NULL, NULL, NULL, 'Working', NULL, NULL, NULL, NULL, 1, 12000, 180000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12.00, 12.00, NULL, 0.75, 3.25, NULL, NULL, NULL, 0, NULL, NULL, '2025-08-19 10:49:16'),
	(10, 'priyanka', 'Priyanka', 1, 1, NULL, NULL, 'priyanka@trickuweb.com', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '9900997777', NULL, NULL, NULL, 'Office', 'Under Graduate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 1, NULL, 'Designer', 'Manager', 'Permanent', NULL, NULL, NULL, NULL, 'Working', NULL, NULL, NULL, NULL, 5, 75001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12.00, 12.00, NULL, 0.75, 3.25, NULL, NULL, NULL, 0, NULL, NULL, '2025-08-24 04:37:39');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.financial_years
DROP TABLE IF EXISTS `financial_years`;
CREATE TABLE IF NOT EXISTS `financial_years` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(99) DEFAULT NULL,
  `working_hours` float DEFAULT NULL,
  `loan_interest_rate` float DEFAULT NULL,
  `login_time` varchar(99) DEFAULT NULL,
  `logout_time` varchar(99) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `year` (`year`),
  KEY `ix_financial_years_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.financial_years: ~0 rows (approximately)
/*!40000 ALTER TABLE `financial_years` DISABLE KEYS */;
REPLACE INTO `financial_years` (`id`, `year`, `working_hours`, `loan_interest_rate`, `login_time`, `logout_time`, `created_at`) VALUES
	(1, '2025-26', 8.5, 7.5, '', '', '2025-08-09 12:37:19');
/*!40000 ALTER TABLE `financial_years` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.leaves
DROP TABLE IF EXISTS `leaves`;
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `financial_year_id` int(11) DEFAULT NULL,
  `CL_Days` float DEFAULT NULL,
  `CL_Hours` float DEFAULT NULL,
  `EI_Days` float DEFAULT NULL,
  `EI_Hours` float DEFAULT NULL,
  `LWP_Days` float DEFAULT NULL,
  `LWP_Hours` float DEFAULT NULL,
  `medical_leave_in_days` float DEFAULT NULL,
  `medical_leave_in_hours` float DEFAULT NULL,
  `other_leave_in_days` float DEFAULT NULL,
  `other_leave_in_hours` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `ix_leaves_id` (`id`),
  CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.leaves: ~0 rows (approximately)
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.leave_calculators
DROP TABLE IF EXISTS `leave_calculators`;
CREATE TABLE IF NOT EXISTS `leave_calculators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `financial_year_id` int(11) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `remaining_CL_Days` float DEFAULT NULL,
  `remaining_CL_Hours` float DEFAULT NULL,
  `remaining_EI_Days` float DEFAULT NULL,
  `remaining_EI_Hours` float DEFAULT NULL,
  `remaining_LWP_Days` float DEFAULT NULL,
  `remaining_LWP_Hours` float DEFAULT NULL,
  `remaining_medical_leave_in_days` float DEFAULT NULL,
  `remaining_medical_leave_in_hours` float DEFAULT NULL,
  `remaining_other_leave_in_days` float DEFAULT NULL,
  `remaining_other_leave_in_hours` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `employee_id` (`employee_id`),
  KEY `ix_leave_calculators_id` (`id`),
  CONSTRAINT `leave_calculators_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  CONSTRAINT `leave_calculators_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.leave_calculators: ~0 rows (approximately)
/*!40000 ALTER TABLE `leave_calculators` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_calculators` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.leave_trackers
DROP TABLE IF EXISTS `leave_trackers`;
CREATE TABLE IF NOT EXISTS `leave_trackers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `financial_year_id` int(11) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `CL_Days` float DEFAULT NULL,
  `CL_Hours` float DEFAULT NULL,
  `EI_Days` float DEFAULT NULL,
  `EI_Hours` float DEFAULT NULL,
  `LWP_Days` float DEFAULT NULL,
  `LWP_Hours` float DEFAULT NULL,
  `medical_leave_in_days` float DEFAULT NULL,
  `medical_leave_in_hours` float DEFAULT NULL,
  `other_leave_in_days` float DEFAULT NULL,
  `other_leave_in_hours` float DEFAULT NULL,
  `leave_status` varchar(99) DEFAULT NULL,
  `leave_reason` varchar(99) DEFAULT NULL,
  `leave_from_date` varchar(99) DEFAULT NULL,
  `leave_from_month` varchar(99) DEFAULT NULL,
  `leave_from_year` varchar(99) DEFAULT NULL,
  `leave_to_date` varchar(99) DEFAULT NULL,
  `leave_to_month` varchar(99) DEFAULT NULL,
  `leave_to_year` varchar(99) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_leave_trackers_id` (`id`),
  CONSTRAINT `leave_trackers_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  CONSTRAINT `leave_trackers_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `leave_trackers_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.leave_trackers: ~0 rows (approximately)
/*!40000 ALTER TABLE `leave_trackers` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_trackers` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.loans
DROP TABLE IF EXISTS `loans`;
CREATE TABLE IF NOT EXISTS `loans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `financial_year_id` int(11) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `loan_amount` float DEFAULT NULL,
  `loan_period_in_month` float DEFAULT NULL,
  `interest_rate` float DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `apply_date` varchar(99) DEFAULT NULL,
  `purpose` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_loans_id` (`id`),
  CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `loans_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.loans: ~0 rows (approximately)
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.loan_calculators
DROP TABLE IF EXISTS `loan_calculators`;
CREATE TABLE IF NOT EXISTS `loan_calculators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_id` int(11) DEFAULT NULL,
  `financial_year_id` int(11) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `total_amount` float DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `emi` float DEFAULT NULL,
  `remaining_loan_amount` float DEFAULT NULL,
  `remaining_loan_period_in_month` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loan_id` (`loan_id`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_loan_calculators_id` (`id`),
  CONSTRAINT `loan_calculators_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`),
  CONSTRAINT `loan_calculators_ibfk_2` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  CONSTRAINT `loan_calculators_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `loan_calculators_ibfk_4` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.loan_calculators: ~0 rows (approximately)
/*!40000 ALTER TABLE `loan_calculators` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_calculators` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.notification_details
DROP TABLE IF EXISTS `notification_details`;
CREATE TABLE IF NOT EXISTS `notification_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_notification_details_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.notification_details: ~0 rows (approximately)
/*!40000 ALTER TABLE `notification_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_details` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.payslips
DROP TABLE IF EXISTS `payslips`;
CREATE TABLE IF NOT EXISTS `payslips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `month_year` varchar(99) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `date` varchar(99) DEFAULT NULL,
  `basic` bigint(20) DEFAULT NULL,
  `hra` bigint(20) DEFAULT NULL,
  `ta` bigint(20) DEFAULT NULL,
  `com` bigint(20) DEFAULT NULL,
  `medical` bigint(20) DEFAULT NULL,
  `edu` bigint(20) DEFAULT NULL,
  `sa` bigint(20) DEFAULT NULL,
  `pf` bigint(20) DEFAULT NULL,
  `esi` bigint(20) DEFAULT NULL,
  `income_tax` bigint(20) DEFAULT NULL,
  `cl_taken` bigint(20) DEFAULT NULL,
  `ei_taken` bigint(20) DEFAULT NULL,
  `lwp_taken` bigint(20) DEFAULT NULL,
  `advance_pay` bigint(20) DEFAULT NULL,
  `leave_travel_allowance` bigint(20) DEFAULT NULL,
  `telephone_expense` bigint(20) DEFAULT NULL,
  `fuel_and_maint_two_wheeler` bigint(20) DEFAULT NULL,
  `fuel_and_maint_four_wheeler` bigint(20) DEFAULT NULL,
  `other_expense` bigint(20) DEFAULT NULL,
  `paid_days` int(11) DEFAULT NULL,
  `total_days` int(11) DEFAULT NULL,
  `total_earning` bigint(20) DEFAULT NULL,
  `total_deduction` bigint(20) DEFAULT NULL,
  `total_reimbursement` bigint(20) DEFAULT NULL,
  `net_current_salary` bigint(20) DEFAULT NULL,
  `salary_status` varchar(99) DEFAULT NULL,
  `esi_number` varchar(200) DEFAULT NULL,
  `uan_number` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_month_year` (`employee_id`,`month_year`),
  KEY `department_id` (`department_id`),
  KEY `ix_payslips_id` (`id`),
  CONSTRAINT `payslips_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `payslips_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.payslips: ~1 rows (approximately)
/*!40000 ALTER TABLE `payslips` DISABLE KEYS */;
REPLACE INTO `payslips` (`id`, `month_year`, `username`, `employee_id`, `department_id`, `date`, `basic`, `hra`, `ta`, `com`, `medical`, `edu`, `sa`, `pf`, `esi`, `income_tax`, `cl_taken`, `ei_taken`, `lwp_taken`, `advance_pay`, `leave_travel_allowance`, `telephone_expense`, `fuel_and_maint_two_wheeler`, `fuel_and_maint_four_wheeler`, `other_expense`, `paid_days`, `total_days`, `total_earning`, `total_deduction`, `total_reimbursement`, `net_current_salary`, `salary_status`, `esi_number`, `uan_number`, `created_at`) VALUES
	(10, '08_2025', 'praveen', 7, 2, '2025-08-23T13:44:53.328Z', 50000, 20000, 6250, 0, 6250, 2500, 40000, NULL, NULL, 7875, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30, 125000, 13875, 0, 111125, NULL, NULL, 'UA-9000998877', '2025-08-23 13:45:06');
/*!40000 ALTER TABLE `payslips` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.pay_grades
DROP TABLE IF EXISTS `pay_grades`;
CREATE TABLE IF NOT EXISTS `pay_grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade` int(11) DEFAULT NULL,
  `min_gross_range` bigint(20) DEFAULT NULL,
  `max_gross_range` bigint(20) DEFAULT NULL,
  `basic` decimal(5,2) DEFAULT NULL,
  `hra` decimal(5,2) DEFAULT NULL,
  `ta` decimal(5,2) DEFAULT NULL,
  `com` decimal(5,2) DEFAULT NULL,
  `medical` decimal(5,2) DEFAULT NULL,
  `edu` decimal(5,2) DEFAULT NULL,
  `sa` decimal(5,2) DEFAULT NULL,
  `income_tax` decimal(5,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `grade` (`grade`),
  KEY `ix_pay_grades_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.pay_grades: ~6 rows (approximately)
/*!40000 ALTER TABLE `pay_grades` DISABLE KEYS */;
REPLACE INTO `pay_grades` (`id`, `grade`, `min_gross_range`, `max_gross_range`, `basic`, `hra`, `ta`, `com`, `medical`, `edu`, `sa`, `income_tax`, `created_at`) VALUES
	(1, 1, 10000, 20000, 40.00, 16.00, 5.00, 0.00, 5.00, 2.00, 32.00, 0.00, '2025-08-06 11:34:14'),
	(2, 2, 20001, 30000, 40.00, 16.00, 5.00, 0.00, 5.00, 2.00, 32.00, 0.00, '2025-08-18 04:52:40'),
	(3, 3, 30001, 50000, 40.00, 16.00, 5.00, 0.00, 5.00, 2.00, 32.00, 0.00, '2025-08-18 04:53:08'),
	(4, 4, 50001, 75000, 40.00, 16.00, 5.00, 0.00, 5.00, 2.00, 32.00, 0.00, '2025-08-18 04:53:33'),
	(5, 5, 75001, 100000, 40.00, 16.00, 5.00, 0.00, 5.00, 2.00, 32.00, 0.00, '2025-08-18 04:53:48'),
	(6, 6, 100001, 150000, 40.00, 16.00, 5.00, 0.00, 5.00, 2.00, 32.00, 6.30, '2025-08-18 04:54:10');
/*!40000 ALTER TABLE `pay_grades` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.statutory_contributions
DROP TABLE IF EXISTS `statutory_contributions`;
CREATE TABLE IF NOT EXISTS `statutory_contributions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `pf_employee_percent` decimal(5,2) DEFAULT '12.00',
  `pf_employer_percent` decimal(5,2) DEFAULT '12.00',
  `esi_employee_percent` decimal(5,2) DEFAULT '0.75',
  `esi_employer_percent` decimal(5,2) DEFAULT '3.25',
  `effective_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employee` (`employee_id`),
  CONSTRAINT `fk_statutory_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table hrmsdb.statutory_contributions: ~0 rows (approximately)
/*!40000 ALTER TABLE `statutory_contributions` DISABLE KEYS */;
/*!40000 ALTER TABLE `statutory_contributions` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.travel_expenses
DROP TABLE IF EXISTS `travel_expenses`;
CREATE TABLE IF NOT EXISTS `travel_expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `financial_year_id` int(11) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `expense_date` varchar(99) DEFAULT NULL,
  `expense_type` varchar(99) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `description` text,
  `from_location` varchar(200) DEFAULT NULL,
  `to_location` varchar(200) DEFAULT NULL,
  `purpose` text,
  `receipt_document` varchar(200) DEFAULT NULL,
  `status` varchar(99) DEFAULT NULL,
  `approved_by` varchar(200) DEFAULT NULL,
  `approval_date` varchar(99) DEFAULT NULL,
  `remarks` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financial_year_id` (`financial_year_id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `ix_travel_expenses_id` (`id`),
  CONSTRAINT `travel_expenses_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  CONSTRAINT `travel_expenses_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `travel_expenses_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.travel_expenses: ~4 rows (approximately)
/*!40000 ALTER TABLE `travel_expenses` DISABLE KEYS */;
REPLACE INTO `travel_expenses` (`id`, `financial_year_id`, `username`, `employee_id`, `department_id`, `expense_date`, `expense_type`, `amount`, `currency`, `description`, `from_location`, `to_location`, `purpose`, `receipt_document`, `status`, `approved_by`, `approval_date`, `remarks`, `created_at`) VALUES
	(1, 1, 'test', 4, 1, '2025-08-12', 'Fuel', 500, 'INR', '', 'Jaipur', 'Agra', 'Purpose', '', 'Approved', 'test', '2025-08-12', 'Approved', '2025-08-12 11:29:58'),
	(2, 1, 'praveen', 9, 1, 'Invalid Date', 'Fuel', 1800, 'INR', 'Aliquam atque magna ', 'Quas quis consequatu', 'Duis laboris cillum ', 'Sit magni ducimus ', 'Dolorum soluta obcae', 'Pending', '', '', '', '2025-08-24 06:06:44'),
	(3, 1, 'praveen', 9, 1, 'Invalid Date', 'Tolls', 400, 'INR', 'Dolorem culpa volup', 'Nulla culpa molestia', 'Exercitation facere ', 'Modi deserunt est es', 'Non similique mollit', 'Pending', '', '', '', '2025-08-24 06:06:59'),
	(4, 1, 'praveen', 9, 1, 'Invalid Date', 'Local Transport', 27, 'INR', 'In reprehenderit vol', 'Ut ut sint enim fugi', 'Soluta esse cupidat', 'Et illo cupidatat ip', 'Tempore qui quibusd', 'Pending', '', '', '', '2025-08-24 06:08:50'),
	(5, 1, 'praveen', 10, 1, '2025-08-24', 'Client Meeting', 800, 'INR', '', '', '', 'asasd', '', 'Pending', '', '', '', '2025-08-24 06:09:40');
/*!40000 ALTER TABLE `travel_expenses` ENABLE KEYS */;

-- Dumping structure for table hrmsdb.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_username` (`username`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table hrmsdb.users: ~6 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
REPLACE INTO `users` (`id`, `username`, `hashed_password`, `is_active`, `created_at`) VALUES
	(1, 'admin', '$2b$12$QuCMpirSGw19NoFy6AA3Fuw.IoTwmWJumuHjoMHupS/y0h6.wIwuS', 1, '2025-08-03 05:00:47'),
	(2, 'praveen', '$2b$12$Uxd8rJ5dmOSCYVrelDwVb.M5gH4bAm.DaKeEwe3xMuPC9bO9EtJ7.', 1, '2025-08-03 07:34:46'),
	(3, 'test', '$2b$12$6atImmV2fCG5x50Hbjbvo.1jaqao78bUdHTETcBpSlZBXH5bh2xWu', 1, '2025-08-09 11:21:17'),
	(4, 'kumar', '$2b$12$9S0PQ9LfBGWXRXV5Xz5tcuIFevhQSJtyljrfCWlhVtqpowJL2lRHa', 1, '2025-08-19 10:17:14'),
	(5, 'priyanka', '$2b$12$bx.WpccYd8Pu3SqYIDro5OWqtZPUpQZ8l4DyMNom9VBUdL1ZAkuhe', 1, '2025-08-19 10:22:10'),
	(6, 'nitin', '$2b$12$c10SLv0Lt9ZVCpkCG3ckf.9MXRwDKCXqImvSM.s2J3Ueb8eC39Wey', 1, '2025-08-19 10:36:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
