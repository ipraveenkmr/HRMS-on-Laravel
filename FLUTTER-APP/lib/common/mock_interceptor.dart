import 'dart:convert';
import 'package:dio/dio.dart';

class MockInterceptor extends Interceptor {
  // In-memory store for dynamic additions during the app session
  static final List<Map<String, dynamic>> _mockLeaves = _generateInitialLeaves();
  static final List<Map<String, dynamic>> _mockAttendanceHistory = _generateInitialAttendance();
  static final List<Map<String, dynamic>> _mockTasks = _generateInitialTasks();
  static final List<Map<String, dynamic>> _mockAssets = _generateInitialAssets();
  
  // Track today's punch status in memory
  // Key: "username_date"
  static final Map<String, Map<String, dynamic>> _todayPunchStatus = {};

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final path = options.path;
    final method = options.method;

    print("Interception mock request: $method $path");

    // 1. GET /companies
    if (path.endsWith('companies') && method == 'GET') {
      final responseData = List.generate(10, (index) => {
        "id": index + 1,
        "company_name": index == 0 ? "Haion Corporate HQ" : "Haion Regional Office ${index}",
        "company_address": index == 0 ? "Sector 62, Noida, India" : "Tech Avenue, Block ${index + 1}",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2025-01-01T00:00:00.000Z"
      });
      handler.resolve(Response(
        requestOptions: options,
        data: responseData,
        statusCode: 200,
      ));
      return;
    }

    // 2. POST /auth/token
    if (path.endsWith('auth/token') && method == 'POST') {
      handler.resolve(Response(
        requestOptions: options,
        data: {"token": "dummy-jwt-token-xyz123"},
        statusCode: 200,
      ));
      return;
    }

    // 3. GET /employees/username/{email}
    if (path.contains('employees/username/') && method == 'GET') {
      final email = path.split('employees/username/').last.trim();
      final employee = _getDummyEmployee(email);
      handler.resolve(Response(
        requestOptions: options,
        data: [employee],
        statusCode: 200,
      ));
      return;
    }

    // 4. GET /attendance/check/{adate}/{uname}
    if (path.contains('attendance/check/') && method == 'GET') {
      final parts = path.split('attendance/check/').last.split('/');
      final adate = parts[0];
      final uname = parts[1];
      final key = "${uname}_$adate";

      if (_todayPunchStatus.containsKey(key)) {
        handler.resolve(Response(
          requestOptions: options,
          data: [_todayPunchStatus[key]],
          statusCode: 200,
        ));
      } else {
        // If not checked in, return 404/empty to trigger the punch dialog flow
        handler.resolve(Response(
          requestOptions: options,
          data: [],
          statusCode: 404,
        ));
      }
      return;
    }

    // 5. POST /attendance
    if (path.endsWith('attendance') && method == 'POST') {
      final data = options.data ?? {};
      final adate = data['attendance_date']?.toString() ?? DateTime.now().toString().split(' ').first;
      final uname = data['username']?.toString() ?? 'admin@company.com';
      final key = "${uname}_$adate";

      final record = {
        "id": 999,
        "employee": data['employee_id'] ?? 1,
        "attendance_date": adate,
        "username": uname,
        "longitude": data['longitude']?.toString() ?? "77.3689",
        "latitude": data['latitude']?.toString() ?? "28.6273",
        "attendance": "Present",
        "login_at": data['login_at']?.toString() ?? "09:00",
        "logout_at": data['logout_at']?.toString() ?? "null",
        "device": data['device']?.toString() ?? "MockDevice",
        "login_date": adate,
        "login_month": data['login_month']?.toString() ?? "08",
        "login_year": data['login_year']?.toString() ?? "2026",
        "log_time": data['logout_at']?.toString() != "null" ? "9h 0m" : "0h 0m"
      };

      _todayPunchStatus[key] = record;

      // Update in-memory history list too
      final existingIndex = _mockAttendanceHistory.indexWhere(
          (element) => element['attendance_date'] == adate && element['username'] == uname);
      if (existingIndex >= 0) {
        _mockAttendanceHistory[existingIndex] = record;
      } else {
        _mockAttendanceHistory.insert(0, record);
      }

      handler.resolve(Response(
        requestOptions: options,
        data: record,
        statusCode: 200,
      ));
      return;
    }

