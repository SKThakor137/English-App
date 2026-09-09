import 'package:flutter/material.dart';

class DailyChallengeScreen extends StatefulWidget {
  const DailyChallengeScreen({super.key});

  @override
  State<DailyChallengeScreen> createState() => _DailyChallengeScreenState();
}

class _DailyChallengeScreenState extends State<DailyChallengeScreen> {
  bool _isRecording = false;
  int _recordSeconds = 0;
  bool _hasSubmitted = false;

  final String _prompt = 'Describe a challenging engineering or communication hurdle you recently overcame.';
  final String _targetCefr = 'INTERMEDIATE (B1)';

  void _toggleRecord() {
    setState(() {
      if (_isRecording) {
        _isRecording = false;
      } else {
        _isRecording = true;
        _hasSubmitted = false;
        _recordSeconds = 0;
      }
    });
  }

  void _submitAttempt() {
    setState(() {
      _isRecording = false;
      _hasSubmitted = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Daily Speaking Quest', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF0F172A))),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF0F172A)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF59E0B), Color(0xFFEA580C)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFF59E0B).withOpacity(0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.local_fire_department, color: Colors.yellow, size: 16),
                          SizedBox(width: 4),
                          Text('1.5x Points', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                        ],
                      ),
                    ),
                    Text(_targetCefr, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Daily Speaking Challenge',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.extrabold),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Speak unscripted for 45-60 seconds to claim your daily streak reward and climb the leaderboard.',
                  style: TextStyle(color: Color(0xFFFEF3C7), fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Prompt Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('TODAY\'S PROMPT', style: TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold, fontSize: 11)),
                const SizedBox(height: 8),
                Text(
                  '"$_prompt"',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1E293B), height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Recording Console
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                Text(
                  _isRecording ? 'Listening to your speech...' : 'Press microphone when ready',
                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
                ),
                const SizedBox(height: 16),
                Text(
                  '00:${_recordSeconds.toString().padLeft(2, '0')}',
                  style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, fontFamily: 'monospace', color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 24),
                GestureDetector(
                  onTap: _toggleRecord,
                  child: Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _isRecording ? const Color(0xFFE11D48) : const Color(0xFF4F46E5),
                      boxShadow: [
                        BoxShadow(
                          color: (_isRecording ? const Color(0xFFE11D48) : const Color(0xFF4F46E5)).withOpacity(0.3),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Icon(_isRecording ? Icons.stop : Icons.mic, color: Colors.white, size: 36),
                  ),
                ),
                if (!_isRecording && _recordSeconds > 0) ...[
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: _submitAttempt,
                    icon: const Icon(Icons.check_circle_outline),
                    label: const Text('Submit for Points & Rank'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Leaderboard
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Today\'s Leaderboard', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
                    Text('LIVE', style: TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 16),
                _buildLeaderboardItem(1, 'Priya Patel', 94, true),
                const Divider(height: 20),
                _buildLeaderboardItem(2, 'Carlos Rodriguez', 89, false),
                const Divider(height: 20),
                _buildLeaderboardItem(3, 'Akiko Tanaka', 85, false),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardItem(int rank, String name, int score, bool isTop) {
    return Row(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isTop ? const Color(0xFFFEF3C7) : const Color(0xFFF1F5F9),
          ),
          child: Center(
            child: Text(
              '$rank',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 12,
                color: isTop ? const Color(0xFFB45309) : const Color(0xFF64748B),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF1E293B))),
        ),
        Text('$score%', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF4F46E5))),
      ],
    );
  }
}

