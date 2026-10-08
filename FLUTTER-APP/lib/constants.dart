import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';

class AppConstants {
  static const String appTitle = 'HRMS';
  
  // Base API URL dynamically routes to the active backend:
  // - Android Emulator: http://10.0.2.2:8000/api/
  // - Web / Windows Desktop / Other: http://localhost:8000/api/
  static String get apiLink {
    if (kIsWeb) {
      return 'http://localhost:8000/api/';
    } else if (!kIsWeb && Platform.isAndroid) {
      return 'http://10.0.2.2:8000/api/';
    } else {
      return 'http://localhost:8000/api/';
    }
  }

  static const bool dummyMode = false;
}
