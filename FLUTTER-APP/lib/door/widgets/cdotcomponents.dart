import 'package:hrms/page/apply_leave.dart';
import 'package:hrms/page/leave_page.dart';
import 'package:hrms/page/profile_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../page/apply_loan.dart';
import '../../page/asset_page.dart';
import '../../page/attendance_page.dart';
import '../../page/stopwatch.dart';
import '../../page/task_page.dart';
import '../login.dart';

class CdotComponents{

  static sidenav(){
    double  _drawerIconSize = 24;
    double _drawerFontSize = 17;
    Color _primaryColor = Color(0xFF5770EF);
    Color _accentColor = Color(0xFF021FAE);

    logoutUser() async {
        SharedPreferences preferences = await SharedPreferences.getInstance();
        final success =  await preferences.clear();
        // final success = await preferences.remove('loginemail');
        if(success){
          Get.offAll(LoginPage());
        }
    }

    return Drawer(
      child: Container(
        decoration:BoxDecoration(
            gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                stops: [0.0, 1.0],
                colors: [
                  _primaryColor.withOpacity(0.2),
                  _accentColor.withOpacity(0.5),
                ]
            )
        ) ,
        child: ListView(
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: _primaryColor,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  stops: [0.0, 1.0],
                  colors: [ _primaryColor,_accentColor,],
                ),
              ),
              child: Container(
                alignment: Alignment.bottomLeft,
                child: Text("CodingMSTR",
                  style: TextStyle(fontSize: 25,color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.calendar_month,size: _drawerIconSize,color: _accentColor),
              title: Text('Attendance', style: TextStyle(fontSize: _drawerFontSize, color: _accentColor),
              ),
              onTap: () {
                Get.to(AttendancePage());
              },
            ),
            ListTile(
              leading: Icon(Icons.holiday_village, size: _drawerIconSize,color: _accentColor),
              title: Text('Apply Leave',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                Get.to(ApplyLeavePage());
              },
            ),
            // ListTile(
            //   leading: Icon(Icons.holiday_village, size: _drawerIconSize,color: _accentColor),
            //   title: Text('Stop Watch',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
            //   onTap: () {
            //     Get.to(AttendanceScreen());
            //   },
            // ),
            // ListTile(
            //   leading: Icon(Icons.task_alt, size: _drawerIconSize,color: _accentColor),
            //   title: Text('Daily Task',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
            //   onTap: () {
            //     Get.to(DailyTaskPage());
            //   },
            // ),
            ListTile(
              leading: Icon(Icons.task, size: _drawerIconSize,color: _accentColor),
              title: Text('Task',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                Get.to(TaskPage());
              },
            ),
            ListTile(
              leading: Icon(Icons.laptop, size: _drawerIconSize,color: _accentColor,),
              title: Text('Asset',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                Get.to(AssetPage());
              },
            ),
            ListTile(
              leading: Icon(Icons.holiday_village, size: _drawerIconSize,color: _accentColor,),
              title: Text('Leave',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                Get.to(LeavePage());
              },
            ),
            ListTile(
              leading: Icon(Icons.currency_rupee, size: _drawerIconSize,color: _accentColor,),
              title: Text('Apply Loan',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                Get.to(ApplyLoanPage());
              },
            ),
            Divider(color: _primaryColor, height: 1,),
            ListTile(
              leading: Icon(Icons.person, size: _drawerIconSize,color: _accentColor,),
              title: Text('My Profile',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                Get.to(ProfilePage());
              },
            ),
            ListTile(
              leading: Icon(Icons.logout_rounded, size: _drawerIconSize,color: _accentColor,),
              title: Text('Logout',style: TextStyle(fontSize: _drawerFontSize,color: _accentColor),),
              onTap: () {
                logoutUser();
              },
            ),
          ],
        ),
      ),
    );
  }

  static buildFooterLogo() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Image.asset(
          'assets/cal.png',
          height: 130,
        ),
        SizedBox(height: 10),
      ],
    );
  }
}

