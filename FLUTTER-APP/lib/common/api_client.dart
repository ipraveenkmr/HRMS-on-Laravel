import 'package:dio/dio.dart';
import '../constants.dart';
import 'mock_interceptor.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static final Dio _dio = _createDio();

  static Dio get client => _dio;

  static Dio _createDio() {
    final dio = Dio();
    dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) async {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);
    }));
    if (AppConstants.dummyMode) {
      dio.interceptors.add(MockInterceptor());
    }
    return dio;
  }
}
