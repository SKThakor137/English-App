import 'package:flutter/material.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Skill Analytics & Radar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF0F172A))),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF0F172A)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // CEFR Level Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF4F46E5), Color(0xFF3730A3)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(color: const Color(0xFF4F46E5).withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6)),
              ],
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('CURRENT PROFICIENCY', style: TextStyle(color: Color(0xFFC7D2FE), fontSize: 11, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text('CEFR B1 (Intermediate)', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.extrabold)),
                SizedBox(height: 8),
                Text(
                  'Your speaking cadence is progressing toward B2 (Upper Intermediate). Focus on reducing filler words and expanding subordinate clauses.',
                  style: TextStyle(color: Color(0xFFE0E7FF), fontSize: 13, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Skill Dimensions Matrix
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Core Competency Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
                const SizedBox(height: 16),
                _buildSkillRow('Pronunciation & Phonemes', 88, const Color(0xFF10B981)),
                _buildSkillRow('Conversational Fluency', 84, const Color(0xFF3B82F6)),
                _buildSkillRow('Grammatical Accuracy', 91, const Color(0xFF6366F1)),
                _buildSkillRow('Lexical Variety', 79, const Color(0xFFF59E0B)),
                _buildSkillRow('Topic Coherence', 85, const Color(0xFF8B5CF6)),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Recurring Weakness Drills Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFFECACA)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: Color(0xFFDC2626), size: 20),
                    SizedBox(width: 8),
                    Text('Recommended Remedial Drills', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF991B1B))),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Our phonetic engine detected repeated errors on the unvoiced dental fricative /θ/ and past irregular tense verbs.',
                  style: TextStyle(color: Color(0xFF7F1D1D), fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Start 5-Minute Weakness Drill', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSkillRow(String label, int score, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF334155))),
              Text('$score%', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: color)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: score / 100,
              backgroundColor: const Color(0xFFF1F5F9),
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }
}

