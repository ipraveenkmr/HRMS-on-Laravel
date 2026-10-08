import 'dart:io';
import 'package:flutter/material.dart';
import 'package:hrms/page/attendance_page.dart';
import 'package:hrms/page/leave_page.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:device_info_plus/device_info_plus.dart';
import '../common/api_client.dart';

import '../constants.dart';

String link = AppConstants.apiLink;
int aid = 0;
String e_id = "";
String login_time = "";
String username = "";
String longitude = "";
String latitude = "";
String attendance = "";
String login_at = "";
String login_date = "";
String login_month = "";
String login_year = "";

Future<String> getCompanyDetails() async {
  try {
    var response = await ApiClient.client.get(link + 'companies');
    if (response.statusCode == 200 &&
        response.data != null &&
        (response.data as List).isNotEmpty) {
      print('company details' + response.data[0]['company_name'].toString());
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString('companyname', response.data[0]['company_name'] ?? '');
      prefs.setString(
          'companyaddress', response.data[0]['company_address'] ?? '');
      prefs.setString(
          'companylongitude', response.data[0]['longitude']?.toString() ?? '');
      prefs.setString(
          'companylatitude', response.data[0]['latitude']?.toString() ?? '');
      Get.offAll(() => AttendancePage());
    } else {
      Get.snackbar("Error", "No company details found.");
    }
    if (response.statusCode == 401) {
      Get.snackbar("Error while creating 401!", "Please try again..");
    }
  } catch (e) {
    Get.snackbar("Error while creating catch another!", "Please try again..");
    print(e);
  }
  return 'Loaded';
}

Future<String> applyLoan(String amount, String period, String purpose) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? uname = prefs.getString('username');
  String? empdepartment = prefs.getString('empdepartment');
  String? empid = prefs.getString('empid');

  try {
    var response = await ApiClient.client.post(link + 'loans', data: {
      'employee_id': int.tryParse(empid ?? '') ?? 0,
      'department_id': empdepartment,
      'username': uname,
      'status': 'Active',
      'loan_amount': amount, //should be int
      'loan_period_in_month': period,
      'purpose': purpose,
    });
    if (response.statusCode == 200) {
      Get.offAll(() => AttendancePage());
    }
    if (response.statusCode == 401) {
      Get.snackbar("Error while submitting!", "Please try again..");
    }
  } catch (e) {
    Get.snackbar("Error while creating data!", "Please try again..");
    print(e);
  }
  return 'Loaded';
}

Future<String> dailyTask(
    String task, String manager, String description) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? uname = prefs.getString('username');
  String? empdepartment = prefs.getString('empdepartment');
  String? empid = prefs.getString('empid');

  try {
    var response = await ApiClient.client.post(link + 'daily-tasks', data: {
      'employee_id': int.tryParse(empid ?? '') ?? 0,
      'department_id': empdepartment,
      'username': uname,
      'task': task,
      'manager': manager,
      'description': description,
    });
    if (response.statusCode == 201) {
      Get.offAll(() => AttendancePage());
      Get.snackbar(
        'Task Submitted',
        'Daily task saved successfully.',
        backgroundColor: Colors.green.shade700,
        colorText: Colors.white,
        snackPosition: SnackPosition.TOP,
        margin: const EdgeInsets.all(16),
        borderRadius: 10,
        duration: const Duration(seconds: 3),
      );
    } else if (response.statusCode == 401) {
      Get.snackbar("Error while submitting!", "Please try again..");
    }
  } on DioException catch (e) {
    final detail = e.response?.data is Map
        ? e.response?.data['detail'] ?? e.response?.data['message']
        : null;
    Get.snackbar("Task Error", detail?.toString() ?? "Could not save daily task.");
  } catch (e) {
    Get.snackbar("Error while creating data!", "Please try again..");
    print(e);
  }
  return 'Loaded';
}