    // 6. POST /daily-tasks
    if (path.endsWith('daily-tasks') && method == 'POST') {
      final data = options.data ?? {};
      // Simulate adding a task in history
      _mockTasks.insert(0, {
        "task": data['task']?.toString() ?? "General Operations",
        "submission_date": DateTime.now().toIso8601String(),
        "status": "Completed",
        "description": data['description']?.toString() ?? "Daily update submitted via Mock Mode."
      });

      handler.resolve(Response(
        requestOptions: options,
        data: {"status": "success", "message": "Daily task updated"},
        statusCode: 200,
      ));
      return;
    }

    // 7. GET /tasks/employee/{username}
    if (path.contains('tasks/employee/') && method == 'GET') {
      handler.resolve(Response(
        requestOptions: options,
        data: _mockTasks,
        statusCode: 200,
      ));
      return;
    }

    // 8. GET /leave/calculator/{username}
    if (path.contains('leave/calculator/') && method == 'GET') {
      handler.resolve(Response(
        requestOptions: options,
        data: [
          {
            "remaining_CL_Days": 12,
            "remaining_EI_Days": 8,
            "remaining_LWP_Days": 5,
            "remaining_other_leave_in_days": 10,
            "remaining_medical_leave_in_days": 7
          }
        ],
        statusCode: 200,
      ));
      return;
    }

    // 9. GET /leave/employee/{username}
    if (path.contains('leave/employee/') && method == 'GET') {
      handler.resolve(Response(
        requestOptions: options,
        data: _mockLeaves,
        statusCode: 200,
      ));
      return;
    }

    // 10. POST /leave
    if (path.endsWith('leave') && method == 'POST') {
      final data = options.data ?? {};
      _mockLeaves.insert(0, {
        "leave_status": "Pending",
        "leave_reason": data['leave_reason'] ?? "Personal Leave",
        "leave_from_date": data['leave_from_date'] ?? DateTime.now().toString().split(' ').first,
        "leave_to_date": data['leave_to_date'] ?? DateTime.now().add(Duration(days: 1)).toString().split(' ').first,
      });

      handler.resolve(Response(
        requestOptions: options,
        data: {"status": "success", "message": "Leave applied successfully"},
        statusCode: 200,
      ));
      return;
    }

    // 11. GET /attendance/employee/{uname}
    if (path.contains('attendance/employee/') && method == 'GET') {
      handler.resolve(Response(
        requestOptions: options,
        data: _mockAttendanceHistory,
        statusCode: 200,
      ));
      return;
    }

    // 12. GET /assets-allocations/employee/{username}
    if (path.contains('assets-allocations/employee/') && method == 'GET') {
      handler.resolve(Response(
        requestOptions: options,
        data: _mockAssets,
        statusCode: 200,
      ));
      return;
    }

    // 13. POST /loans
    if (path.endsWith('loans') && method == 'POST') {
      handler.resolve(Response(
        requestOptions: options,
        data: {"status": "success", "message": "Loan applied successfully"},
        statusCode: 200,
      ));
      return;
    }

