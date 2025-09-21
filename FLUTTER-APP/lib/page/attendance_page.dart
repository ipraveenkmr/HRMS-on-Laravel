import 'dart:io';
import 'package:hrms/door/widgets/cdotcomponents.dart';
import 'package:hrms/page/update_dailytask.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hrms/door/widgets/header_widget.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:location/location.dart' as loc;
import 'package:shared_preferences/shared_preferences.dart';
import '../controller/authentication.dart';
import 'package:device_info_plus/device_info_plus.dart';

class AttendancePage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _AttendancePageState();
  }
}

class _AttendancePageState extends State<AttendancePage> {
  final loc.Location location = loc.Location();
  String longitude = "";
  String latitude = "";
  String username = "";
  String e_id = "";
  String login_date = "";
  String login_month = "";
  String login_year = "";
  String attendance = "";
  String login_at = "";
  String logout_at = "";
  String attendance_date = "";
  String current_time = "";
  String office_mode = "Office Mode";
  String shared_current_time = "";
  String shared_office_mode = "Office Mode";
  List users = [];

  @override
  void initState() {
    super.initState();
    getUsers();
    getUsersData();
    getCurrentDate();
    _requestPermission();
    location.changeSettings(interval: 300, accuracy: loc.LocationAccuracy.high);
    location.enableBackgroundMode(enable: true);
    getUsers().then((data) {
      setState(() {
        users = data;
        print('Data: ' + data.toString());
      });
    });
  }

