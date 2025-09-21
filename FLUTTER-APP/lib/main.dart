import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:get/get.dart';

// Pages
import 'package:hrms/page/attendance_page.dart';
import 'constants.dart';
import 'door/login.dart';

// Providers
import 'package:hrms/provider/theme_provider.dart';

// Themes
import 'package:hrms/themes.dart'; // This will be created for centralizing themes.

// Routes
import 'package:hrms/routes.dart'; // Centralize routing in this file.

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SharedPreferences prefs = await SharedPreferences.getInstance();
  var loginEmail = prefs.getString('loginemail');

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(MyApp(initialRoute: loginEmail == null ? AppRoutes.login : AppRoutes.attendance));
}

class MyApp extends StatelessWidget {
  final String initialRoute;

  const MyApp({Key? key, required this.initialRoute}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => ThemeProvider(),
      builder: (context, _) {
        final themeProvider = Provider.of<ThemeProvider>(context);

        return GetMaterialApp(
          title: AppConstants.appTitle,
          themeMode: themeProvider.themeMode,
          theme: AppThemes.lightTheme,
          darkTheme: AppThemes.darkTheme,
          initialRoute: initialRoute,
          getPages: AppRoutes.routes,
        );
      },
    );
  }
}
