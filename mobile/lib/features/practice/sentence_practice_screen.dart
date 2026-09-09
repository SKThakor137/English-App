import 'package:flutter/material.dart';

class SentencePracticeScreen extends StatefulWidget {
  final String sentenceId;
  final String? courseTitle;
  const SentencePracticeScreen({
    super.key,
    this.sentenceId = 's1',
    this.courseTitle,
  });

  @override
  State<SentencePracticeScreen> createState() => _SentencePracticeScreenState();
}

class _SentencePracticeScreenState extends State<SentencePracticeScreen> {
  final String _targetText = 'I usually go for a walk in the evening because it helps me relax.';
  final String _ipa = 'aɪ ˈjuːʒuəli ɡoʊ fɔr ə wɔk ɪn ði ˈiːvnɪŋ bɪˈkɔz ɪt hɛlps miː rɪˈlæks.';
  bool _isRecording = false;
  Map<String, dynamic>? _result;

  void _toggleRecording() async {
    if (!_isRecording) {
      setState(() {
        _isRecording = true;
        _result = null;
      });
      // Simulating 3-second recording
      await Future.delayed(const Duration(seconds: 3));
      if (mounted) {
        setState(() {
          _isRecording = false;
          _result = {
            'overallScore': 90,
            'accuracyScore': 92,
            'fluencyScore': 88,
            'wpm': 118,
            'words': [
              {'word': 'I', 'status': 'CORRECT'},
              {'word': 'usually', 'status': 'CORRECT'},
              {'word': 'go', 'status': 'CORRECT'},
              {'word': 'for', 'status': 'CORRECT'},
              {'word': 'a', 'status': 'CORRECT'},
              {'word': 'walk', 'status': 'CORRECT'},
              {'word': 'in', 'status': 'CORRECT'},
              {'word': 'the', 'status': 'CORRECT'},
              {'word': 'evening', 'status': 'CORRECT'},
              {'word': 'because', 'status': 'CORRECT'},
              {'word': 'it', 'status': 'CORRECT'},
              {'word': 'helps', 'status': 'CORRECT'},
              {'word': 'me', 'status': 'CORRECT'},
              {'word': 'relax', 'status': 'CORRECT'},
            ]
          };
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Sentence Practice',
          style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 16),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Target Sentence Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'INTERMEDIATE B1',
                          style: TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 11),
                        ),
                        IconButton(
                          icon: const Icon(Icons.volume_up, color: Color(0xFF16A34A)),
                          onPressed: () {},
                          tooltip: 'Listen to native speaker',
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _targetText,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '/$ _ipa /',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Results Area
              if (_result != null) ...[
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: const Color(0xFFF0FDF4),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: const Color(0xFF16A34A)),
                              ),
                              child: Center(
                                child: Text(
                                  '${_result!['overallScore']}%',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.extrabold,
                                    fontSize: 16,
                                    color: Color(0xFF16A34A),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Excellent Speaking!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                Text(
                                  'Accuracy: ${_result!['accuracyScore']}% • ${_result!['wpm']} WPM',
                                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text('Word Breakdown:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF64748B))),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: (_result!['words'] as List).map<Widget>((w) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFDCFCE7),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                w['word'] as String,
                                style: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              ] else ...[
                const Spacer(),
              ],

              // Microphone Button
              Center(
                child: GestureDetector(
                  onTap: _toggleRecording,
                  child: Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      color: _isRecording ? Colors.red : const Color(0xFF16A34A),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: (_isRecording ? Colors.red : const Color(0xFF16A34A)).withOpacity(0.35),
                          blurRadius: 20,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Icon(
                      _isRecording ? Icons.stop : Icons.mic,
                      color: Colors.white,
                      size: 36,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Center(
                child: Text(
                  _isRecording ? 'Listening... Speak clearly' : 'Tap Microphone & Speak',
                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w600),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