  Widget buildText(String text) => Center(
        child: Text(
          text,
          style: TextStyle(fontSize: 24, color: Colors.black87),
        ),
      );

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String uname = prefs.getString('username').toString();
    var response = await Dio().get(link + "attendance/employee/" + uname);
    return response.data;
  }

  getUsersData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      username = prefs.getString('username').toString();
      e_id = prefs.getString('empid').toString();
      shared_office_mode = prefs.getString('shared_office_mode')!;
      shared_current_time = prefs.getString('shared_current_time')!;
    });
  }

  getCurrentDate() {
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

    setState(() {
      login_date = current_day.toString();
      login_month = months[current_mon - 1].toString();
      login_year = current_year.toString();
      if (now.minute.toString().length == 1) {
        minutes = "0" + now.minute.toString();
      } else {
        minutes = now.minute.toString();
      }
      current_time = now.hour.toString() + ":" + minutes;
      attendance_date = login_year + "-" + login_month + "-" + login_date;
    });
  }

  confirmAttendance() async {
    checkUserDetails(username);
    getCurrentDate();
    var check =
        await checkAttendance(username, login_year, login_month, login_date);
    print('checkAttendance: ' + check.toString());
    if (check.toString() == "Catch Error") {
      // set up the buttons
      Widget cancelButton = TextButton(
        child: Text("Cancel"),
        onPressed: () {
          Navigator.of(context, rootNavigator: true).pop(true);
        },
      );
      Widget continueButton = TextButton(
        child: Text("Ok"),
        onPressed: () async {
          _getLocation();
          Navigator.of(context, rootNavigator: true).pop(true);
        },
      );
      // set up the AlertDialog
      AlertDialog alert = AlertDialog(
        title: Text(
          "Make Attendance?",
          style: TextStyle(
              fontWeight: FontWeight.w400, fontFamily: 'Rubik', fontSize: 16),
        ),
        actions: [
          cancelButton,
          continueButton,
        ],
      );
      // show the dialog
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return alert;
        },
      );
    } else if (check.toString() == "loggedout") {
      Get.snackbar("Already Logged out!", "Your attendance was marked.");
    } else {
      // set up the buttons
      Widget cancelButton = TextButton(
        child: Text("Cancel"),
        onPressed: () {
          Navigator.of(context, rootNavigator: true).pop(true);
        },
      );
      Widget continueButton = TextButton(
        child: Text("Ok"),
        onPressed: () async {
          Get.to(DailyTaskPage());
          Navigator.of(context, rootNavigator: true).pop(true);
        },
      );
      // set up the AlertDialog
      AlertDialog alert = AlertDialog(
        title: Text(
          "Want to update daily task and logout time for attendance?",
          style: TextStyle(
              fontWeight: FontWeight.w400, fontFamily: 'Rubik', fontSize: 16),
        ),
        actions: [
          cancelButton,
          continueButton,
        ],
      );
      AlertDialog timealert = AlertDialog(
        title: Text(
          "Remaining time is: ${calculateTime(check.toString()).toString()} mins. Want to update daily task and logout time for attendance?",
          style: TextStyle(
              fontWeight: FontWeight.w400, fontFamily: 'Rubik', fontSize: 16),
        ),
        actions: [
          cancelButton,
          continueButton,
        ],
      );

      AlertDialog tryafter = AlertDialog(
        title: Text(
          "Try after 1 hour.",
          style: TextStyle(
              fontWeight: FontWeight.w400, fontFamily: 'Rubik', fontSize: 16),
        ),
        actions: [
          cancelButton,
        ],
      );
      // show the dialog
      showDialog(
        context: context,
        builder: (BuildContext context) {
          if (calculateTime(check.toString()) > 451) {
            return tryafter;
          } else if (calculateTime(check.toString()) > 0){
            return timealert;
          }else{
            return alert;
          }
        },
      );
    }
  }

  int calculateTime(String loginTime) {

    final loginArray = loginTime.split(':');
    final logoutArray = current_time.split(':');

    int loginhour = int.parse(loginArray[0]);
    int loginmin = int.parse(loginArray[1]);
    int logouthour = int.parse(logoutArray[0]);
    int logoutmin = int.parse(logoutArray[1]);

    int thour = logouthour - loginhour;
    int tmin = logoutmin - loginmin;

    int totalmins = (thour * 60) + tmin;
    int remaining = 511 - totalmins;

    return remaining;
  }

  _requestPermission() async {
    var status = await Permission.location.request();
    if (status.isGranted) {
      print('done');
    } else if (status.isDenied) {
      _requestPermission();
    } else if (status.isPermanentlyDenied) {
      openAppSettings();
    }
  }

  _getLocation() async {
    try {
      final loc.LocationData _locationResult = await location.getLocation();
      setState(() {
        latitude = _locationResult.latitude.toString();
        longitude = _locationResult.longitude.toString();
        shared_current_time = 'Last login time: ' + current_time;
        shared_office_mode = 'You are now signed in!';
      });
      makeAttendance(e_id, username, longitude, latitude, 'Absent',
          current_time, '', login_date, login_month, login_year);
    } catch (e) {
      print(e);
    }
  }

  Future<String> makeAttendance(
      String e_id,
      String username,
      String longitude,
      String latitude,
      String attendance,
      String login_at,
      String logout_at,
      String login_date,
      String login_month,
      String login_year) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? workmode = prefs.getString('empworkmode');
    String? companylongitude = prefs.getString('companylongitude');
    String? companylatitude = prefs.getString('companylatitude');
    String? empdepartment = prefs.getString('empdepartment');

    String deviceid = '';
    // var deviceInfo = DeviceInfoPlugin();
    // if (Platform.isAndroid) {
    //   var androidDeviceInfo = await deviceInfo.androidInfo;
    //   deviceid =
    //   '${androidDeviceInfo.model}:${androidDeviceInfo.id}'; // unique ID on Android
    // }

    if (workmode == 'Field') {
      try {
        var response = await Dio().post(link + 'attendance', data: {
          'employee_id': e_id,
          'attendance_date': login_year + "-" + login_month + "-" + login_date,
          'username': username,
          'department_id': empdepartment,
          'longitude': longitude,
          'latitude': latitude,
          'attendance': 'Absent',
          'login_at': login_at,
          'logout_at': logout_at,
          'device': deviceid,
          'login_date': login_year + "-" + login_month + "-" + login_date,
          'login_month': login_month,
          'login_year': login_year,
        });
        if (response.statusCode == 200) {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          prefs.setString(
              'shared_current_time', 'Last login time: ' + current_time);
          prefs.setString('shared_office_mode', 'You are now signed in!');
          _showMyDialog();
        }
        if (response.statusCode == 401) {
          Get.snackbar("Error while creating!", "Please try again..");
        }
      } catch (e) {
        Get.snackbar("Error while creating!", "Please try again..");
        print(e);
      }
    } else if (workmode == 'Office') {
      if (companylongitude?.substring(0, 5) == longitude.substring(0, 5)) {
        try {
          var response = await Dio().post(link + 'attendance', data: {
            'employee_id': e_id,
            'attendance_date':
                login_year + "-" + login_month + "-" + login_date,
            'username': username,
            'department_id': empdepartment,
            'longitude': longitude,
            'device': deviceid,
            'latitude': latitude,
            'attendance': 'Absent',
            'login_at': login_at,
            'logout_at': logout_at,
            'login_date': login_year + "-" + login_month + "-" + login_date,
            'login_month': login_month,
            'login_year': login_year,
          });
          print('response.statusCode ' + response.statusCode.toString());
          if (response.statusCode == 401) {
            Get.snackbar("Error while creating!", "Please try again..");
          }
        } catch (e) {
          Get.snackbar("Error while creating!", "Please try again..");
          print(e);
        }
      } else {
        Get.snackbar(
            "Can't make attendance in office mode!", "Latitude mismatch!");
      }
    }

    return 'Loaded';
  }

  _showMyDialog() async {
    await Future.delayed(Duration(milliseconds: 50));
    showDialog(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('You are now signed in!'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(
                    'Your log time is started. Please do not forget to log out.'),
                Text('Latitude: ' + latitude.substring(0, 5)),
                Text('Longitude: ' + longitude.substring(0, 5)),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Ok'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Attendance",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.normal),
        ),
        elevation: 0.5,
        iconTheme: IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: <Color>[
                Theme.of(context).primaryColor,
                Theme.of(context).colorScheme.secondary,
              ])),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      body: Stack(
        children: [
          Container(
            height: 100,
            child: HeaderWidget(100, false, Icons.house_rounded),
          ),
          Container(
            alignment: Alignment.center,
            margin: EdgeInsets.fromLTRB(25, 10, 25, 10),
            padding: EdgeInsets.fromLTRB(10, 0, 10, 0),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    confirmAttendance();
                  },
                  child: Container(
                    child: CdotComponents.buildFooterLogo(),
                    // child: Icon(Icons.calendar_month, size: 80, color: Colors.grey.shade300,),
                  ),
                ),
                Text(
                  'Tap on Calendar',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.normal),
                ),
                SizedBox(
                  height: 5,
                ),
                Text(
                  shared_office_mode,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
                ),
                SizedBox(
                  height: 5,
                ),
                // if (shared_current_time.length > 2)
                Text(
                  shared_current_time,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
                ),
                SizedBox(
                  height: 20,
                ),
                SizedBox(height: 10),
                Expanded(
                  child: new FutureBuilder(
                    future: getUsers(),
                    builder: (context, AsyncSnapshot snapshot) {
                      switch (snapshot.connectionState) {
                        case ConnectionState.waiting:
                          return Center(child: CircularProgressIndicator());
                        default:
                          if (snapshot.hasError) {
                            print(snapshot.error);
                            return buildText('Something Went Wrong Try later');
                          } else {
                            if (!snapshot.hasData) {
                              return buildText('No Users Found');
                            } else
                              return ListView.builder(
                                  shrinkWrap: true,
                                  itemCount: users.length,
                                  itemBuilder:
                                      (BuildContext context, int index) {
                                    return Card(
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: <Widget>[
                                          Container(
                                            padding: EdgeInsets.symmetric(
                                                horizontal: 18.0,
                                                vertical: 15.0),
                                            child: Column(children: <Widget>[
                                              const SizedBox(height: 3),
                                              Row(children: <Widget>[
                                                Flexible(
                                                  child: Text("Attendance: ",
                                                      style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600)),
                                                ),
                                                Flexible(
                                                  child: Text(
                                                      users[index]['attendance']
                                                              .toString() ??
                                                          'None',
                                                      maxLines: 1),
                                                ),
                                              ]),
                                              const SizedBox(height: 3),
                                              Row(children: <Widget>[
                                                Flexible(
                                                  child: Text(
                                                      "Attendance Date: ",
                                                      style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600)),
                                                ),
                                                Flexible(
                                                  child: Text(
                                                      users[index]['login_date']
                                                              .toString() ??
                                                          'None',
                                                      maxLines: 1),
                                                ),
                                              ]),
                                              const SizedBox(height: 3),
                                              Row(children: <Widget>[
                                                Flexible(
                                                  child: Text("Login At: ",
                                                      style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600)),
                                                ),
                                                Flexible(
                                                  child: Text(
                                                      users[index]['login_at']
                                                              .toString() ??
                                                          'None',
                                                      maxLines: 1),
                                                ),
                                              ]),
                                              const SizedBox(height: 3),
                                              Row(children: <Widget>[
                                                Flexible(
                                                  child: Text("Logout At: ",
                                                      style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600)),
                                                ),
                                                Flexible(
                                                  child: Text(
                                                      users[index]['logout_at']
                                                              .toString() ??
                                                          'None',
                                                      maxLines: 1),
                                                ),
                                              ]),
                                              const SizedBox(height: 3),
                                              Row(children: <Widget>[
                                                Flexible(
                                                  child: Text("Log Time: ",
                                                      style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600)),
                                                ),
                                                Flexible(
                                                  child: Text(
                                                      users[index]['log_time']
                                                              .toString() ??
                                                          'None',
                                                      maxLines: 1),
                                                ),
                                              ]),
                                            ]),
                                          ),
                                        ],
                                      ),
                                    );
                                  });
                          }
                      }
                    },
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
