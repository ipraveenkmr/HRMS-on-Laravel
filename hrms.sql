-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hrmsdb
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_details`
--

DROP TABLE IF EXISTS `account_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_details_id` bigint unsigned NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pay_grade` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gross_salary` decimal(15,2) NOT NULL,
  `net_salary` decimal(15,2) DEFAULT NULL,
  `ctc` decimal(15,2) NOT NULL,
  `pf_account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uan_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esi_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_account_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ifsc_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tax_regime` enum('Old','New') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_details_employee_details_id_unique` (`employee_details_id`),
  CONSTRAINT `account_details_employee_details_id_foreign` FOREIGN KEY (`employee_details_id`) REFERENCES `employee_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_details`
--

LOCK TABLES `account_details` WRITE;
/*!40000 ALTER TABLE `account_details` DISABLE KEYS */;
INSERT INTO `account_details` VALUES (1,1,'praveen@trickuweb.com','Grade 1',350000.00,287000.00,4800000.00,'101234000100','101234000100','319876000100','HDFC Bank','5010000012345','HDFC0001234','Bengaluru Main Branch','Bengaluru','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,2,'sarah.jenkins@company.com','Grade 2',280000.00,229600.00,3800000.00,'101234000101','101234000101','319876000101','ICICI Bank','5010000012346','ICIC0005678','Bengaluru Main Branch','Bengaluru','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,3,'rahul.sharma@company.com','Grade 3',270000.00,221400.00,3600000.00,'101234000102','101234000102','319876000102','HDFC Bank','5010000012347','HDFC0001234','Mumbai Main Branch','Mumbai','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,4,'vikram.malhotra@company.com','Grade 4',220000.00,180400.00,3000000.00,'101234000103','101234000103','319876000103','ICICI Bank','5010000012348','ICIC0005678','Bengaluru Main Branch','Bengaluru','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,5,'anita.roy@company.com','Grade 5',160000.00,131200.00,2200000.00,'101234000104','101234000104','319876000104','HDFC Bank','5010000012349','HDFC0001234','Bengaluru Main Branch','Bengaluru','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,6,'david.wilson@company.com','Grade 6',180000.00,147600.00,2500000.00,'101234000105','101234000105','319876000105','ICICI Bank','5010000012350','ICIC0005678','Mumbai Main Branch','Mumbai','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,7,'priya.nair@company.com','Grade 7',155000.00,127100.00,2100000.00,'101234000106','101234000106','319876000106','HDFC Bank','5010000012351','HDFC0001234','Hyderabad Main Branch','Hyderabad','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,8,'suresh.reddy@company.com','Grade 8',140000.00,114800.00,1900000.00,'101234000107','101234000107','319876000107','ICICI Bank','5010000012352','ICIC0005678','Hyderabad Main Branch','Hyderabad','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,9,'karan.kapoor@company.com','Grade 9',115000.00,94300.00,1550000.00,'101234000108','101234000108','319876000108','HDFC Bank','5010000012353','HDFC0001234','Bengaluru Main Branch','Bengaluru','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,10,'neha.gupta@company.com','Grade 10',95000.00,77900.00,1300000.00,'101234000109','101234000109','319876000109','ICICI Bank','5010000012354','ICIC0005678','Mumbai Main Branch','Mumbai','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,11,'john.doe@company.com','Grade 11',125000.00,102500.00,1700000.00,'101234000110','101234000110','319876000110','HDFC Bank','5010000012355','HDFC0001234','Bengaluru Main Branch','Bengaluru','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,12,'emma.watson@company.com','Grade 12',105000.00,86100.00,1400000.00,'101234000111','101234000111','319876000111','ICICI Bank','5010000012356','ICIC0005678','Bengaluru Main Branch','Bengaluru','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,13,'arun.verma@company.com','Grade 13',120000.00,98400.00,1650000.00,'101234000112','101234000112','319876000112','HDFC Bank','5010000012357','HDFC0001234','Bengaluru Main Branch','Bengaluru','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,14,'sneha.patel@company.com','Grade 14',98000.00,80360.00,1350000.00,'101234000113','101234000113','319876000113','ICICI Bank','5010000012358','ICIC0005678','Bengaluru Main Branch','Bengaluru','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,15,'rohit.singh@company.com','Grade 15',110000.00,90200.00,1500000.00,'101234000114','101234000114','319876000114','HDFC Bank','5010000012359','HDFC0001234','Panaji Main Branch','Panaji','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,16,'pooja.mehra@company.com','Grade 1',75000.00,61500.00,1000000.00,'101234000115','101234000115','319876000115','ICICI Bank','5010000012360','ICIC0005678','Bengaluru Main Branch','Bengaluru','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,17,'manish.tiwari@company.com','Grade 2',100000.00,82000.00,1380000.00,'101234000116','101234000116','319876000116','HDFC Bank','5010000012361','HDFC0001234','Mumbai Main Branch','Mumbai','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,18,'divya.iyer@company.com','Grade 3',80000.00,65600.00,1100000.00,'101234000117','101234000117','319876000117','ICICI Bank','5010000012362','ICIC0005678','Mumbai Main Branch','Mumbai','Old','2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,19,'rajesh.khanna@company.com','Grade 4',88000.00,72160.00,1200000.00,'101234000118','101234000118','319876000118','HDFC Bank','5010000012363','HDFC0001234','Hyderabad Main Branch','Hyderabad','New','2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,20,'meera.joshi@company.com','Grade 5',72000.00,59040.00,980000.00,'101234000119','101234000119','319876000119','ICICI Bank','5010000012364','ICIC0005678','Hyderabad Main Branch','Hyderabad','Old','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `account_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_allocations`
--

DROP TABLE IF EXISTS `asset_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_allocations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `asset_category` bigint DEFAULT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `allocation_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allocation_upto` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `return_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_allocations_asset_id_foreign` (`asset_id`),
  KEY `asset_allocations_employee_id_foreign` (`employee_id`),
  KEY `asset_allocations_department_id_foreign` (`department_id`),
  CONSTRAINT `asset_allocations_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_allocations_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_allocations_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_allocations`
--

LOCK TABLES `asset_allocations` WRITE;
/*!40000 ALTER TABLE `asset_allocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_categories`
--

DROP TABLE IF EXISTS `asset_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_categories_category_unique` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_categories`
--

LOCK TABLES `asset_categories` WRITE;
/*!40000 ALTER TABLE `asset_categories` DISABLE KEYS */;
INSERT INTO `asset_categories` VALUES (1,'Laptops & Notebooks',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'Desktop Workstations',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'LED & 4K Monitors',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'Keyboards & Mice',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'Corporate Smartphones',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'Tablets & iPads',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'Network Switches & Hubs',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'Wi-Fi Routers & APs',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'Office Printers & Scanners',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'Conference Projectors',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'Ergonomic Chairs',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'Motorized Standing Desks',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'Rack Servers & Storage',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'Audio & Video Equipment',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'Company Fleet Vehicles',NULL,'2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `asset_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_category_id` bigint unsigned NOT NULL,
  `asset_name` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufacturer` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_number` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `support_link` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchasing_date` date DEFAULT NULL,
  `active_service_date` date DEFAULT NULL,
  `purchasing_value` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assets_asset_category_id_foreign` (`asset_category_id`),
  CONSTRAINT `assets_asset_category_id_foreign` FOREIGN KEY (`asset_category_id`) REFERENCES `asset_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,1,'Apple MacBook Pro 16\" M3 Max','Apple Inc','MBP-16-M3-64G','C02G89X0MD6R','https://support.apple.com','2024-01-15','2024-01-20','320000','64GB RAM, 1TB SSD Space Gray development laptop','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,1,'Apple MacBook Pro 14\" M3 Pro','Apple Inc','MBP-14-M3-36G','C02F71K9MD6P','https://support.apple.com','2024-02-10','2024-02-15','210000','36GB RAM, 512GB SSD Silver laptop for frontend team','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,1,'Dell XPS 15 9530','Dell Technologies','XPS-15-OLED','DLXPS1599823','https://dell.com/support','2024-03-01','2024-03-05','195000','i9 13th Gen, 32GB RAM, 1TB SSD OLED','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,1,'Lenovo ThinkPad X1 Carbon Gen 11','Lenovo','TP-X1-C11','LNTPX1887210','https://lenovo.com/support','2024-03-12','2024-03-15','175000','Executive lightweight ultra-portable laptop','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,2,'Dell Precision 3660 Workstation','Dell Technologies','PREC-3660','DLPR36601149','https://dell.com/support','2023-11-20','2023-11-25','240000','Core i9, 64GB RAM, RTX 4000 GPU ML machine','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,3,'Dell UltraSharp 32\" 4K USB-C Hub Monitor','Dell Technologies','U3223QE','CN0998DL3201','https://dell.com/support','2024-01-10','2024-01-15','78000','4K IPS Black IPS Hub with 90W Power Delivery','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,3,'LG 27\" 4K UHD Ergo Monitor','LG Electronics','27UN880-B','LG27UN880901','https://lg.com/support','2024-01-12','2024-01-16','42000','Ergonomic arm mount monitor for developers','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,4,'Logitech MX Master 3S + MX Keys Combo','Logitech','MX-COMBO-3S','LOGIMX3S9981','https://logitech.com/support','2024-02-01','2024-02-05','18500','Quiet wireless ergonomic keyboard and mouse combo','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,5,'Apple iPhone 15 Pro 256GB','Apple Inc','A3102-IP15P','DNPG1098IP15','https://apple.com/support','2023-10-05','2023-10-10','134000','Natural Titanium QA testing and company phone','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,5,'Samsung Galaxy S24 Ultra 512GB','Samsung','SM-S928B','R5CW1098S24U','https://samsung.com/support','2024-02-15','2024-02-20','139000','Titanium Black executive mobile device','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,6,'Apple iPad Pro 12.9\" M2 Wi-Fi + Cellular','Apple Inc','A2764-IPP12','DLXQ9980IPAD','https://apple.com/support','2023-12-01','2023-12-05','125000','Design & UI/UX wireframing tablet with Apple Pencil 2','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,7,'Cisco Catalyst 24-Port Gigabit Managed Switch','Cisco Systems','C9200L-24P-4G','FOC24099811A','https://cisco.com/support','2023-08-10','2023-08-15','185000','Layer 3 PoE+ Network Switch for Server Room','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,8,'Ubiquiti UniFi Dream Machine Special Edition','Ubiquiti Inc','UDM-SE-PRO','UBQU9980UDM1','https://ui.com/support','2023-09-01','2023-09-05','65000','Enterprise 10G Gateway and Network Controller','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,9,'HP LaserJet Enterprise MFP M528dn','HP Inc','1PV64A-M528','CNB19980HP01','https://hp.com/support','2023-07-20','2023-07-25','95000','High volume office multifunction network printer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,10,'BenQ 4K HDR Conference Projector','BenQ','LK953ST-4K','BQ4K99801122','https://benq.com/support','2023-06-15','2023-06-20','145000','Board room short-throw laser projector','2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,11,'Herman Miller Aeron Chair Fully Loaded','Herman Miller','AERON-SZ-B','HMA998120011','https://hermanmiller.com','2023-05-10','2023-05-15','120000','Ergonomic posture-fit executive task chair','2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,12,'ErgoSmart Dual-Motor Electric Standing Desk','ErgoSmart Tech','ES-DESK-7230','ESD723099811','https://ergosmart.com','2023-05-12','2023-05-15','48000','72x30 inch solid walnut top with memory preset controller','2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,13,'Dell PowerEdge R760 Rack Server','Dell Technologies','PER760-2U','DLPER7609912','https://dell.com/support','2023-04-01','2023-04-10','850000','2x Intel Xeon Gold, 256GB ECC RAM, 8x3.84TB NVMe SSD','2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,14,'Sony WH-1000XM5 Noise Cancelling Headphones','Sony Corporation','WH1000XM5-BLK','SNYXM5998011','https://sony.com/support','2024-01-05','2024-01-08','29990','Premium ANC wireless headset for dev team','2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,15,'Toyota Innova HyCross Fleet Car (KA-01-MG-9988)','Toyota Kirloskar','HYCROSS-ZX','MBJ110998124','https://toyotabharat.com','2023-03-15','2023-03-20','3100000','Hybrid 7-seater corporate executive transport vehicle','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assigned_jobs`
--

DROP TABLE IF EXISTS `assigned_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task` text COLLATE utf8mb4_unicode_ci,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `manager` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_time` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submission_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assigned_jobs_employee_id_foreign` (`employee_id`),
  KEY `assigned_jobs_department_id_foreign` (`department_id`),
  CONSTRAINT `assigned_jobs_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assigned_jobs_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_jobs`
--

LOCK TABLES `assigned_jobs` WRITE;
/*!40000 ALTER TABLE `assigned_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `assigned_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `financial_year_id` bigint unsigned NOT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `attendance_date` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendance` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_at` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logout_at` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `log_time` double NOT NULL DEFAULT '0',
  `longitude` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_month` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_year` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_records_employee_id_attendance_date_unique` (`employee_id`,`attendance_date`),
  KEY `attendance_records_financial_year_id_foreign` (`financial_year_id`),
  KEY `attendance_records_department_id_foreign` (`department_id`),
  KEY `attendance_records_created_at_index` (`created_at`),
  CONSTRAINT `attendance_records_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_records_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_records_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_records`
--

LOCK TABLES `attendance_records` WRITE;
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_details`
--

DROP TABLE IF EXISTS `branch_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_name_id` bigint unsigned NOT NULL,
  `branch_name` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_address` varchar(199) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `branch_details_company_name_id_foreign` (`company_name_id`),
  CONSTRAINT `branch_details_company_name_id_foreign` FOREIGN KEY (`company_name_id`) REFERENCES `company_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_details`
--

LOCK TABLES `branch_details` WRITE;
/*!40000 ALTER TABLE `branch_details` DISABLE KEYS */;
INSERT INTO `branch_details` VALUES (1,1,'Bengaluru Head Office','Outer Ring Road, Bellandur, Bengaluru','77.6744','12.9304','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,1,'Hyderabad Innovation Lab','Mindspace, HITEC City, Hyderabad','78.3800','17.4400','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,1,'Pune R&D Center','Magarpatta City, Hadapsar, Pune','73.9280','18.5158','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,1,'Noida Cyber Hub','Expressway Tower, Sector 125, Noida','77.3300','28.5355','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,2,'Mumbai BKC Main Branch','G-Block, BKC, Bandra East, Mumbai','72.8697','19.0657','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,2,'Chennai Banking Tower','OMR IT Corridor, Thoraipakkam, Chennai','80.2376','12.9348','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,2,'Kolkata Regional Branch','Salt Lake Sector V, Kolkata','88.4312','22.5804','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,2,'Ahmedabad Finance Hub','SG Highway, Bodakdev, Ahmedabad','72.5074','23.0373','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,3,'Delhi NCR Central Warehouse','NH-48, Bilaspur, Gurugram','76.8856','28.3248','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,3,'Jaipur Distribution Hub','Sitapura Industrial Area, Jaipur','75.8341','26.7828','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,3,'Indore Logistics Center','Super Corridor, Indore','75.8118','22.7533','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,4,'Hyderabad Studio','Jubilee Hills, Hyderabad','78.4073','17.4319','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,4,'Goa Creative Studio','Panaji Waterfront, Goa','73.8278','15.4909','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,5,'Pune Security Ops Center','Kharadi IT Park, Pune','73.9472','18.5514','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,5,'Chandigarh Cyber Cell','Rajiv Gandhi Tech Park, Chandigarh','76.8406','30.7262','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `branch_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_details`
--

DROP TABLE IF EXISTS `company_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_address` varchar(199) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `support_email` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(299) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cloudinary_email` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cloudinary_preset` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cloudinary_api` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_details`
--

LOCK TABLES `company_details` WRITE;
/*!40000 ALTER TABLE `company_details` DISABLE KEYS */;
INSERT INTO `company_details` VALUES (1,'TechVanguard Solutions Pvt Ltd','Plot 42, Silicon Valley Park, Bengaluru, Karnataka','support@techvanguard.io','77.5946',NULL,'12.9716',NULL,NULL,NULL,'Active','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'GlobalFin Technologies Ltd','Bandra Kurla Complex, Mumbai, Maharashtra','contact@globalfin.com','72.8697',NULL,'19.0657',NULL,NULL,NULL,'Active','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'Apex Logistics & Supply Chain','Sector 62, Noida, Uttar Pradesh','help@apexlogistics.com','77.3639',NULL,'28.6280',NULL,NULL,NULL,'Active','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'Horizon Digital Media Labs','HITEC City, Hyderabad, Telangana','info@horizonmedia.com','78.3817',NULL,'17.4474',NULL,NULL,NULL,'Active','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'CyberPulse Security Systems','Viman Nagar, Pune, Maharashtra','ops@cyberpulse.com','73.9143',NULL,'18.5679',NULL,NULL,NULL,'Active','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `company_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_tasks`
--

DROP TABLE IF EXISTS `daily_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task` text COLLATE utf8mb4_unicode_ci,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `manager` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submission_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `daily_tasks_department_id_foreign` (`department_id`),
  KEY `daily_tasks_employee_id_submission_date_index` (`employee_id`,`submission_date`),
  CONSTRAINT `daily_tasks_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `daily_tasks_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_tasks`
--

LOCK TABLES `daily_tasks` WRITE;
/*!40000 ALTER TABLE `daily_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `department_name` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_department_name_unique` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Software Engineering','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'DevOps & Cloud Infrastructure','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'Quality Assurance & Testing','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'UI/UX Design','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'Product Management','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'Human Resources','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'Finance & Accounts','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'Marketing & Communications','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'Sales & Business Development','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'Customer Support & Success','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'IT Infrastructure & Operations','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'Legal & Regulatory Compliance','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'Procurement & Facilities','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'Research & Development','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'Business Analytics & Data Science','2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,'Cyber Security & InfoSec','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_details`
--

DROP TABLE IF EXISTS `employee_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('Male','Female','Non-binary','Prefer not to say') COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `marital_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pan_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aadhaar_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reporting_manager` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joining_date` date NOT NULL,
  `work_mode` enum('On-site','Remote','Hybrid') COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualification` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience_years` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_details_email_unique` (`email`),
  UNIQUE KEY `employee_details_pan_number_unique` (`pan_number`),
  UNIQUE KEY `employee_details_employee_number_unique` (`employee_number`),
  UNIQUE KEY `employee_details_aadhaar_number_unique` (`aadhaar_number`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_details`
--

LOCK TABLES `employee_details` WRITE;
/*!40000 ALTER TABLE `employee_details` DISABLE KEYS */;
INSERT INTO `employee_details` VALUES (1,'Praveen Kumar','praveen@trickuweb.com','9876543210','Male','1990-01-15','Married','Indian','House #101, Landmark Street, Bengaluru','Bengaluru','Karnataka','560001','ABCDE1000F','458910009812','EMP-0100','Permanent','Software Engineering','Principal Architect & Super Admin','Vikram Malhotra','2023-01-01','Hybrid','Day','Post Graduate','Computer Science / Management',3,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'Sarah Jenkins','sarah.jenkins@company.com','9876543211','Female','1991-02-15','Single','Indian','House #102, Landmark Street, Bengaluru','Bengaluru','Karnataka','560002','ABCDE1001F','458910019812','EMP-0101','Permanent','DevOps & Cloud Infrastructure','Director of People & Operations','Vikram Malhotra','2023-02-01','On-site','Day','Post Graduate','Computer Science / Management',4,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'Rahul Sharma','rahul.sharma@company.com','9876543212','Male','1992-03-15','Married','Indian','House #103, Landmark Street, Mumbai','Mumbai','Maharashtra','560003','ABCDE1002F','458910029812','EMP-0102','Permanent','Quality Assurance & Testing','Head of Global Operations','Vikram Malhotra','2023-03-01','On-site','Day','Post Graduate','Computer Science / Management',5,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'Vikram Malhotra','vikram.malhotra@company.com','9876543213','Male','1993-04-15','Single','Indian','House #104, Landmark Street, Bengaluru','Bengaluru','Karnataka','560004','ABCDE1003F','458910039812','EMP-0103','Permanent','UI/UX Design','Engineering Manager','Vikram Malhotra','2023-04-01','On-site','Day','Post Graduate','Computer Science / Management',6,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'Anita Roy','anita.roy@company.com','9876543214','Female','1994-05-15','Married','Indian','House #105, Landmark Street, Bengaluru','Bengaluru','Karnataka','560005','ABCDE1004F','458910049812','EMP-0104','Permanent','Product Management','HR Manager - Talent & Culture','Vikram Malhotra','2023-05-01','Hybrid','Day','Post Graduate','Computer Science / Management',7,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'David Wilson','david.wilson@company.com','9876543215','Male','1995-06-15','Single','Indian','House #106, Landmark Street, Mumbai','Mumbai','Maharashtra','560006','ABCDE1005F','458910059812','EMP-0105','Permanent','Human Resources','Finance & Accounts Manager','Vikram Malhotra','2023-06-01','On-site','Day','Graduate','Computer Science / Management',8,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'Priya Nair','priya.nair@company.com','9876543216','Female','1996-07-15','Married','Indian','House #107, Landmark Street, Hyderabad','Hyderabad','Telangana','560007','ABCDE1006F','458910069812','EMP-0106','Permanent','Finance & Accounts','Marketing & Growth Lead','Vikram Malhotra','2023-07-01','On-site','Day','Graduate','Computer Science / Management',9,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'Suresh Reddy','suresh.reddy@company.com','9876543217','Male','1997-08-15','Single','Indian','House #108, Landmark Street, Hyderabad','Hyderabad','Telangana','560008','ABCDE1007F','458910079812','EMP-0107','Permanent','Marketing & Communications','Customer Success Manager','Vikram Malhotra','2023-08-01','On-site','Day','Graduate','Computer Science / Management',10,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'Karan Kapoor','karan.kapoor@company.com','9876543218','Male','1998-09-15','Married','Indian','House #109, Landmark Street, Bengaluru','Bengaluru','Karnataka','560009','ABCDE1008F','458910089812','EMP-0108','Permanent','Sales & Business Development','IT Asset & Hardware Manager','Vikram Malhotra','2023-09-01','Hybrid','Day','Graduate','Computer Science / Management',11,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'Neha Gupta','neha.gupta@company.com','9876543219','Female','1990-01-15','Single','Indian','House #110, Landmark Street, Mumbai','Mumbai','Maharashtra','560010','ABCDE1009F','458910099812','EMP-0109','Permanent','Customer Support & Success','Facilities & Asset Coordinator','Vikram Malhotra','2023-01-01','On-site','Day','Graduate','Computer Science / Management',12,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'John Doe','john.doe@company.com','9876543220','Male','1991-02-15','Married','Indian','House #111, Landmark Street, Bengaluru','Bengaluru','Karnataka','560011','ABCDE1010F','458910109812','EMP-0110','Permanent','IT Infrastructure & Operations','Senior Full Stack Engineer','Vikram Malhotra','2023-02-01','On-site','Day','Graduate','Computer Science / Management',3,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'Emma Watson','emma.watson@company.com','9876543221','Female','1992-03-15','Single','Indian','House #112, Landmark Street, Bengaluru','Bengaluru','Karnataka','560012','ABCDE1011F','458910119812','EMP-0111','Permanent','Legal & Regulatory Compliance','Backend Engineer (Laravel/Go)','Vikram Malhotra','2023-03-01','On-site','Day','Graduate','Computer Science / Management',4,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'Arun Verma','arun.verma@company.com','9876543222','Male','1993-04-15','Married','Indian','House #113, Landmark Street, Bengaluru','Bengaluru','Karnataka','560013','ABCDE1012F','458910129812','EMP-0112','Permanent','Procurement & Facilities','DevOps & SRE Engineer','Vikram Malhotra','2023-04-01','Hybrid','Day','Graduate','Computer Science / Management',5,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'Sneha Patel','sneha.patel@company.com','9876543223','Female','1994-05-15','Single','Indian','House #114, Landmark Street, Bengaluru','Bengaluru','Karnataka','560014','ABCDE1013F','458910139812','EMP-0113','Permanent','Research & Development','QA Automation Lead','Vikram Malhotra','2023-05-01','On-site','Day','Graduate','Computer Science / Management',6,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'Rohit Singh','rohit.singh@company.com','9876543224','Male','1995-06-15','Married','Indian','House #115, Landmark Street, Panaji','Panaji','Goa','560015','ABCDE1014F','458910149812','EMP-0114','Permanent','Business Analytics & Data Science','Senior UI/UX Designer','Vikram Malhotra','2023-06-01','On-site','Day','Graduate','Computer Science / Management',7,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,'Pooja Mehra','pooja.mehra@company.com','9876543225','Female','1996-07-15','Single','Indian','House #116, Landmark Street, Bengaluru','Bengaluru','Karnataka','560016','ABCDE1015F','458910159812','EMP-0115','Permanent','Cyber Security & InfoSec','HR Operations Specialist','Vikram Malhotra','2023-07-01','On-site','Day','Graduate','Computer Science / Management',8,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,'Manish Tiwari','manish.tiwari@company.com','9876543226','Male','1997-08-15','Married','Indian','House #117, Landmark Street, Mumbai','Mumbai','Maharashtra','560017','ABCDE1016F','458910169812','EMP-0116','Permanent','Software Engineering','Senior Financial Analyst','Vikram Malhotra','2023-08-01','Hybrid','Day','Graduate','Computer Science / Management',9,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,'Divya Iyer','divya.iyer@company.com','9876543227','Female','1998-09-15','Single','Indian','House #118, Landmark Street, Mumbai','Mumbai','Maharashtra','560018','ABCDE1017F','458910179812','EMP-0117','Permanent','DevOps & Cloud Infrastructure','Payroll & Tax Executive','Vikram Malhotra','2023-09-01','On-site','Day','Graduate','Computer Science / Management',10,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,'Rajesh Khanna','rajesh.khanna@company.com','9876543228','Male','1990-01-15','Married','Indian','House #119, Landmark Street, Hyderabad','Hyderabad','Telangana','560019','ABCDE1018F','458910189812','EMP-0118','Permanent','Quality Assurance & Testing','Performance Marketing Manager','Vikram Malhotra','2023-01-01','On-site','Day','Graduate','Computer Science / Management',11,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,'Meera Joshi','meera.joshi@company.com','9876543229','Female','1991-02-15','Single','Indian','House #120, Landmark Street, Hyderabad','Hyderabad','Telangana','560020','ABCDE1019F','458910199812','EMP-0119','Permanent','UI/UX Design','Content & Brand Strategist','Vikram Malhotra','2023-02-01','On-site','Day','Graduate','Computer Science / Management',12,'2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `employee_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emp_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name_id` bigint unsigned NOT NULL,
  `branch_name_id` bigint unsigned NOT NULL,
  `longitude` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_email` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Male',
  `father_husband_name` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mothers_name` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_edit` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permanent_address` text COLLATE utf8mb4_unicode_ci,
  `present_address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_phone` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_emergency_phone` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhaar` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_mode` enum('Office','Field') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Office',
  `qualification` enum('Under Graduate','Graduate','Post Graduate') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Under Graduate',
  `board_university` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_of_course` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passing_year` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employer` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `reference_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_designation` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_department` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_contact` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_name_if_any` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_designation_if_any` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_department_if_any` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_contact_if_any` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_email_if_any` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_no` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joining_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department_id` bigint unsigned NOT NULL,
  `designation` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_type` enum('Employee','Manager','Asset Admin','Admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Employee',
  `job_type` enum('Permanent','Contractual') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Permanent',
  `probation_period_in_month` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pf_account_number_uan` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esi_account_number` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_file_no` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_status` enum('Working','Resigned','Notice Period') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Working',
  `emp_joining_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_resignation_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_last_working_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_and_final_settlement` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pay_grade_id` bigint unsigned NOT NULL,
  `gross_salary` bigint DEFAULT NULL,
  `ctc` bigint DEFAULT NULL,
  `bank_name` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_number` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifsc_code` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_branch` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_city` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pf` decimal(5,2) DEFAULT NULL,
  `esi` decimal(5,2) DEFAULT NULL,
  `photo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhaar_pic` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan_pic` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isbasicpay` tinyint(1) NOT NULL DEFAULT '0',
  `esi_number` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uan_number` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_id` bigint unsigned DEFAULT NULL,
  `pf_employee_percent` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pf_employer_percent` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esi_employee_percent` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esi_employer_percent` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employees_username_unique` (`username`),
  KEY `employees_company_name_id_foreign` (`company_name_id`),
  KEY `employees_branch_name_id_foreign` (`branch_name_id`),
  KEY `employees_department_id_foreign` (`department_id`),
  KEY `employees_pay_grade_id_foreign` (`pay_grade_id`),
  KEY `employees_manager_id_foreign` (`manager_id`),
  CONSTRAINT `employees_branch_name_id_foreign` FOREIGN KEY (`branch_name_id`) REFERENCES `branch_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_company_name_id_foreign` FOREIGN KEY (`company_name_id`) REFERENCES `company_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_pay_grade_id_foreign` FOREIGN KEY (`pay_grade_id`) REFERENCES `pay_grades` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'praveen','Praveen Kumar',1,1,NULL,NULL,'praveen@trickuweb.com','1990-01-15','Male',NULL,NULL,NULL,'House #101, Landmark Street, Bengaluru','House #101, Landmark Street, Bengaluru','Bengaluru','Karnataka','560001','9876543210',NULL,'ABCDE1000F','458910009812','Field','Post Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0100','2023-01-01',1,'Principal Architect & Super Admin','Admin','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,15,350000,4800000,'HDFC Bank','5010000012345','HDFC0001234','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000100','101234000100',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'admin_sarah','Sarah Jenkins',1,1,NULL,NULL,'sarah.jenkins@company.com','1991-02-15','Female',NULL,NULL,NULL,'House #102, Landmark Street, Bengaluru','House #102, Landmark Street, Bengaluru','Bengaluru','Karnataka','560002','9876543211',NULL,'ABCDE1001F','458910019812','Office','Post Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0101','2023-02-01',6,'Director of People & Operations','Admin','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,14,280000,3800000,'ICICI Bank','5010000012346','ICIC0005678','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000101','101234000101',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'admin_rahul','Rahul Sharma',2,5,NULL,NULL,'rahul.sharma@company.com','1992-03-15','Male',NULL,NULL,NULL,'House #103, Landmark Street, Mumbai','House #103, Landmark Street, Mumbai','Mumbai','Maharashtra','560003','9876543212',NULL,'ABCDE1002F','458910029812','Office','Post Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0102','2023-03-01',11,'Head of Global Operations','Admin','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,14,270000,3600000,'HDFC Bank','5010000012347','HDFC0001234','Mumbai Main Branch','Mumbai',12.00,0.00,NULL,NULL,NULL,0,'319876000102','101234000102',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'mgr_vikram','Vikram Malhotra',1,1,NULL,NULL,'vikram.malhotra@company.com','1993-04-15','Male',NULL,NULL,NULL,'House #104, Landmark Street, Bengaluru','House #104, Landmark Street, Bengaluru','Bengaluru','Karnataka','560004','9876543213',NULL,'ABCDE1003F','458910039812','Office','Post Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0103','2023-04-01',1,'Engineering Manager','Manager','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,12,220000,3000000,'ICICI Bank','5010000012348','ICIC0005678','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000103','101234000103',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'mgr_anita','Anita Roy',1,1,NULL,NULL,'anita.roy@company.com','1994-05-15','Female',NULL,NULL,NULL,'House #105, Landmark Street, Bengaluru','House #105, Landmark Street, Bengaluru','Bengaluru','Karnataka','560005','9876543214',NULL,'ABCDE1004F','458910049812','Field','Post Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0104','2023-05-01',6,'HR Manager - Talent & Culture','Manager','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,10,160000,2200000,'HDFC Bank','5010000012349','HDFC0001234','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000104','101234000104',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'mgr_david','David Wilson',2,5,NULL,NULL,'david.wilson@company.com','1995-06-15','Male',NULL,NULL,NULL,'House #106, Landmark Street, Mumbai','House #106, Landmark Street, Mumbai','Mumbai','Maharashtra','560006','9876543215',NULL,'ABCDE1005F','458910059812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0105','2023-06-01',7,'Finance & Accounts Manager','Manager','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,11,180000,2500000,'ICICI Bank','5010000012350','ICIC0005678','Mumbai Main Branch','Mumbai',12.00,0.00,NULL,NULL,NULL,0,'319876000105','101234000105',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'mgr_priya','Priya Nair',4,12,NULL,NULL,'priya.nair@company.com','1996-07-15','Female',NULL,NULL,NULL,'House #107, Landmark Street, Hyderabad','House #107, Landmark Street, Hyderabad','Hyderabad','Telangana','560007','9876543216',NULL,'ABCDE1006F','458910069812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0106','2023-07-01',8,'Marketing & Growth Lead','Manager','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,10,155000,2100000,'HDFC Bank','5010000012351','HDFC0001234','Hyderabad Main Branch','Hyderabad',12.00,0.00,NULL,NULL,NULL,0,'319876000106','101234000106',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'mgr_suresh','Suresh Reddy',1,2,NULL,NULL,'suresh.reddy@company.com','1997-08-15','Male',NULL,NULL,NULL,'House #108, Landmark Street, Hyderabad','House #108, Landmark Street, Hyderabad','Hyderabad','Telangana','560008','9876543217',NULL,'ABCDE1007F','458910079812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0107','2023-08-01',10,'Customer Success Manager','Manager','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,9,140000,1900000,'ICICI Bank','5010000012352','ICIC0005678','Hyderabad Main Branch','Hyderabad',12.00,0.00,NULL,NULL,NULL,0,'319876000107','101234000107',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'asset_karan','Karan Kapoor',1,1,NULL,NULL,'karan.kapoor@company.com','1998-09-15','Male',NULL,NULL,NULL,'House #109, Landmark Street, Bengaluru','House #109, Landmark Street, Bengaluru','Bengaluru','Karnataka','560009','9876543218',NULL,'ABCDE1008F','458910089812','Field','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0108','2023-09-01',11,'IT Asset & Hardware Manager','Asset Admin','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,8,115000,1550000,'HDFC Bank','5010000012353','HDFC0001234','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000108','101234000108',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'asset_neha','Neha Gupta',2,5,NULL,NULL,'neha.gupta@company.com','1990-01-15','Female',NULL,NULL,NULL,'House #110, Landmark Street, Mumbai','House #110, Landmark Street, Mumbai','Mumbai','Maharashtra','560010','9876543219',NULL,'ABCDE1009F','458910099812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0109','2023-01-01',13,'Facilities & Asset Coordinator','Asset Admin','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,7,95000,1300000,'ICICI Bank','5010000012354','ICIC0005678','Mumbai Main Branch','Mumbai',12.00,0.00,NULL,NULL,NULL,0,'319876000109','101234000109',NULL,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'emp_john','John Doe',1,1,NULL,NULL,'john.doe@company.com','1991-02-15','Male',NULL,NULL,NULL,'House #111, Landmark Street, Bengaluru','House #111, Landmark Street, Bengaluru','Bengaluru','Karnataka','560011','9876543220',NULL,'ABCDE1010F','458910109812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0110','2023-02-01',1,'Senior Full Stack Engineer','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,8,125000,1700000,'HDFC Bank','5010000012355','HDFC0001234','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000110','101234000110',4,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'emp_emma','Emma Watson',1,1,NULL,NULL,'emma.watson@company.com','1992-03-15','Female',NULL,NULL,NULL,'House #112, Landmark Street, Bengaluru','House #112, Landmark Street, Bengaluru','Bengaluru','Karnataka','560012','9876543221',NULL,'ABCDE1011F','458910119812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0111','2023-03-01',1,'Backend Engineer (Laravel/Go)','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,7,105000,1400000,'ICICI Bank','5010000012356','ICIC0005678','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000111','101234000111',4,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'emp_arun','Arun Verma',1,1,NULL,NULL,'arun.verma@company.com','1993-04-15','Male',NULL,NULL,NULL,'House #113, Landmark Street, Bengaluru','House #113, Landmark Street, Bengaluru','Bengaluru','Karnataka','560013','9876543222',NULL,'ABCDE1012F','458910129812','Field','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0112','2023-04-01',2,'DevOps & SRE Engineer','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,8,120000,1650000,'HDFC Bank','5010000012357','HDFC0001234','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000112','101234000112',4,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'emp_sneha','Sneha Patel',1,1,NULL,NULL,'sneha.patel@company.com','1994-05-15','Female',NULL,NULL,NULL,'House #114, Landmark Street, Bengaluru','House #114, Landmark Street, Bengaluru','Bengaluru','Karnataka','560014','9876543223',NULL,'ABCDE1013F','458910139812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0113','2023-05-01',3,'QA Automation Lead','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,7,98000,1350000,'ICICI Bank','5010000012358','ICIC0005678','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000113','101234000113',4,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'emp_rohit','Rohit Singh',4,13,NULL,NULL,'rohit.singh@company.com','1995-06-15','Male',NULL,NULL,NULL,'House #115, Landmark Street, Panaji','House #115, Landmark Street, Panaji','Panaji','Goa','560015','9876543224',NULL,'ABCDE1014F','458910149812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0114','2023-06-01',4,'Senior UI/UX Designer','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,7,110000,1500000,'HDFC Bank','5010000012359','HDFC0001234','Panaji Main Branch','Panaji',12.00,0.00,NULL,NULL,NULL,0,'319876000114','101234000114',4,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,'emp_pooja','Pooja Mehra',1,1,NULL,NULL,'pooja.mehra@company.com','1996-07-15','Female',NULL,NULL,NULL,'House #116, Landmark Street, Bengaluru','House #116, Landmark Street, Bengaluru','Bengaluru','Karnataka','560016','9876543225',NULL,'ABCDE1015F','458910159812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0115','2023-07-01',6,'HR Operations Specialist','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,5,75000,1000000,'ICICI Bank','5010000012360','ICIC0005678','Bengaluru Main Branch','Bengaluru',12.00,0.00,NULL,NULL,NULL,0,'319876000115','101234000115',5,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,'emp_manish','Manish Tiwari',2,5,NULL,NULL,'manish.tiwari@company.com','1997-08-15','Male',NULL,NULL,NULL,'House #117, Landmark Street, Mumbai','House #117, Landmark Street, Mumbai','Mumbai','Maharashtra','560017','9876543226',NULL,'ABCDE1016F','458910169812','Field','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0116','2023-08-01',7,'Senior Financial Analyst','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,7,100000,1380000,'HDFC Bank','5010000012361','HDFC0001234','Mumbai Main Branch','Mumbai',12.00,0.00,NULL,NULL,NULL,0,'319876000116','101234000116',6,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,'emp_divya','Divya Iyer',2,5,NULL,NULL,'divya.iyer@company.com','1998-09-15','Female',NULL,NULL,NULL,'House #118, Landmark Street, Mumbai','House #118, Landmark Street, Mumbai','Mumbai','Maharashtra','560018','9876543227',NULL,'ABCDE1017F','458910179812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0117','2023-09-01',7,'Payroll & Tax Executive','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,5,80000,1100000,'ICICI Bank','5010000012362','ICIC0005678','Mumbai Main Branch','Mumbai',12.00,0.00,NULL,NULL,NULL,0,'319876000117','101234000117',6,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,'emp_raj','Rajesh Khanna',4,12,NULL,NULL,'rajesh.khanna@company.com','1990-01-15','Male',NULL,NULL,NULL,'House #119, Landmark Street, Hyderabad','House #119, Landmark Street, Hyderabad','Hyderabad','Telangana','560019','9876543228',NULL,'ABCDE1018F','458910189812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0118','2023-01-01',8,'Performance Marketing Manager','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,6,88000,1200000,'HDFC Bank','5010000012363','HDFC0001234','Hyderabad Main Branch','Hyderabad',12.00,0.00,NULL,NULL,NULL,0,'319876000118','101234000118',7,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,'emp_meera','Meera Joshi',4,12,NULL,NULL,'meera.joshi@company.com','1991-02-15','Female',NULL,NULL,NULL,'House #120, Landmark Street, Hyderabad','House #120, Landmark Street, Hyderabad','Hyderabad','Telangana','560020','9876543229',NULL,'ABCDE1019F','458910199812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0119','2023-02-01',8,'Content & Brand Strategist','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,5,72000,980000,'ICICI Bank','5010000012364','ICIC0005678','Hyderabad Main Branch','Hyderabad',12.00,0.00,NULL,NULL,NULL,0,'319876000119','101234000119',7,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(21,'emp_alok','Alok Mishra',1,2,NULL,NULL,'alok.mishra@company.com','1992-03-15','Male',NULL,NULL,NULL,'House #121, Landmark Street, Hyderabad','House #121, Landmark Street, Hyderabad','Hyderabad','Telangana','560021','9876543230',NULL,'ABCDE1020F','458910209812','Field','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0120','2023-03-01',10,'Technical Support Specialist L2','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,4,62000,840000,'HDFC Bank','5010000012365','HDFC0001234','Hyderabad Main Branch','Hyderabad',12.00,0.00,NULL,NULL,NULL,0,'319876000120','101234000120',8,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02'),(22,'emp_tanya','Tanya Sen',1,2,NULL,NULL,'tanya.sen@company.com','1993-04-15','Female',NULL,NULL,NULL,'House #122, Landmark Street, Hyderabad','House #122, Landmark Street, Hyderabad','Hyderabad','Telangana','560022','9876543231',NULL,'ABCDE1021F','458910219812','Office','Graduate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EMP-0121','2023-04-01',10,'Customer Success Specialist','Employee','Permanent',NULL,NULL,NULL,NULL,'Working',NULL,NULL,NULL,NULL,4,58000,790000,'ICICI Bank','5010000012366','ICIC0005678','Hyderabad Main Branch','Hyderabad',12.00,0.00,NULL,NULL,NULL,0,'319876000121','101234000121',8,'12','12','0.75','3.25','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_years`
--

DROP TABLE IF EXISTS `financial_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `year` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `working_hours` double NOT NULL DEFAULT '8.5',
  `loan_interest_rate` double NOT NULL DEFAULT '7.5',
  `login_time` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logout_time` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `financial_years_year_unique` (`year`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_years`
--

LOCK TABLES `financial_years` WRITE;
/*!40000 ALTER TABLE `financial_years` DISABLE KEYS */;
INSERT INTO `financial_years` VALUES (1,'2016-2017',8,8.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'2017-2018',8,8.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'2018-2019',8,8,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'2019-2020',8,7.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'2020-2021',8.5,7,'09:30:00','18:00:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'2021-2022',8.5,7,'09:30:00','18:00:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'2022-2023',8.5,7.25,'09:30:00','18:00:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'2023-2024',8.5,7.5,'09:30:00','18:00:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'2024-2025',8.5,7.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'2025-2026',8.5,7.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'2026-2027',8.5,7,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'2027-2028',8.5,7,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'2028-2029',8.5,6.75,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'2029-2030',8.5,6.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'2030-2031',8.5,6.5,'09:00:00','17:30:00','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `financial_years` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_audits`
--

DROP TABLE IF EXISTS `leave_audits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_audits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `leave_tracker_id` bigint unsigned NOT NULL,
  `actor_user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `before` json DEFAULT NULL,
  `after` json NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leave_audits_actor_user_id_foreign` (`actor_user_id`),
  KEY `leave_audits_leave_tracker_id_created_at_index` (`leave_tracker_id`,`created_at`),
  CONSTRAINT `leave_audits_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `leave_audits_leave_tracker_id_foreign` FOREIGN KEY (`leave_tracker_id`) REFERENCES `leave_trackers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_audits`
--

LOCK TABLES `leave_audits` WRITE;
/*!40000 ALTER TABLE `leave_audits` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_audits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_calculators`
--

DROP TABLE IF EXISTS `leave_calculators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_calculators` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `financial_year_id` bigint unsigned NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `remaining_cl_days` double NOT NULL DEFAULT '0',
  `remaining_cl_hours` double NOT NULL DEFAULT '0',
  `remaining_ei_days` double NOT NULL DEFAULT '0',
  `remaining_ei_hours` double NOT NULL DEFAULT '0',
  `remaining_lwp_days` double NOT NULL DEFAULT '0',
  `remaining_lwp_hours` double NOT NULL DEFAULT '0',
  `remaining_medical_leave_in_days` double NOT NULL DEFAULT '0',
  `remaining_medical_leave_in_hours` double NOT NULL DEFAULT '0',
  `remaining_other_leave_in_days` double NOT NULL DEFAULT '0',
  `remaining_other_leave_in_hours` double NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `leave_calculators_username_unique` (`username`),
  KEY `leave_calculators_financial_year_id_foreign` (`financial_year_id`),
  KEY `leave_calculators_employee_id_foreign` (`employee_id`),
  CONSTRAINT `leave_calculators_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leave_calculators_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_calculators`
--

LOCK TABLES `leave_calculators` WRITE;
/*!40000 ALTER TABLE `leave_calculators` DISABLE KEYS */;
INSERT INTO `leave_calculators` VALUES (1,10,'praveen',1,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,10,'admin_sarah',2,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,10,'admin_rahul',3,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,10,'mgr_vikram',4,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,10,'mgr_anita',5,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,10,'mgr_david',6,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,10,'mgr_priya',7,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,10,'mgr_suresh',8,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,10,'asset_karan',9,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,10,'asset_neha',10,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,10,'emp_john',11,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,10,'emp_emma',12,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,10,'emp_arun',13,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,10,'emp_sneha',14,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,10,'emp_rohit',15,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,10,'emp_pooja',16,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,10,'emp_manish',17,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,10,'emp_divya',18,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,10,'emp_raj',19,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,10,'emp_meera',20,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(21,10,'emp_alok',21,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(22,10,'emp_tanya',22,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `leave_calculators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_trackers`
--

DROP TABLE IF EXISTS `leave_trackers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_trackers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `financial_year_id` bigint unsigned NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `cl_days` double NOT NULL DEFAULT '0',
  `cl_hours` double NOT NULL DEFAULT '0',
  `ei_days` double NOT NULL DEFAULT '0',
  `ei_hours` double NOT NULL DEFAULT '0',
  `lwp_days` double NOT NULL DEFAULT '0',
  `lwp_hours` double NOT NULL DEFAULT '0',
  `medical_leave_in_days` double NOT NULL DEFAULT '0',
  `medical_leave_in_hours` double NOT NULL DEFAULT '0',
  `other_leave_in_days` double NOT NULL DEFAULT '0',
  `other_leave_in_hours` double NOT NULL DEFAULT '0',
  `leave_status` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `leave_reason` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_from_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_from_month` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_from_year` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_to_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_to_month` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_to_year` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `leave_type` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leave_trackers_financial_year_id_foreign` (`financial_year_id`),
  KEY `leave_trackers_department_id_foreign` (`department_id`),
  KEY `leave_trackers_employee_id_leave_status_index` (`employee_id`,`leave_status`),
  CONSTRAINT `leave_trackers_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leave_trackers_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leave_trackers_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_trackers`
--

LOCK TABLES `leave_trackers` WRITE;
/*!40000 ALTER TABLE `leave_trackers` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_trackers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaves` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `financial_year_id` bigint unsigned NOT NULL,
  `cl_days` double NOT NULL DEFAULT '0',
  `cl_hours` double NOT NULL DEFAULT '0',
  `ei_days` double NOT NULL DEFAULT '0',
  `ei_hours` double NOT NULL DEFAULT '0',
  `lwp_days` double NOT NULL DEFAULT '0',
  `lwp_hours` double NOT NULL DEFAULT '0',
  `medical_leave_in_days` double NOT NULL DEFAULT '0',
  `medical_leave_in_hours` double NOT NULL DEFAULT '0',
  `other_leave_in_days` double NOT NULL DEFAULT '0',
  `other_leave_in_hours` double NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leaves_financial_year_id_foreign` (`financial_year_id`),
  CONSTRAINT `leaves_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaves`
--

LOCK TABLES `leaves` WRITE;
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
INSERT INTO `leaves` VALUES (1,1,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,2,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,3,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,4,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,5,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,6,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,7,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,8,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,9,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,10,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,11,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,12,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,13,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,14,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,15,12,96,15,120,30,240,10,80,5,40,'2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_calculators`
--

DROP TABLE IF EXISTS `loan_calculators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_calculators` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `loan_id` bigint unsigned NOT NULL,
  `financial_year_id` bigint unsigned NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `total_amount` double NOT NULL DEFAULT '0',
  `status` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `emi` double NOT NULL DEFAULT '0',
  `remaining_loan_amount` double NOT NULL DEFAULT '0',
  `remaining_loan_period_in_month` double NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loan_calculators_loan_id_foreign` (`loan_id`),
  KEY `loan_calculators_financial_year_id_foreign` (`financial_year_id`),
  KEY `loan_calculators_employee_id_foreign` (`employee_id`),
  KEY `loan_calculators_department_id_foreign` (`department_id`),
  CONSTRAINT `loan_calculators_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loan_calculators_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loan_calculators_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loan_calculators_loan_id_foreign` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_calculators`
--

LOCK TABLES `loan_calculators` WRITE;
/*!40000 ALTER TABLE `loan_calculators` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_calculators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `financial_year_id` bigint unsigned NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `loan_amount` double NOT NULL DEFAULT '0',
  `loan_period_in_month` double NOT NULL DEFAULT '0',
  `interest_rate` double NOT NULL DEFAULT '0',
  `status` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `apply_date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loans_financial_year_id_foreign` (`financial_year_id`),
  KEY `loans_employee_id_foreign` (`employee_id`),
  KEY `loans_department_id_foreign` (`department_id`),
  CONSTRAINT `loans_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loans_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loans_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_01_01_000001_create_notification_details_table',1),(5,'2025_01_01_000002_create_asset_categories_table',1),(6,'2025_01_01_000003_create_assets_table',1),(7,'2025_01_01_000004_create_departments_table',1),(8,'2025_01_01_000005_create_pay_grades_table',1),(9,'2025_01_01_000006_create_company_details_table',1),(10,'2025_01_01_000007_create_branch_details_table',1),(11,'2025_01_01_000008_create_financial_years_table',1),(12,'2025_01_01_000009_create_employees_table',1),(13,'2025_01_01_000010_create_payslips_table',1),(14,'2025_01_01_000011_create_assigned_jobs_table',1),(15,'2025_01_01_000012_create_daily_tasks_table',1),(16,'2025_01_01_000013_create_asset_allocations_table',1),(17,'2025_01_01_000014_create_loans_table',1),(18,'2025_01_01_000015_create_loan_calculators_table',1),(19,'2025_01_01_000016_create_leaves_table',1),(20,'2025_01_01_000017_create_leave_trackers_table',1),(21,'2025_01_01_000018_create_leave_calculators_table',1),(22,'2025_01_01_000019_create_attendance_records_table',1),(23,'2025_01_01_000020_create_travel_expenses_table',1),(24,'2025_01_02_000001_add_logo_to_company_details_table',1),(25,'2025_06_13_063905_create_employee_details_table',1),(26,'2025_06_13_063948_create_account_details_table',1),(27,'2025_06_13_064003_create_reference_details_table',1),(28,'2025_06_13_064017_create_offboarding_details_table',1),(29,'2025_06_13_072345_create_personal_access_tokens_table',1),(30,'2025_09_13_120000_update_payslips_unique_constraint',1),(31,'2025_09_21_071043_add_manager_id_to_employees_table',1),(32,'2026_10_06_000001_add_status_to_daily_tasks',1),(33,'2026_10_06_000002_add_leave_type_to_leave_trackers',1),(34,'2026_10_06_000003_create_leave_audits_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_details`
--

DROP TABLE IF EXISTS `notification_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_details`
--

LOCK TABLES `notification_details` WRITE;
/*!40000 ALTER TABLE `notification_details` DISABLE KEYS */;
INSERT INTO `notification_details` VALUES (1,'Diwali Festive Holiday Notice & Celebrations','Active','Office will remain closed on 28th-30th October for Diwali celebrations.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'Quarterly Town Hall Meeting - Q3 2026','Active','Join the CEO address this Friday at 4 PM in the main auditorium or via Zoom.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'Annual Performance Appraisal Cycle Launch','Active','Self-appraisal submissions are now open on the HRMS portal until October 31st.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'Scheduled IT Infrastructure Maintenance','Active','Server maintenance scheduled this Sunday from 2 AM to 6 AM IST. Portal might be briefly unavailable.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'New Health Insurance Policy Card Distribution','Active','Updated cashless medical insurance cards for 2026-2027 are available for download.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'Work From Home Policy Update','Active','Hybrid working guidelines updated: all employees requested to attend office min 3 days weekly.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'Information Security & Phishing Awareness Alert','Active','Do not click on unexpected email links or enter OTPs. Report suspicious emails to security@company.com.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'Welcome New Team Members - September Batch','Active','Please join us in giving a warm welcome to our 12 new colleagues joining across engineering and product.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'Annual Hackathon 2026 Registration Open','Active','Register your 4-member teams for the 48-hour Innovation Hackathon with prizes up to 5 Lakhs INR.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'Updated Travel Expense Claim Guidelines','Active','All domestic flight bookings must be submitted at least 7 days in advance for best fares.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'Mental Health & Wellness Counseling Sessions','Active','Free confidential counseling sessions available every Wednesday with certified wellness coaches.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'Gym & Fitness Center Reopening in Bengaluru Hub','Active','The on-campus fitness facility is fully revamped with new equipment and certified trainers.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'TDS Declaration Submission Window Open','Active','Submit your proposed investment proofs under the Old Tax Regime before November 15th.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'Cafeteria Menu Revision & Feedback Poll','Active','Vote for your favorite lunch and breakfast cuisines in the employee portal survey.','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'Emergency Contact & Nominee Details Update Required','Active','Kindly review and update your emergency contact details in the profile edit section.','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `notification_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offboarding_details`
--

DROP TABLE IF EXISTS `offboarding_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offboarding_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_details_id` bigint unsigned NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resignation_date` date NOT NULL,
  `last_working_day` date NOT NULL,
  `exit_interview_status` enum('Completed','Pending','Not Applicable') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason_for_leaving` text COLLATE utf8mb4_unicode_ci,
  `documents_handover_status` enum('Complete','In Progress','Pending') COLLATE utf8mb4_unicode_ci NOT NULL,
  `clearance_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `final_settlement_date` date DEFAULT NULL,
  `experience_certificate_issued` tinyint(1) NOT NULL DEFAULT '0',
  `experience_certificate_date` date DEFAULT NULL,
  `relieving_letter_issued` tinyint(1) NOT NULL DEFAULT '0',
  `relieving_letter_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `offboarding_details_employee_details_id_unique` (`employee_details_id`),
  CONSTRAINT `offboarding_details_employee_details_id_foreign` FOREIGN KEY (`employee_details_id`) REFERENCES `employee_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offboarding_details`
--

LOCK TABLES `offboarding_details` WRITE;
/*!40000 ALTER TABLE `offboarding_details` DISABLE KEYS */;
INSERT INTO `offboarding_details` VALUES (1,16,'pooja.mehra@company.com','2026-08-01','2026-09-30','Completed','Relocating to higher studies abroad','Complete','Approved','2026-10-05',1,'2026-10-05',1,'2026-10-05','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,17,'manish.tiwari@company.com','2026-08-01','2026-09-30','Completed','Relocating to higher studies abroad','Complete','Approved','2026-10-05',1,'2026-10-05',1,'2026-10-05','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,18,'divya.iyer@company.com','2026-08-01','2026-09-30','Completed','Relocating to higher studies abroad','Complete','Approved','2026-10-05',1,'2026-10-05',1,'2026-10-05','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,19,'rajesh.khanna@company.com','2026-08-01','2026-09-30','Completed','Relocating to higher studies abroad','Complete','Approved','2026-10-05',1,'2026-10-05',1,'2026-10-05','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,20,'meera.joshi@company.com','2026-08-01','2026-09-30','Completed','Relocating to higher studies abroad','Complete','Approved','2026-10-05',1,'2026-10-05',1,'2026-10-05','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `offboarding_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pay_grades`
--

DROP TABLE IF EXISTS `pay_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pay_grades` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `grade` int NOT NULL,
  `min_gross_range` decimal(15,2) NOT NULL DEFAULT '0.00',
  `max_gross_range` decimal(15,2) NOT NULL DEFAULT '0.00',
  `basic` decimal(15,2) NOT NULL DEFAULT '0.00',
  `hra` decimal(15,2) NOT NULL DEFAULT '0.00',
  `ta` decimal(15,2) NOT NULL DEFAULT '0.00',
  `com` decimal(15,2) NOT NULL DEFAULT '0.00',
  `medical` decimal(15,2) NOT NULL DEFAULT '0.00',
  `edu` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sa` decimal(15,2) NOT NULL DEFAULT '0.00',
  `income_tax` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pay_grades_grade_unique` (`grade`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pay_grades`
--

LOCK TABLES `pay_grades` WRITE;
/*!40000 ALTER TABLE `pay_grades` DISABLE KEYS */;
INSERT INTO `pay_grades` VALUES (1,1,20000.00,35000.00,45.00,20.00,10.00,0.00,5.00,5.00,15.00,0.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,2,35001.00,50000.00,45.00,20.00,10.00,0.00,5.00,5.00,15.00,2.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,3,50001.00,70000.00,40.00,20.00,10.00,5.00,5.00,5.00,15.00,5.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,4,70001.00,90000.00,40.00,20.00,10.00,5.00,5.00,5.00,15.00,8.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,5,90001.00,120000.00,40.00,20.00,10.00,5.00,5.00,5.00,15.00,10.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,6,120001.00,150000.00,35.00,20.00,10.00,10.00,5.00,5.00,15.00,12.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,7,150001.00,180000.00,35.00,20.00,10.00,10.00,5.00,5.00,15.00,15.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,8,180001.00,220000.00,35.00,20.00,10.00,10.00,5.00,5.00,15.00,18.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,9,220001.00,260000.00,30.00,20.00,10.00,15.00,5.00,5.00,15.00,20.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,10,260001.00,300000.00,30.00,20.00,10.00,15.00,5.00,5.00,15.00,22.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,11,300001.00,350000.00,30.00,20.00,10.00,15.00,5.00,5.00,15.00,25.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,12,350001.00,400000.00,30.00,20.00,10.00,15.00,5.00,5.00,15.00,28.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,13,400001.00,500000.00,25.00,20.00,10.00,20.00,5.00,5.00,15.00,30.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,14,500001.00,650000.00,25.00,20.00,10.00,20.00,5.00,5.00,15.00,30.00,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,15,650001.00,900000.00,25.00,20.00,10.00,20.00,5.00,5.00,15.00,30.00,'2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `pay_grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payslips`
--

DROP TABLE IF EXISTS `payslips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payslips` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `month_year` varchar(99) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `date` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `basic` decimal(15,2) NOT NULL DEFAULT '0.00',
  `hra` decimal(15,2) NOT NULL DEFAULT '0.00',
  `ta` decimal(15,2) NOT NULL DEFAULT '0.00',
  `com` decimal(15,2) NOT NULL DEFAULT '0.00',
  `medical` decimal(15,2) NOT NULL DEFAULT '0.00',
  `edu` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sa` decimal(15,2) NOT NULL DEFAULT '0.00',
  `pf` decimal(15,2) DEFAULT NULL,
  `esi` decimal(15,2) DEFAULT NULL,
  `income_tax` decimal(15,2) NOT NULL DEFAULT '0.00',
  `cl_taken` decimal(15,2) NOT NULL DEFAULT '0.00',
  `ei_taken` decimal(15,2) NOT NULL DEFAULT '0.00',
  `lwp_taken` decimal(15,2) NOT NULL DEFAULT '0.00',
  `advance_pay` decimal(15,2) DEFAULT '0.00',
  `leave_travel_allowance` decimal(15,2) DEFAULT '0.00',
  `telephone_expense` decimal(15,2) DEFAULT '0.00',
  `fuel_and_maint_two_wheeler` decimal(15,2) DEFAULT '0.00',
  `fuel_and_maint_four_wheeler` decimal(15,2) DEFAULT '0.00',
  `other_expense` decimal(15,2) DEFAULT '0.00',
  `paid_days` int DEFAULT '0',
  `total_days` int DEFAULT '0',
  `total_earning` decimal(15,2) DEFAULT '0.00',
  `total_deduction` decimal(15,2) DEFAULT '0.00',
  `total_reimbursement` decimal(15,2) DEFAULT '0.00',
  `net_current_salary` decimal(15,2) DEFAULT '0.00',
  `salary_status` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esi_number` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uan_number` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payslips_employee_month_unique` (`employee_id`,`month_year`),
  KEY `payslips_department_id_foreign` (`department_id`),
  CONSTRAINT `payslips_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payslips_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payslips`
--

LOCK TABLES `payslips` WRITE;
/*!40000 ALTER TABLE `payslips` DISABLE KEYS */;
/*!40000 ALTER TABLE `payslips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reference_details`
--

DROP TABLE IF EXISTS `reference_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reference_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_details_id` bigint unsigned NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reference_details_employee_details_id_foreign` (`employee_details_id`),
  CONSTRAINT `reference_details_employee_details_id_foreign` FOREIGN KEY (`employee_details_id`) REFERENCES `employee_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_details`
--

LOCK TABLES `reference_details` WRITE;
/*!40000 ALTER TABLE `reference_details` DISABLE KEYS */;
INSERT INTO `reference_details` VALUES (1,1,'praveen@trickuweb.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,2,'sarah.jenkins@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,3,'rahul.sharma@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,4,'vikram.malhotra@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,5,'anita.roy@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,6,'david.wilson@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,7,'priya.nair@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,8,'suresh.reddy@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,9,'karan.kapoor@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,10,'neha.gupta@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,11,'john.doe@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,12,'emma.watson@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,13,'arun.verma@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,14,'sneha.patel@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,15,'rohit.singh@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,16,'pooja.mehra@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,17,'manish.tiwari@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,18,'divya.iyer@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,19,'rajesh.khanna@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,20,'meera.joshi@company.com','Prof. S. R. Murthy','srmurthy@university.edu.in','9845012345','Dean & Department Head','Academic / Previous Employer','2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `reference_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_expenses`
--

DROP TABLE IF EXISTS `travel_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned DEFAULT NULL,
  `expense_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `description` text COLLATE utf8mb4_unicode_ci,
  `expense_date` date NOT NULL,
  `from_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose` text COLLATE utf8mb4_unicode_ci,
  `receipt_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `approved_by` bigint unsigned DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `travel_expenses_employee_id_foreign` (`employee_id`),
  KEY `travel_expenses_department_id_foreign` (`department_id`),
  KEY `travel_expenses_approved_by_foreign` (`approved_by`),
  CONSTRAINT `travel_expenses_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `travel_expenses_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `travel_expenses_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_expenses`
--

LOCK TABLES `travel_expenses` WRITE;
/*!40000 ALTER TABLE `travel_expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashed_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'praveen','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(2,'admin_sarah','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(3,'admin_rahul','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(4,'mgr_vikram','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(5,'mgr_anita','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(6,'mgr_david','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(7,'mgr_priya','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(8,'mgr_suresh','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(9,'asset_karan','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(10,'asset_neha','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(11,'emp_john','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(12,'emp_emma','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(13,'emp_arun','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(14,'emp_sneha','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(15,'emp_rohit','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(16,'emp_pooja','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(17,'emp_manish','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(18,'emp_divya','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(19,'emp_raj','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(20,'emp_meera','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(21,'emp_alok','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02'),(22,'emp_tanya','$2y$12$joVlajoSZCjYO3v5iQFMNeq235yvNzOcYhObfMMN/60cCX04xsMH.',1,'2026-10-10 09:19:02','2026-10-10 09:19:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hrmsdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-10 14:52:56
