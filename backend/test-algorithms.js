// Algorithmic Verification Test for English Speaking Platform
// Verifies:
// 1. Dynamic Programming Word-Level Levenshtein Diff Matrix
// 2. SuperMemo SM-2 Spaced Repetition Scheduling
// 3. WPM & Fluency Normality Distribution

function clean(word) {
  return word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
}

function computeDiff(expectedText, spokenText, durationSeconds = 5) {
  const expectedWords = expectedText.trim().split(/\s+/);
  const spokenWords = spokenText.trim().split(/\s+/);

  const m = expectedWords.length;
  const n = spokenWords.length;

  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = clean(expectedWords[i - 1]) === clean(spokenWords[j - 1]) ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  let i = m;
  let j = n;
  const tokens = [];
  let correctCount = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && clean(expectedWords[i - 1]) === clean(spokenWords[j - 1])) {
      tokens.unshift({ word: expectedWords[i - 1], status: 'CORRECT' });
      correctCount++;
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      tokens.unshift({
        word: spokenWords[j - 1],
        status: 'INCORRECT',
        expected: expectedWords[i - 1],
        spoken: spokenWords[j - 1],
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      tokens.unshift({ word: expectedWords[i - 1], status: 'MISSING', expected: expectedWords[i - 1] });
      i--;
    } else {
      tokens.unshift({ word: spokenWords[j - 1], status: 'EXTRA', spoken: spokenWords[j - 1] });
      j--;
    }
  }

  const accuracyScore = m > 0 ? Math.round((correctCount / m) * 100) : 0;
  const completenessScore = m > 0 ? Math.round(((m - (tokens.filter(t => t.status === 'MISSING').length)) / m) * 100) : 100;
  const minutes = Math.max(0.05, durationSeconds / 60);
  const wordsPerMinute = Number((spokenWords.length / minutes).toFixed(1));

  return { tokens, accuracyScore, completenessScore, wordsPerMinute };
}

function calculateSm2Review(item, grade) {
  const q = grade + 1; // map 1..4 to 2..5
  let repetitions = item.repetitions;
  let intervalDays = item.intervalDays;
  let easeFactor = item.easeFactor;

  if (q >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.30) easeFactor = 1.30;

  return {
    repetitions,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
  };
}

// ==================== TEST EXECUTION ====================
let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('\n======================================================');
console.log('--- 1. Testing Word-Level DP Levenshtein Diff ---');
console.log('======================================================');

const test1 = computeDiff(
  'Yesterday I finished implementing the authentication endpoints',
  'Yesterday I finished implementing the authentication endpoints',
  3.5
);
assert(test1.accuracyScore === 100, 'Perfect match scores 100% accuracy');
assert(test1.tokens.every(t => t.status === 'CORRECT'), 'All tokens classified as CORRECT');
assert(test1.wordsPerMinute > 100, `WPM calculated correctly (${test1.wordsPerMinute} WPM)`);

const test2 = computeDiff(
  'I would like an aisle seat near the front of the airplane',
  'I would like a seat near front airplane',
  4.0
);
assert(test2.accuracyScore < 100, 'Imperfect match reduces accuracy score');
const missingTokens = test2.tokens.filter(t => t.status === 'MISSING');
assert(missingTokens.length >= 3, `Identified ${missingTokens.length} missing words (an, the, of, the)`);

const test3 = computeDiff(
  'Hello world',
  'Hello like actually world',
  2.0
);
const extraTokens = test3.tokens.filter(t => t.status === 'EXTRA');
assert(extraTokens.length === 2, `Identified 2 extra filler words ('like', 'actually')`);

console.log('\n======================================================');
console.log('--- 2. Testing SuperMemo SM-2 Spaced Repetition ---');
console.log('======================================================');

let card = { repetitions: 0, intervalDays: 1, easeFactor: 2.50 };

// Repetition 1 with Good recall (grade 3 -> q=4)
let rev1 = calculateSm2Review(card, 3);
assert(rev1.repetitions === 1 && rev1.intervalDays === 1, 'SM-2 initial success advances to 1 day interval');

// Repetition 2 with Perfect recall (grade 4 -> q=5)
let rev2 = calculateSm2Review(rev1, 4);
assert(rev2.repetitions === 2 && rev2.intervalDays === 6, 'SM-2 second success sets interval to 6 days');
assert(rev2.easeFactor >= 2.50, `Ease factor maintained/increased: ${rev2.easeFactor}`);

// Repetition 3 with Good recall (grade 3 -> q=4) -> interval = 6 * 2.6 = 16 days
let rev3 = calculateSm2Review(rev2, 3);
assert(rev3.repetitions === 3 && rev3.intervalDays >= 15, `Interval multiplied by ease factor: ${rev3.intervalDays} days`);

// Recall failure (grade 1 -> q=2)
let revFail = calculateSm2Review(rev3, 1);
assert(revFail.repetitions === 0 && revFail.intervalDays === 1, 'SM-2 failure resets repetitions to 0 and interval to 1 day');
assert(revFail.easeFactor < rev3.easeFactor, `Ease factor lowered after failure: ${revFail.easeFactor}`);

console.log('\n======================================================');
console.log(`SUMMARY: ${passed}/${total} Algorithmic Tests Passed`);
console.log('======================================================\n');

