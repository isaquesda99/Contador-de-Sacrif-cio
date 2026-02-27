export interface StudySession {
  id: string;
  timestamp: number;
  durationSeconds: number;
  breakDurationSeconds: number;
  dateStr: string; // YYYY-MM-DD
}

export interface StudyStats {
  daily: Record<string, number>;
  totalWeek: number;
  totalMonth: number;
}
