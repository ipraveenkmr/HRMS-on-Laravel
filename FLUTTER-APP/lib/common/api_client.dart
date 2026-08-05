import 'package:dio/dio.dart';
import '../constants.dart';
import 'mock_interceptor.dart';

class ApiClient {
  static final Dio _dio = _createDio();

  static Dio get client => _dio;

  static Dio _createDio() {
    final dio = Dio();
    if (AppConstants.dummyMode) {
      dio.interceptors.add(MockInterceptor());
    }
    return dio;
  }
}
