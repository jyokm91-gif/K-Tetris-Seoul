import { LeaderboardEntry } from '@/components/ui/Leaderboard';

const LEADERBOARD_KEY = 'seoul-tetris-leaderboard';
const MAX_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (!stored) return [];

    const entries: LeaderboardEntry[] = JSON.parse(stored);
    return entries.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'timestamp'>): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const newEntry: LeaderboardEntry = {
      ...entry,
      timestamp: Date.now(),
    };

    const entries = getLeaderboard();
    entries.push(newEntry);

    // Sort by score (descending) and keep only top entries
    const sorted = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sorted));
    return sorted;
  } catch (error) {
    console.error('Failed to save leaderboard entry:', error);
    return getLeaderboard();
  }
}

export function clearLeaderboard(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Failed to clear leaderboard:', error);
  }
}

export function isTopScore(score: number): boolean {
  const entries = getLeaderboard();
  if (entries.length < MAX_ENTRIES) return true;
  return score > entries[entries.length - 1].score;
}

export function getPlayerRank(score: number): number {
  const entries = getLeaderboard();
  const rank = entries.filter(e => e.score > score).length + 1;
  return rank;
}
