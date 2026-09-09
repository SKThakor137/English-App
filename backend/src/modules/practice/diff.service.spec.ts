import { DiffService } from './diff.service';

describe('DiffService', () => {
  let service: DiffService;

  beforeEach(() => {
    service = new DiffService();
  });

  it('should return 100% accuracy when spoken text matches expected text perfectly', () => {
    const expected = 'I would like a cup of coffee please.';
    const spoken = 'I would like a cup of coffee please.';
    const result = service.computeDiff(expected, spoken, 3);

    expect(result.accuracyScore).toBe(100);
    expect(result.completenessScore).toBe(100);
    expect(result.tokens.every((t) => t.status === 'CORRECT')).toBe(true);
    expect(result.wordsPerMinute).toBeGreaterThan(0);
  });

  it('should ignore casing and trailing punctuation when matching tokens', () => {
    const expected = 'Hello, world!';
    const spoken = 'hello world';
    const result = service.computeDiff(expected, spoken, 2);

    expect(result.accuracyScore).toBe(100);
    expect(result.tokens).toHaveLength(2);
    expect(result.tokens[0].status).toBe('CORRECT');
    expect(result.tokens[1].status).toBe('CORRECT');
  });

  it('should identify missing words when learner skips part of a sentence', () => {
    const expected = 'We should review the pull request today';
    const spoken = 'We should review today';
    const result = service.computeDiff(expected, spoken, 3);

    expect(result.accuracyScore).toBeLessThan(100);
    const missingTokens = result.tokens.filter((t) => t.status === 'MISSING');
    expect(missingTokens.length).toBeGreaterThanOrEqual(2);
  });

  it('should identify extra words when learner adds filler tokens', () => {
    const expected = 'I will attend the meeting';
    const spoken = 'I will like actually attend the meeting';
    const result = service.computeDiff(expected, spoken, 4);

    const extraTokens = result.tokens.filter((t) => t.status === 'EXTRA');
    expect(extraTokens.length).toBeGreaterThanOrEqual(1);
  });

  it('should calculate realistic Words Per Minute (WPM)', () => {
    const expected = 'One two three four five';
    const spoken = 'One two three four five';
    // 5 words in 3 seconds -> (5 / (3 / 60)) = 100 WPM
    const result = service.computeDiff(expected, spoken, 3);

    expect(result.wordsPerMinute).toBe(100);
  });
});

