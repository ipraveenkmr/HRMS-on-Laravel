import 'dart:io';
import 'package:hrms/page/attendance_page.dart';
import 'package:hrms/page/leave_page.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:device_info_plus/device_info_plus.dart';

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
    var response = await Dio().get(link + 'companies/companies/');
    if (response.statusCode == 200) {
      print('company details' + response.data[0]['company_name'].toString());
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString('companyname', response.data[0]['company_name']);
      prefs.setString('companyaddress', response.data[0]['company_address']);
      prefs.setString('companylongitude', response.data[0]['longitude']);
      prefs.setString('companylatitude', response.data[0]['latitude']);
      Get.offAll(AttendancePage());
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
    var response = await Dio().post(link + 'loans/', data: {
      'employee_id': int.parse(empid!),
      'department_id': empdepartment,
      'username': uname,
      'status': 'Active',
      'loan_amount': amount, //should be int
      'loan_period_in_month': period,
      'purpose': purpose,
    });
    if (response.statusCode == 200) {
      Get.offAll(AttendancePage());
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
    var response = await Dio().post(link + 'daily-tasks/', data: {
      'employee_id': int.parse(empid!),
      'department_id': empdepartment,
      'username': uname,
      'task': task, //should be int
      'manager': manager,
      'description': description,
    });
    if (response.statusCode == 200) {
      List months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ];
      var now = new DateTime.now();
      var current_day = now.day;
      var current_mon = now.month;
      var current_year = now.year;
      var minutes;
      var login_date = current_day.toString();
      var login_month = months[current_mon - 1].toString();
      var login_year = current_year.toString();
      if (now.minute.toString().length == 1) {
        minutes = "0" + now.minute.toString();
      } else {
        minutes = now.minute.toString();
      }
      var current_time = now.hour.toString() + ":" + minutes;
      updateAttendance(current_time, login_year, login_month, login_date);
      Get.snackbar("Response", 'Logout time updated!');
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString(
          'shared_current_time', 'Last logout time: ' + current_time);
      prefs.setString('shared_office_mode', 'You are now logged out!');
      Get.offAll(AttendancePage());
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

Future<String> applyLeave(String from, String to, String reason) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? uname = prefs.getString('username');
  String? empid = prefs.getString('empid');
  String? empdepartment = prefs.getString('empdepartment');

  try {
    var response = await Dio().post(link + 'leave/', data: {
      'employee_id': empid,
      'username': uname,
      'department_id': empdepartment,
      'CL_Days': 0,
      'CL_Hours': 0,
      'EI_Days': 0,
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
      'leave_status': "Pending",
    });
    if (response.statusCode == 200) {
      Get.offAll(LeavePage());
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
      var response = await Dio().post(link + 'attendance/', data: {
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
    if (companylongitude != null && longitude.isNotEmpty && 
        companylongitude.length >= 5 && longitude.length >= 5 &&
        companylongitude.substring(0, 5) == longitude.substring(0, 5)) {
      try {
        var response = await Dio().post(link + 'attendance/', data: {
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

Future<String> userlogin(String email, String password) async {
  try {
    var response = await Dio().post(link + 'auth/token/', data: {
      'username': email,
      'password': password,
    });
    if (response.statusCode == 200) {
      getUserDetails(email);
    }
    if (response.statusCode == 401) {
      Get.snackbar("Error while login!", "Please try again..");
    }
  } catch (e) {
    Get.snackbar("Error while login from catch!", "Please try again..");
    print(e);
  }
  return 'Loaded';
}

Future<String> getUserDetails(String email) async {
  try {
    var response = await Dio().get(link + 'employees/username/' + email + "/");
    if (response.statusCode == 200) {
      print(response.data[0]['longitude'].toString());
      print(response.data[0]['latitude'].toString());
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString('loginemail', email);
      prefs.setString('empid', response.data[0]['id']?.toString() ?? '');
      prefs.setString('username', response.data[0]['username'] ?? '');
      prefs.setString('empname', response.data[0]['emp_name'] ?? '');
      prefs.setString('empphone', response.data[0]['emp_phone'] ?? '');
      prefs.setString('empemail', response.data[0]['emp_email'] ?? '');
      // prefs.setString('address', response.data[0]['branch_name']);
      prefs.setString('emptype', response.data[0]['emp_type'] ?? '');
      prefs.setString('empworkmode', response.data[0]['work_mode'] ?? '');
      prefs.setString('companylongitude', response.data[0]['longitude'] ?? '');
      prefs.setString('companylatitude', response.data[0]['latitude'] ?? '');
      // prefs.setString('dob', response.data[0]['dob']);
      prefs.setString(
          'empdepartment', response.data[0]['department']?.toString() ?? '');
      Get.offAll(AttendancePage());
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

Future<String> checkUserDetails(String email) async {
  try {
    var response = await Dio().get(link + 'employees/username/' + email + "/");
    if (response.statusCode == 200) {
      print(response.data[0]['id'].toString());
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString('loginemail', email);
      prefs.setString('empid', response.data[0]['id'].toString());
      prefs.setString('username', response.data[0]['username']);
      prefs.setString('empname', response.data[0]['emp_name']);
      prefs.setString('empphone', response.data[0]['emp_phone']);
      prefs.setString('empemail', response.data[0]['emp_email']);
      // prefs.setString('address', response.data[0]['address']);
      prefs.setString('emptype', response.data[0]['emp_type']);
      prefs.setString('empworkmode', response.data[0]['work_mode']);
      // prefs.setString('dob', response.data[0]['dob']);
      prefs.setString(
          'empdepartment', response.data[0]['department'].toString());
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
    var response = await Dio()
        .get(link + 'attendance/' + adate + "/" + uname + "/");
    if (response.statusCode == 200) {
      aid = response.data[0]['id'];
      e_id = response.data[0]['employee'].toString();
      login_time = response.data[0]['login_time'].toString();
      username = response.data[0]['username'].toString();
      longitude = response.data[0]['longitude'].toString();
      latitude = response.data[0]['latitude'].toString();
      attendance = response.data[0]['attendance'].toString();
      login_at = response.data[0]['login_at'].toString();

      String logoutTime = response.data[0]['logout_at']?.toString() ?? '';
      print('logoutTime: ' + logoutTime);
      if (logoutTime.length > 3 && logoutTime != 'null') {
        return "loggedout";
      } else {
        return response.data[0]['login_at']?.toString() ?? '';
      }
    }
  } catch (e) {
    print(e);
    return "Catch Error";
  }
  return 'Error';
}