    // Fallback handler
    super.onRequest(options, handler);
  }

  // --- Dummy Data Generators (10+ records each) ---

  static Map<String, dynamic> _getDummyEmployee(String email) {
    final employees = [
      {
        "id": 101,
        "username": "admin@company.com",
        "emp_name": "John Administrator",
        "emp_phone": "+91 9876543210",
        "emp_email": "admin@company.com",
        "emp_type": "Permanent",
        "work_mode": "Office",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "IT Operations"
      },
      {
        "id": 102,
        "username": "john.doe@company.com",
        "emp_name": "John Doe",
        "emp_phone": "+91 9999888877",
        "emp_email": "john.doe@company.com",
        "emp_type": "Permanent",
        "work_mode": "Field",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Sales"
      },
      {
        "id": 103,
        "username": "jane.smith@company.com",
        "emp_name": "Jane Smith",
        "emp_phone": "+1 555-0199",
        "emp_email": "jane.smith@company.com",
        "emp_type": "Permanent",
        "work_mode": "Office",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Engineering"
      },
      {
        "id": 104,
        "username": "bob.johnson@company.com",
        "emp_name": "Bob Johnson",
        "emp_phone": "+1 555-0144",
        "emp_email": "bob.johnson@company.com",
        "emp_type": "Contractor",
        "work_mode": "Field",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Marketing"
      },
      {
        "id": 105,
        "username": "alice.williams@company.com",
        "emp_name": "Alice Williams",
        "emp_phone": "+91 9112233445",
        "emp_email": "alice.williams@company.com",
        "emp_type": "Permanent",
        "work_mode": "Office",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Human Resources"
      },
      {
        "id": 106,
        "username": "charlie.brown@company.com",
        "emp_name": "Charlie Brown",
        "emp_phone": "+44 20 7946 0958",
        "emp_email": "charlie.brown@company.com",
        "emp_type": "Permanent",
        "work_mode": "Field",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Sales"
      },
      {
        "id": 107,
        "username": "david.miller@company.com",
        "emp_name": "David Miller",
        "emp_phone": "+1 555-0102",
        "emp_email": "david.miller@company.com",
        "emp_type": "Permanent",
        "work_mode": "Office",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Finance"
      },
      {
        "id": 108,
        "username": "eva.davis@company.com",
        "emp_name": "Eva Davis",
        "emp_phone": "+91 8887776665",
        "emp_email": "eva.davis@company.com",
        "emp_type": "Contractor",
        "work_mode": "Field",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Operations"
      },
      {
        "id": 109,
        "username": "frank.wilson@company.com",
        "emp_name": "Frank Wilson",
        "emp_phone": "+1 555-0187",
        "emp_email": "frank.wilson@company.com",
        "emp_type": "Permanent",
        "work_mode": "Office",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Legal"
      },
      {
        "id": 110,
        "username": "grace.taylor@company.com",
        "emp_name": "Grace Taylor",
        "emp_phone": "+91 7776665554",
        "emp_email": "grace.taylor@company.com",
        "emp_type": "Permanent",
        "work_mode": "Field",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "department": "Customer Support"
      }
    ];

    return employees.firstWhere(
      (emp) => emp['username'] == email.trim(),
      orElse: () => employees[0],
    );
  }

  static List<Map<String, dynamic>> _generateInitialLeaves() {
    final reasons = [
      "Annual family vacation",
      "Medical checkup & dentist appointment",
      "Personal administrative work",
      "Minor fever recovery",
      "Sister's wedding ceremony",
      "Home renovation management",
      "Urgent bank related task",
      "Attending technical seminar",
      "Car breakdown servicing",
      "Self-care day & wellness"
    ];
    final statuses = [
      "Approved",
      "Approved",
      "Pending",
      "Approved",
      "Rejected",
      "Approved",
      "Pending",
      "Approved",
      "Approved",
      "Approved"
    ];
    
    return List.generate(10, (index) {
      final fromDate = DateTime.now().subtract(Duration(days: (index + 1) * 7));
      final toDate = fromDate.add(Duration(days: index % 2 + 1));
      return {
        "id": 200 + index,
        "leave_status": statuses[index],
        "leave_reason": reasons[index],
        "leave_from_date": fromDate.toString().split(' ').first,
        "leave_to_date": toDate.toString().split(' ').first,
      };
    });
  }

  static List<Map<String, dynamic>> _generateInitialAttendance() {
    return List.generate(10, (index) {
      final date = DateTime.now().subtract(Duration(days: index + 1));
      final dateString = date.toString().split(' ').first;
      return {
        "id": 300 + index,
        "employee": 101,
        "attendance_date": dateString,
        "username": "admin@company.com",
        "longitude": "77.3689",
        "latitude": "28.6273",
        "attendance": "Present",
        "login_at": "09:${10 + index % 5}",
        "logout_at": "18:${00 + index % 10}",
        "device": "MockDevice",
        "login_date": dateString,
        "login_month": dateString.split('-')[1],
        "login_year": dateString.split('-')[0],
        "log_time": "8h ${50 + index % 10}m"
      };
    });
  }

  static List<Map<String, dynamic>> _generateInitialTasks() {
    final tasks = [
      "Complete onboarding documentation",
      "Review pull request #12 & merge to staging",
      "Implement main navigation dashboard",
      "Fix login validation and error snackbar",
      "Database schema migration & backup setup",
      "Prepare department weekly progress report",
      "Sync with product designer regarding new asset management flow",
      "Optimize local SQLite caching logic",
      "Write unit tests for authentication repository",
      "Configure automated dev builds on CI/CD pipeline"
    ];
    
    final descriptions = [
      "Submit copies of PAN card, Aadhar card, and certificates.",
      "Review changes in security modules and run integration checks.",
      "Develop responsive UI layout with navigation rails.",
      "Resolve null validation checks in username and password inputs.",
      "Backup production databases and test restore procedure.",
      "Summarize engineering achievements, blockers, and timelines.",
      "Align on asset card layouts, return dates, and detail actions.",
      "Optimize data lookup times by adding indexing on employee_id.",
      "Ensure test coverage for login failure, success, and tokens.",
      "Fix fastlane scripts to push apk to Firebase App Distribution."
    ];

    final statuses = [
      "Completed",
      "Completed",
      "In Progress",
      "Completed",
      "Pending",
      "Completed",
      "In Progress",
      "Completed",
      "Completed",
      "Pending"
    ];

    return List.generate(10, (index) {
      final date = DateTime.now().subtract(Duration(days: index));
      return {
        "id": 400 + index,
        "task": tasks[index],
        "submission_date": date.toIso8601String(),
        "status": statuses[index],
        "description": descriptions[index],
      };
    });
  }

  static List<Map<String, dynamic>> _generateInitialAssets() {
    final assets = [
      "MacBook Pro M2 (16-inch, Space Grey)",
      "iPhone 14 Pro Max Test Device",
      "Dell UltraSharp 27-inch 4K Monitor",
      "Logitech MX Keys Keyboard",
      "Logitech MX Master 3S Mouse",
      "Sony WH-1000XM4 Noise Canceling Headset",
      "Steelcase Ergonomic Office Chair",
      "Smart Standing Desk with Motor",
      "YubiKey 5C NFC Security Key",
      "Haion Corporate Access Card & ID Tag"
    ];

    final descriptions = [
      "Serial: C02HH455Q05D, Condition: Mint",
      "Serial: APPL78892348, Condition: Excellent",
      "Serial: CN-0D987Y-74445, Condition: Brand New",
      "Serial: 2209LZ00129, Condition: Good",
      "Serial: 2209LZ00445, Condition: Good",
      "Serial: SN-8899234, Condition: Mint",
      "Asset tag: STLC-99012, Condition: Used",
      "Asset tag: DSK-8812, Condition: Excellent",
      "Asset tag: YUBI-0128, Condition: Mint",
      "Access code: HAION-AC-1004, Status: Active"
    ];

    return List.generate(10, (index) {
      final allocDate = DateTime.now().subtract(Duration(days: (index + 2) * 15));
      final returnDate = DateTime.now().add(Duration(days: 365));
      return {
        "id": 500 + index,
        "asset": assets[index],
        "allocation_date": allocDate.toIso8601String(),
        "return_date": returnDate.toIso8601String(),
        "description": descriptions[index],
      };
    });
  }
}
