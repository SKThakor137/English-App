import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _currentStep = 0;
  String _selectedLevel = 'INTERMEDIATE';
  final List<String> _selectedGoals = ['Workplace Meetings'];
  int _selectedMinutes = 15;

  final levels = [
    {'id': 'BEGINNER', 'label': 'Beginner (A1)', 'desc': 'Simple words and greetings'},
    {'id': 'ELEMENTARY', 'label': 'Elementary (A2)', 'desc': 'Familiar everyday expressions'},
    {'id': 'INTERMEDIATE', 'label': 'Intermediate (B1)', 'desc': 'Conversational fluency & opinions'},
    {'id': 'UPPER_INTERMEDIATE', 'label': 'Upper Intermediate (B2)', 'desc': 'Professional English'},
    {'id': 'ADVANCED', 'label': 'Advanced (C1)', 'desc': 'Nuanced idiom & fast articulation'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Step ${_currentStep + 1} of 3',
          style: const TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (_currentStep == 0) ...[
                const Text(
                  'What is your English level?',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text(
                  'We will tailor your practice sentences to this level.',
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: ListView.builder(
                    itemCount: levels.length,
                    itemBuilder: (context, idx) {
                      final lvl = levels[idx];
                      final isSelected = _selectedLevel == lvl['id'];
                      return GestureDetector(
                        onTap: () => setState(() => _selectedLevel = lvl['id']!),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFFF0FDF4) : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF16A34A) : const Color(0xFFE2E8F0),
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      lvl['label']!,
                                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      lvl['desc']!,
                                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                              ),
                              if (isSelected)
                                const Icon(Icons.check_circle, color: Color(0xFF16A34A)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
              if (_currentStep == 1) ...[
                const Text(
                  'Daily practice commitment',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Consistency creates lasting speaking fluency.',
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [5, 10, 15, 30].map((mins) {
                    final isSel = _selectedMinutes == mins;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedMinutes = mins),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          decoration: BoxDecoration(
                            color: isSel ? const Color(0xFFF0FDF4) : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSel ? const Color(0xFF16A34A) : const Color(0xFFE2E8F0),
                              width: isSel ? 2 : 1,
                            ),
                          ),
                          child: Column(
                            children: [
                              Text(
                                '$mins',
                                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(height: 4),
                              const Text('Min', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const Spacer(),
              ],
              if (_currentStep == 2) ...[
                const Text(
                  'What are your primary goals?',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Personalize your conversation scenarios and vocabulary drills.',
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView(
                    children: [
                      _buildGoalOption('Workplace Meetings & Tech Discussions', '💼'),
                      _buildGoalOption('Everyday Small Talk & Social Fluency', '☕'),
                      _buildGoalOption('Job Interview Preparation', '🎯'),
                      _buildGoalOption('Accent Softening & Intonation Drills', '🎙️'),
                      _buildGoalOption('IELTS / TOEFL Speaking Exam Prep', '🎓'),
                    ],
                  ),
                ),
              ],

              // Bottom Navigation Actions
              ElevatedButton(
                onPressed: () {
                  if (_currentStep < 2) {
                    setState(() => _currentStep++);
                  } else {
                    context.go('/home');
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF16A34A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  _currentStep == 2 ? 'Start Speaking' : 'Continue',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGoalOption(String title, String icon) {
    final isSelected = _selectedGoals.contains(title);
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            _selectedGoals.remove(title);
          } else {
            _selectedGoals.add(title);
          }
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF0FDF4) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFF16A34A) : const Color(0xFFE2E8F0),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF0F172A)),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 20),
          ],
        ),
      ),
    );
  }
}

