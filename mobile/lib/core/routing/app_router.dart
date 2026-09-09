import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../storage/secure_storage_service.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/practice/practice_hub_screen.dart';
import '../../features/practice/sentence_practice_screen.dart';
import '../../features/challenges/daily_challenge_screen.dart';
import '../../features/subscription/subscription_screen.dart';
import '../../features/conversation/conversation_screen.dart';
import '../../features/vocabulary/vocabulary_screen.dart';
import '../../features/progress/progress_screen.dart';
import '../../features/documents/documents_screen.dart';
import '../../features/profile/profile_screen.dart';

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
      GoRoute(
        path: '/practice',
        builder: (context, state) => const PracticeHubScreen(),
      ),
      GoRoute(
        path: '/sentence-practice',
        builder: (context, state) => const SentencePracticeScreen(),
      ),
      GoRoute(
        path: '/challenges',
        builder: (context, state) => const DailyChallengeScreen(),
      ),
      GoRoute(
        path: '/subscription',
        builder: (context, state) => const SubscriptionScreen(),
      ),
      GoRoute(
        path: '/conversations',
        builder: (context, state) => const ConversationScreen(),
      ),
      GoRoute(
        path: '/vocabulary',
        builder: (context, state) => const VocabularyScreen(),
      ),
      GoRoute(
        path: '/progress',
        builder: (context, state) => const ProgressScreen(),
      ),
      GoRoute(
        path: '/documents',
        builder: (context, state) => const DocumentsScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}
