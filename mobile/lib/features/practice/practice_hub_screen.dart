import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class PracticeHubScreen extends StatelessWidget {
  const PracticeHubScreen({super.key});

  final courses = const [
    {
      'title': 'Everyday Conversational Foundations',
      'level': 'BEGINNER',
      'topic': 'Daily Life',
      'lessons': 4,
      'duration': '35 min',
    },
    {
      'title': 'Travel, Airports & Socializing',
      'level': 'ELEMENTARY',
      'topic': 'Travel',
      'lessons': 5,
      'duration': '45 min',
    },
    {
      'title': 'Professional Workplace & Agile Communication',
      'level': 'INTERMEDIATE',
      'topic': 'Workplace',
      'lessons': 6,
      'duration': '60 min',
    },
    {
      'title': 'Technical Presentations & Architecture',
      'level': 'UPPER_INTERMEDIATE',
      'topic': 'Engineering',
      'lessons': 5,
      'duration': '75 min',
    },
    {
      'title': 'Executive Persuasion & Strategic Debates',
      'level': 'ADVANCED',
      'topic': 'Leadership',
      'lessons': 4,
      'duration': '60 min',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Speaking Curriculum',
          style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 18),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: courses.length,
        itemBuilder: (context, idx) {
          final c = courses[idx];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFFBBF7D0)),
                      ),
                      child: Text(
                        c['level'] as String,
                        style: const TextStyle(
                          color: Color(0xFF16A34A),
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ),
                    Text(
                      c['topic'] as String,
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  c['title'] as String,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      '${c['lessons']} Lessons • ${c['duration']}',
                      style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                    ),
                    ElevatedButton(
                      onPressed: () => context.push(
                        '/sentence-practice',
                        extra: {'courseTitle': c['title']},
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF16A34A),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      child: const Text('Start Practice', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