Future<String> applyLeave(String from, String to, String reason, String leaveType) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? uname = prefs.getString('username');
  String? empid = prefs.getString('empid');
  String? empdepartment = prefs.getString('empdepartment');

  try {
    var response = await ApiClient.client.post(link + 'leave', data: {
      'employee_id': empid,
      'username': uname,
      'department_id': empdepartment,
      'CL_Days': 0,
      'CL_Hours': 0,
      'EI_Days': 0,
      'EI_Hours': 0,
      'LWP_Days': 0,
      'LWP_Hours': 0,
      'medical_leave_in_days': 0,
      'medical_leave_in_hours': 0,
      'other_leave_in_days': 0,
      'other_leave_in_hours': 0,
      'leave_from_date': from,
      'leave_to_date': to,
      'leave_reason': reason,
      'leave_type': leaveType,
      'leave_status': "Pending",
    });
    if (response.statusCode == 201) {
      Get.offAll(() => LeavePage());
    }
    if (response.statusCode == 401) {
      Get.snackbar("Error while submitting!", "Please try again..");
    }
  } on DioException catch (e) {
    final detail = e.response?.data is Map ? e.response?.data['detail'] ?? e.response?.data['message'] : null;
    Get.snackbar('Leave request', detail?.toString() ?? 'Unable to submit leave. Please try again.');
  } catch (e) {
    Get.snackbar('Leave request', 'Unable to submit leave. Please try again.');
  }
  return 'Loaded';
}

Future<String> updateAttendance(String logoutAt, String login_year,
    String login_month, String login_date) async {
  String adate = login_year + "-" + login_month + "-" + login_date;
  print('adate updateattendance: ' + adate);

  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? workmode = prefs.getString('empworkmode');
  String? companylongitude = prefs.getString('companylongitude');
  String? companylatitude = prefs.getString('companylatitude');
  String? empdepartment = prefs.getString('empdepartment');
  Get.snackbar("workmode", workmode ?? "Unknown");

  String deviceid = '';
  var deviceInfo = DeviceInfoPlugin();
  if (Platform.isAndroid) {
    var androidDeviceInfo = await deviceInfo.androidInfo;
    deviceid =
        '${androidDeviceInfo.model}:${androidDeviceInfo.id}'; // unique ID on Android
  }

  if (workmode == 'Field') {
    try {
      var response = await ApiClient.client.post(link + 'attendance', data: {
        'id': aid,
        'employee_id': e_id,
        'attendance_date': adate,
        'username': username,
        'department_id': empdepartment,
        'longitude': longitude,
        'latitude': latitude,
        'attendance': 'Present',
        'device': deviceid,
        'login_at': login_at,
        'logout_at': logoutAt,
        'login_date': adate,
        'login_month': login_month,
        'login_year': login_year,
      });
      if (response.statusCode == 401) {
        Get.snackbar("Error while creating!", "Please try again..");
      }
    } catch (e) {
      Get.snackbar("Error while creating!", "Please try again..");
      print(e);
    }
  } else if (workmode == 'Office') {
    if (AppConstants.dummyMode ||
        (companylongitude != null &&
            longitude.isNotEmpty &&
            companylongitude.length >= 5 &&
            longitude.length >= 5 &&
            companylongitude.substring(0, 5) == longitude.substring(0, 5))) {
      try {
        var response = await ApiClient.client.post(link + 'attendance', data: {
          'id': aid,
          'employee_id': e_id,
          'attendance_date': adate,
          'username': username,
          'department_id': empdepartment,
          'longitude': longitude,
          'latitude': latitude,
          'attendance': 'Present',
          'login_at': login_at,
          'device': deviceid,
          'logout_at': logoutAt,
          'login_date': adate,
          'login_month': login_month,
          'login_year': login_year,
        });
        if (response.statusCode == 401) {
          Get.snackbar("Error while creating!", "Please try again..");
        }
      } catch (e) {
        Get.snackbar("Error while creating!", "Please try again..");
        print(e);
      }
    } else {
      Get.snackbar("Error while creating.", "Latitude mismatch!");
    }
  }

  return 'Loaded';
}

