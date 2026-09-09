import 'package:flutter/material.dart';
import 'core/storage/secure_storage_service.dart';
import 'core/routing/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final storage = SecureStorageService();
  final appRouter = AppRouter(storage: storage);

  runApp(EnglishFluencyApp(appRouter: appRouter));
}

class EnglishFluencyApp extends StatelessWidget {
  final AppRouter appRouter;

  const EnglishFluencyApp({super.key, required this.appRouter});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'EnglishFluency',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF16A34A),
          primary: const Color(0xFF16A34A),
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        fontFamily: 'Roboto',
      ),
      routerConfig: appRouter.router,
    );
  }
}

