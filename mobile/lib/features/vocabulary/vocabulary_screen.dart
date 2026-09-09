import 'package:flutter/material.dart';

class VocabularyScreen extends StatefulWidget {
  const VocabularyScreen({super.key});

  @override
  State<VocabularyScreen> createState() => _VocabularyScreenState();
}

class _VocabularyScreenState extends State<VocabularyScreen> {
  int _cardIndex = 0;
  bool _isFlipped = false;

  final List<Map<String, String>> _words = [
    {
      'word': 'mitigate',
      'ipa': '/ˈmɪt.ə.ɡeɪt/',
      'definition': 'To make something less harmful, severe, or serious.',
      'example': 'We implemented unit tests to mitigate the risk of production outages.',
    },
    {
      'word': 'concur',
      'ipa': '/kənˈkɜːr/',
      'definition': 'To agree with an opinion, proposal, or conclusion.',
      'example': 'I concur with your recommendation regarding the monolith architecture.',
    },
    {
      'word': 'articulate',
      'ipa': '/ɑːrˈtɪk.jə.lət/',
      'definition': 'Expressing ideas clearly and effectively in speech.',
      'example': 'She was able to articulate the complex tradeoffs with precision.',
    },
  ];

  void _rateWord(int grade) {
    setState(() {
      _isFlipped = false;
      _cardIndex = (_cardIndex + 1) % _words.length;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('SM-2 review recorded! Next review scheduled based on grade $grade.'),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final word = _words[_cardIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Spaced Vocabulary Deck', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF0F172A))),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF0F172A)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('SuperMemo SM-2 SRS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF9333EA))),
                Text('Card ${_cardIndex + 1} of ${_words.length}', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
              ],
            ),
            const SizedBox(height: 20),

            // Flashcard
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _isFlipped = !_isFlipped),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 16, offset: const Offset(0, 6)),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        word['word']!,
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.extrabold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        word['ipa']!,
                        style: const TextStyle(fontFamily: 'monospace', fontSize: 14, color: Color(0xFF9333EA), fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 24),
                      if (!_isFlipped)
                        const Text('Tap card to reveal definition & example', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13))
                      else ...[
                        const Divider(),
                        const SizedBox(height: 16),
                        Text(
                          word['definition']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 15, color: Color(0xFF334155), height: 1.4),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '"${word['example']!}"',
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 13, fontStyle: FontStyle.italic, color: Color(0xFF64748B)),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // SM-2 4-Tier Buttons
            if (_isFlipped) ...[
              const Text('How well did you recall this word?', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _rateWord(1),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444), padding: const EdgeInsets.symmetric(vertical: 12)),
                      child: const Text('Again (1d)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _rateWord(2),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF97316), padding: const EdgeInsets.symmetric(vertical: 12)),
                      child: const Text('Hard (2d)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _rateWord(3),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF3B82F6), padding: const EdgeInsets.symmetric(vertical: 12)),
                      child: const Text('Good (6d)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _rateWord(4),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), padding: const EdgeInsets.symmetric(vertical: 12)),
                      child: const Text('Easy (12d)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

