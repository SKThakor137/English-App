import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../storage/secure_storage_service.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/home/home_screen.dart';

class AppRouter {
  final SecureStorageService storage;

  AppRouter({required this.storage});

  late final GoRouter router = GoRouter(
    initialLocation: '/home',
    redirect: (context, state) async {
      final token = await storage.getAccessToken();
      final isLoggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/register';

      if (token == null && !isLoggingIn && state.matchedLocation != '/onboarding') {
        return '/login';
      }

      if (token != null && isLoggingIn) {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
    ],
  );
}