Future<String?> userlogin(String email, String password) async {
  try {
    var response = await ApiClient.client.post(
      AppConstants.apiLink + 'auth/token',
      data: {
        'username': email,
        'password': password,
      },
      options: Options(
        sendTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    if (response.statusCode == 200 && response.data != null) {
      final prefs = await SharedPreferences.getInstance();
      final token = response.data['access_token']?.toString();
      if (token != null && token.isNotEmpty) {
        await prefs.setString('access_token', token);
      }
      return await getUserDetails(email);
    } else {
      return "Unexpected server response (Code ${response.statusCode}). Please try again.";
    }
  } on DioException catch (e) {
    String errorMsg = _extractDioErrorMessage(e);
    Get.snackbar(
      'Sign In Failed',
      errorMsg,
      backgroundColor: Colors.red.shade700,
      colorText: Colors.white,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.all(16),
      borderRadius: 10,
      duration: const Duration(seconds: 4),
      icon: const Icon(Icons.error_outline_rounded, color: Colors.white),
    );
    return errorMsg;
  } catch (e) {
    String errorMsg = 'An unexpected error occurred: ${e.toString()}';
    Get.snackbar(
      'Sign In Failed',
      errorMsg,
      backgroundColor: Colors.red.shade700,
      colorText: Colors.white,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.all(16),
      borderRadius: 10,
      duration: const Duration(seconds: 4),
      icon: const Icon(Icons.error_outline_rounded, color: Colors.white),
    );
    return errorMsg;
  }
}

String _extractDioErrorMessage(DioException e) {
  if (e.response != null) {
    final statusCode = e.response?.statusCode;
    final data = e.response?.data;

    if (data is Map) {
      final detail = data['detail'] ?? data['message'] ?? data['error'];
      if (detail != null && detail.toString().trim().isNotEmpty) {
        final detailStr = detail.toString().trim();
        if (detailStr.toLowerCase().contains('incorrect username or password')) {
          return "Incorrect username or password. Please verify your credentials and try again.";
        }
        return detailStr;
      }
    }

    if (statusCode == 401) {
      return "Incorrect username or password. Please verify your credentials and try again.";
    } else if (statusCode == 403) {
      return "Access denied. Your account is inactive or lacks required permissions.";
    } else if (statusCode == 404) {
      return "Authentication endpoint not found (404). Please verify the server address.";
    } else if (statusCode == 422) {
      return "Please enter a valid username and password.";
    } else if (statusCode == 429) {
      return "Too many sign-in attempts. Please wait a moment and try again.";
    } else if (statusCode != null && statusCode >= 500) {
      return "Backend server error ($statusCode). Please verify the backend is running.";
    }
  }

  if (e.type == DioExceptionType.connectionTimeout ||
      e.type == DioExceptionType.sendTimeout ||
      e.type == DioExceptionType.receiveTimeout) {
    return "Connection timed out. Please check your internet connection or server status.";
  }

  if (e.type == DioExceptionType.connectionError) {
    return "Unable to connect to server at ${AppConstants.apiLink}. Please make sure 'php artisan serve' is running.";
  }

  return "Unable to connect to server. Please check your network and try again.";
}

Future<String?> getUserDetails(String email) async {
  try {
    var response = await ApiClient.client.get(
      AppConstants.apiLink + 'employees/username/' + email,
      options: Options(
        sendTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    if (response.statusCode == 200 &&
        response.data != null &&
        (response.data as List).isNotEmpty) {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      var emp = response.data[0];
      prefs.setString('loginemail', email);
      prefs.setString('empid', emp['id']?.toString() ?? '');
      prefs.setString('username', emp['username'] ?? '');
      prefs.setString('empname', emp['emp_name'] ?? '');
      prefs.setString('empphone', emp['emp_phone'] ?? '');
      prefs.setString('empemail', emp['emp_email'] ?? '');
      prefs.setString('emptype', emp['emp_type'] ?? '');
      prefs.setString('empworkmode', emp['work_mode'] ?? '');
      prefs.setString(
          'companylongitude',
          emp['company_detail']?['longitude']?.toString() ??
              emp['longitude']?.toString() ??
              '');
      prefs.setString(
          'companylatitude',
          emp['company_detail']?['latitude']?.toString() ??
              emp['latitude']?.toString() ??
              '');
      prefs.setString('empdepartment', emp['department_id']?.toString() ?? '');

      // Initialize daily task / attendance logout states to safe defaults for the session
      prefs.setString('shared_current_time', 'Not checked in');
      prefs.setString('shared_office_mode', 'Select calendar card to punch');

      Get.offAll(() => AttendancePage());
      return null;
    } else {
      String msg = "Login succeeded, but employee profile was not found for '$email'.";
      Get.snackbar(
        "Profile Notice",
        msg,
        backgroundColor: Colors.orange.shade800,
        colorText: Colors.white,
        snackPosition: SnackPosition.TOP,
        margin: const EdgeInsets.all(16),
        borderRadius: 10,
      );
      return msg;
    }
  } on DioException catch (e) {
    String msg = _extractDioErrorMessage(e);
    Get.snackbar(
      "Profile Error",
      msg,
      backgroundColor: Colors.red.shade700,
      colorText: Colors.white,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.all(16),
      borderRadius: 10,
    );
    return msg;
  } catch (e) {
    String msg = "Failed to load employee details: ${e.toString()}";
    Get.snackbar(
      "Profile Error",
      msg,
      backgroundColor: Colors.red.shade700,
      colorText: Colors.white,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.all(16),
      borderRadius: 10,
    );
    return msg;
  }
}

Future<String> checkUserDetails(String email) async {
  try {
    var response =
        await ApiClient.client.get(link + 'employees/username/' + email);
    if (response.statusCode == 200 &&
        response.data != null &&
        (response.data as List).isNotEmpty) {
      print(response.data[0]['id'].toString());
      SharedPreferences prefs = await SharedPreferences.getInstance();
      var emp = response.data[0];
      prefs.setString('loginemail', email);
      prefs.setString('empid', emp['id']?.toString() ?? '');
      prefs.setString('username', emp['username'] ?? '');
      prefs.setString('empname', emp['emp_name'] ?? '');
      prefs.setString('empphone', emp['emp_phone'] ?? '');
      prefs.setString('empemail', emp['emp_email'] ?? '');
      prefs.setString('emptype', emp['emp_type'] ?? '');
      prefs.setString('empworkmode', emp['work_mode'] ?? '');
      prefs.setString('empdepartment', emp['department_id']?.toString() ?? '');
      prefs.setString(
          'companylongitude',
          emp['company_detail']?['longitude']?.toString() ??
              emp['longitude']?.toString() ??
              '');
      prefs.setString(
          'companylatitude',
          emp['company_detail']?['latitude']?.toString() ??
              emp['latitude']?.toString() ??
              '');
    }
    if (response.statusCode == 401) {
      Get.snackbar("Error while creating 401!", "Please try again..");
    }
  } catch (e) {
    Get.snackbar("Error while creating catch another!", "Please try again..");
    print(e);
  }
  return 'Loaded';
}

Future<String> checkAttendance(String uname, String login_year,
    String login_month, String login_date) async {
  String adate = login_year + "-" + login_month + "-" + login_date;
  print('adate: ' + adate);
  try {
    var response = await ApiClient.client
        .get(link + 'attendance/check/' + adate + "/" + uname);
    if (response.statusCode == 200 &&
        response.data != null &&
        (response.data as List).isNotEmpty) {
      var record = response.data[0];
      aid = record['id'] ?? 0;
      e_id = record['employee_id']?.toString() ??
          record['employee']?.toString() ??
          '';
      login_time = record['login_time']?.toString() ?? '';
      username = record['username']?.toString() ?? '';
      longitude = record['longitude']?.toString() ?? '';
      latitude = record['latitude']?.toString() ?? '';
      attendance = record['attendance']?.toString() ?? '';
      login_at = record['login_at']?.toString() ?? '';

      String logoutTime = record['logout_at']?.toString() ?? '';
      print('logoutTime: ' + logoutTime);
      if (logoutTime.length > 3 && logoutTime != 'null') {
        return "loggedout";
      } else {
        return record['login_at']?.toString() ?? '';
      }
    }
  } catch (e) {
    print(e);
    return "Catch Error";
  }
  return 'Error';
}
