import { Injectable } from '@nestjs/common';

export type DiffTokenStatus = 'CORRECT' | 'MISSING' | 'EXTRA' | 'INCORRECT';

export interface DiffToken {
  word: string;
  status: DiffTokenStatus;
  expected?: string;
  spoken?: string;
}

export interface DiffResult {
  tokens: DiffToken[];
  accuracyScore: number;
  completenessScore: number;
  wordsPerMinute: number;
}

@Injectable()
export class DiffService {
  private clean(word: string): string {
    return word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
  }

  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1,     // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  computeDiff(expectedText: string, spokenText: string, durationSeconds: number = 5): DiffResult {
    const expectedWords = expectedText.trim().split(/\s+/);
    const spokenWords = spokenText.trim().split(/\s+/);

    const m = expectedWords.length;
    const n = spokenWords.length;

    // DP table for word alignment
    const dp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = this.clean(expectedWords[i - 1]) === this.clean(spokenWords[j - 1]) ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // Deletion (Missing in spoken)
          dp[i][j - 1] + 1,      // Insertion (Extra in spoken)
          dp[i - 1][j - 1] + cost, // Match or Substitution
        );
      }
    }

    // Backtrack to find optimal alignment
    let i = m;
    let j = n;
    const tokens: DiffToken[] = [];
    let correctCount = 0;

    while (i > 0 || j > 0) {
      if (
        i > 0 &&
        j > 0 &&
        this.clean(expectedWords[i - 1]) === this.clean(spokenWords[j - 1])
      ) {
        tokens.unshift({
          word: expectedWords[i - 1],
          status: 'CORRECT',
        });
        correctCount++;
        i--;
        j--;
      } else if (
        i > 0 &&
        j > 0 &&
        dp[i][j] === dp[i - 1][j - 1] + 1
      ) {
        tokens.unshift({
          word: spokenWords[j - 1],
          status: 'INCORRECT',
          expected: expectedWords[i - 1],
          spoken: spokenWords[j - 1],
        });
        i--;
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
        tokens.unshift({
          word: expectedWords[i - 1],
          status: 'MISSING',
          expected: expectedWords[i - 1],
        });
        i--;
      } else {
        tokens.unshift({
          word: spokenWords[j - 1],
          status: 'EXTRA',
          spoken: spokenWords[j - 1],
        });
        j--;
      }
    }

    const accuracyScore = m > 0 ? Math.round((correctCount / m) * 100) : 0;
    const completenessScore = m > 0 ? Math.round(((m - (tokens.filter(t => t.status === 'MISSING').length)) / m) * 100) : 100;
    const minutes = Math.max(0.05, durationSeconds / 60);
    const wordsPerMinute = Number((spokenWords.length / minutes).toFixed(1));

    return {
      tokens,
      accuracyScore,
      completenessScore,
      wordsPerMinute,
    };
  }
}

