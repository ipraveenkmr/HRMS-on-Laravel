import 'dart:io';
import 'dart:async';
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
import '../common/api_client.dart';
import '../constants.dart';
import 'leave_page.dart';
import 'task_page.dart';
import 'asset_page.dart';
import 'apply_leave.dart';
import 'apply_loan.dart';
import 'profile_page.dart';

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
  String shared_current_time = "Not checked in";
  String shared_office_mode = "Select calendar card to punch";
  List users = [];

  Timer? _clockTimer;
  String _currentTimeString = "";
  late Future<List> _usersFuture;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _currentTimeString = DateFormat('hh:mm:ss a').format(DateTime.now());
    _clockTimer =
        Timer.periodic(Duration(seconds: 1), (Timer t) => _updateClock());

    getCurrentDate();
    _usersFuture = _loadAttendanceData();
    _requestPermission();
    location.changeSettings(interval: 300, accuracy: loc.LocationAccuracy.high);
    location.enableBackgroundMode(enable: true);
  }

  void _updateClock() {
    if (mounted) {
      setState(() {
        _currentTimeString = DateFormat('hh:mm:ss a').format(DateTime.now());
      });
    }
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  Future<List> _loadAttendanceData() async {
    await getUsersData();
    final data = await getUsers();
    final attendanceRecords = data is List ? data : <dynamic>[];

    // Restore today's punch state from the server if local state was lost.
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    Map? todayRecord;
    for (final item in attendanceRecords) {
      if (item is Map) {
        final rawDate = item['login_date'] ?? item['attendance_date'];
        final parsedDate = DateTime.tryParse(rawDate?.toString() ?? '');
        if (parsedDate != null &&
            DateFormat('yyyy-MM-dd').format(parsedDate) == today) {
          todayRecord = item;
          break;
        }
      }
    }

    final prefs = await SharedPreferences.getInstance();
    if (todayRecord != null) {
      final loginTime = todayRecord['login_at']?.toString() ?? '';
      final logoutTime = todayRecord['logout_at']?.toString() ?? '';
      final hasLoggedOut = logoutTime.isNotEmpty && logoutTime != 'null';

      if (hasLoggedOut) {
        shared_current_time = 'Last logout time: $logoutTime';
        shared_office_mode = 'You are now logged out!';
      } else if (loginTime.isNotEmpty && loginTime != 'null') {
        shared_current_time = 'Last login time: $loginTime';
        shared_office_mode = 'You are now signed in!';
      }
    } else {
      shared_current_time = 'Not checked in';
      shared_office_mode = 'Select calendar card to punch';
    }
    await prefs.setString('shared_current_time', shared_current_time);
    await prefs.setString('shared_office_mode', shared_office_mode);

    if (mounted) {
      setState(() => users = attendanceRecords);
    }
    return attendanceRecords;
  }

  Widget buildText(String text) => Center(
        child: Text(
          text,
          style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
        ),
      );

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String uname = prefs.getString('username')?.toString() ?? '';
    if (uname.isEmpty) return [];
    var response =
        await ApiClient.client.get(link + "attendance/employee/" + uname);
    return response.data;
  }

  Future<void> getUsersData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        username = prefs.getString('username')?.toString() ?? 'User';
        e_id = prefs.getString('empid')?.toString() ?? '';
        shared_office_mode = prefs.getString('shared_office_mode') ??
            'Select calendar card to punch';
        shared_current_time =
            prefs.getString('shared_current_time') ?? 'Not checked in';
      });
    }
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
          } else if (calculateTime(check.toString()) > 0) {
            return timealert;
          } else {
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
      });
      await makeAttendance(e_id, username, longitude, latitude, 'Absent',
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

    if (workmode == 'Field') {
      try {
        var response = await ApiClient.client.post(link + 'attendance', data: {
          'employee_id': e_id,
          'attendance_date': login_year + "-" + login_month + "-" + login_date,
          'username': username,
          'department_id': empdepartment,
          'longitude': longitude,
          'latitude': latitude,
          'attendance': 'Present',
          'login_at': login_at,
          'logout_at': logout_at,
          'device': deviceid,
          'login_date': login_year + "-" + login_month + "-" + login_date,
          'login_month': login_month,
          'login_year': login_year,
        });
        if (response.statusCode == 200) {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString(
              'shared_current_time', 'Last login time: ' + current_time);
          await prefs.setString('shared_office_mode', 'You are now signed in!');
          await getUsersData();

          // Refresh list
          var refreshedData = await getUsers();
          setState(() {
            users = refreshedData ?? [];
            _usersFuture = Future.value(users);
          });

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
      if (AppConstants.dummyMode ||
          (companylongitude != null &&
              companylongitude.length >= 5 &&
              longitude.length >= 5 &&
              companylongitude.substring(0, 5) == longitude.substring(0, 5))) {
        try {
          var response =
              await ApiClient.client.post(link + 'attendance', data: {
            'employee_id': e_id,
            'attendance_date':
                login_year + "-" + login_month + "-" + login_date,
            'username': username,
            'department_id': empdepartment,
            'longitude': longitude,
            'device': deviceid,
            'latitude': latitude,
            'attendance': 'Present',
            'login_at': login_at,
            'logout_at': logout_at,
            'login_date': login_year + "-" + login_month + "-" + login_date,
            'login_month': login_month,
            'login_year': login_year,
          });
          print('response.statusCode ' + response.statusCode.toString());
          if (response.statusCode == 200) {
            SharedPreferences prefs = await SharedPreferences.getInstance();
            await prefs.setString(
                'shared_current_time', 'Last login time: ' + current_time);
            await prefs.setString(
                'shared_office_mode', 'You are now signed in!');
            await getUsersData();

            // Refresh list
            var refreshedData = await getUsers();
            setState(() {
              users = refreshedData ?? [];
              _usersFuture = Future.value(users);
            });

            _showMyDialog();
          }
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
    final primaryColor = Theme.of(context).primaryColor;
    final accentColor = Theme.of(context).colorScheme.secondary;
    final isPunchedIn = shared_office_mode.contains('signed in');

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: Text(
          "Dashboard",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [primaryColor, accentColor],
            ),
          ),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      body: SingleChildScrollView(
        controller: _scrollController,
        key: const PageStorageKey<String>('attendance-page-scroll'),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hello banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 25),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [primaryColor, accentColor],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Welcome Back,",
                            style:
                                TextStyle(color: Colors.white70, fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            username.split('@').first.toUpperCase(),
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                      if (AppConstants.dummyMode)
                        Chip(
                          backgroundColor: Colors.amber.shade400,
                          label: Text(
                            "TEST MODE",
                            style: TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.bold,
                                fontSize: 10),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Transform.translate(
                offset: const Offset(0, -15),
                child: Column(
                  children: [
                    // Punch card widget
                    Card(
                      elevation: 8,
                      shadowColor: Colors.black12,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          children: [
                            Text(
                              DateFormat('EEEE, MMMM d, yyyy')
                                  .format(DateTime.now()),
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _currentTimeString,
                              style: TextStyle(
                                color: primaryColor,
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1,
                              ),
                            ),
                            const SizedBox(height: 20),
                            // Interactive Punch Button
                            GestureDetector(
                              onTap: () {
                                if (isPunchedIn) {
                                  confirmAttendance();
                                } else {
                                  _getLocation();
                                }
                              },
                              child: Container(
                                width: 140,
                                height: 140,
                                decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isPunchedIn
                                        ? Colors.red.shade50
                                        : Colors.green.shade50,
                                    border: Border.all(
                                      color: isPunchedIn
                                          ? Colors.red.shade200
                                          : Colors.green.shade200,
                                      width: 4,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: isPunchedIn
                                            ? Colors.red.withOpacity(0.2)
                                            : Colors.green.withOpacity(0.2),
                                        blurRadius: 12,
                                        offset: const Offset(0, 6),
                                      )
                                    ]),
                                child: Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.fingerprint,
                                        size: 56,
                                        color: isPunchedIn
                                            ? Colors.red
                                            : Colors.green,
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        isPunchedIn ? "PUNCH OUT" : "PUNCH IN",
                                        style: TextStyle(
                                          color: isPunchedIn
                                              ? Colors.red
                                              : Colors.green,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            // Punch Status Details
                            Divider(color: Colors.grey.shade200),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                Column(
                                  children: [
                                    Text(
                                      "Punch Time",
                                      style: TextStyle(
                                          color: Colors.grey, fontSize: 12),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      shared_current_time.replaceAll(
                                          'Last login time: ', ''),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  height: 25,
                                  width: 1,
                                  color: Colors.grey.shade300,
                                ),
                                Column(
                                  children: [
                                    Text(
                                      "Status",
                                      style: TextStyle(
                                          color: Colors.grey, fontSize: 12),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      isPunchedIn
                                          ? "Checked In"
                                          : "PUNCHED OUT",
                                      style: TextStyle(
                                        color: isPunchedIn
                                            ? Colors.green
                                            : Colors.red,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),

                    // Quick Actions Section
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Quick Actions",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey.shade800,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.95,
                      children: [
                        _buildQuickAction(
                            context,
                            "Apply Leave",
                            Icons.time_to_leave,
                            Colors.blue,
                            () => Get.to(ApplyLeavePage())),
                        _buildQuickAction(
                            context,
                            "My Leaves",
                            Icons.holiday_village,
                            Colors.teal,
                            () => Get.to(LeavePage())),
                        _buildQuickAction(
                            context,
                            "My Tasks",
                            Icons.assignment_turned_in,
                            Colors.purple,
                            () => Get.to(TaskPage())),
                        _buildQuickAction(
                            context,
                            "My Assets",
                            Icons.laptop_mac,
                            Colors.orange,
                            () => Get.to(AssetPage())),
                        _buildQuickAction(
                            context,
                            "Apply Loan",
                            Icons.monetization_on,
                            Colors.green,
                            () => Get.to(ApplyLoanPage())),
                        _buildQuickAction(
                            context,
                            "My Profile",
                            Icons.account_circle,
                            Colors.indigo,
                            () => Get.to(ProfilePage())),
                      ],
                    ),
                    const SizedBox(height: 25),

                    // Recent History Section
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Recent Logs",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey.shade800,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),

                    FutureBuilder(
                      future: _usersFuture,
                      builder: (context, AsyncSnapshot snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Padding(
                            padding: EdgeInsets.symmetric(vertical: 20.0),
                            child: Center(child: CircularProgressIndicator()),
                          );
                        }
                        if (snapshot.hasError) {
                          return buildText('Something Went Wrong Try later');
                        }
                        if (!snapshot.hasData || users.isEmpty) {
                          return buildText('No Attendance History Found');
                        }

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: users.length > 5
                              ? 5
                              : users.length, // Show recent 5 logs on dashboard
                          itemBuilder: (BuildContext context, int index) {
                            final log = users[index];
                            final attendanceStr =
                                log['attendance']?.toString() ?? 'Absent';
                            final isPresent = attendanceStr == 'Present';
                            return Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey.shade200),
                              ),
                              child: ListTile(
                                leading: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: isPresent
                                        ? Colors.green.shade50
                                        : Colors.red.shade50,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    isPresent ? Icons.check : Icons.close,
                                    color:
                                        isPresent ? Colors.green : Colors.red,
                                  ),
                                ),
                                title: Text(
                                  log['login_date']?.toString() ??
                                      'Date Unknown',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14),
                                ),
                                subtitle: Text(
                                  "Login: ${log['login_at'] ?? 'N/A'}  •  Logout: ${log['logout_at']?.toString() == 'null' ? 'Active' : log['logout_at']}",
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade600),
                                ),
                                trailing: Text(
                                  isPresent ? "Present" : "Absent",
                                  style: TextStyle(
                                    color:
                                        isPresent ? Colors.green : Colors.red,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, String label, IconData icon,
      Color color, VoidCallback onTap) {
    return Card(
      elevation: 2,
      shadowColor: Colors.black12,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
