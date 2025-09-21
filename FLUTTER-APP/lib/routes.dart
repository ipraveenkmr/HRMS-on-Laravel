import 'package:get/get.dart';
import 'package:hrms/page/attendance_page.dart';
import 'door/login.dart';

class AppRoutes {
  static const String login = '/login';
  static const String attendance = '/attendance';

  static final routes = [
    GetPage(name: login, page: () => LoginPage()),
    GetPage(name: attendance, page: () => AttendancePage()),
  ];
}
