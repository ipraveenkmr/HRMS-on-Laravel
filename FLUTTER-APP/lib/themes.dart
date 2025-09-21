import 'package:flutter/material.dart';

class AppThemes {
  static final Color primaryColor = Color(0xFF5470FE);
  static final Color accentColor = Color(0xFF021FAE);

  // Light Theme
  static final ThemeData lightTheme = ThemeData(
    primaryColor: primaryColor,
    scaffoldBackgroundColor: Colors.grey.shade100,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.blueGrey)
        .copyWith(secondary: accentColor),
  );

  // Dark Theme
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: primaryColor,
    scaffoldBackgroundColor: Colors.black,
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF5470FE),
      secondary: Color(0xFF021FAE),
      background: Colors.black,
    ),
  );
}
