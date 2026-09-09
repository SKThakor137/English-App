import 'package:dio/dio.dart';
import '../storage/secure_storage_service.dart';

class ApiClient {
  static const String baseUrl = 'http://10.0.2.2:4000/api/v1'; // Android Emulator default
  final Dio dio;
  final SecureStorageService storage;

  ApiClient({required this.storage})
      : dio = Dio(BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
          headers: {'Content-Type': 'application/json'},
        )) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await storage.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          if (error.response?.statusCode == 401) {
            final refreshToken = await storage.getRefreshToken();
            if (refreshToken != null) {
              try {
                final refreshRes = await Dio().post(
                  '$baseUrl/auth/refresh',
                  data: {'refreshToken': refreshToken},
                );
                final newAccessToken = refreshRes.data['data']['accessToken'];
                await storage.saveAccessToken(newAccessToken);

                // Retry failed request
                error.requestOptions.headers['Authorization'] = 'Bearer $newAccessToken';
                final clonedReq = await dio.request(
                  error.requestOptions.path,
                  options: Options(
                    method: error.requestOptions.method,
                    headers: error.requestOptions.headers,
                  ),
                  data: error.requestOptions.data,
                  queryParameters: error.requestOptions.queryParameters,
                );
                return handler.resolve(clonedReq);
              } catch (_) {
                await storage.clearTokens();
              }
            }
          }
          return handler.next(error);
        },
      ),
    );
  }
}

