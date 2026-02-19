import { isSameWeek as isSameWeekDf, isSameMonth as isSameMonthDf, format as formatDf } from 'date-fns';

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeSummary(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Verifica se duas datas pertencem à mesma semana, 
 * considerando a Segunda-feira (1) como o primeiro dia.
 */
export function isSameWeek(date1: Date, date2: Date): boolean {
  return isSameWeekDf(date1, date2, { weekStartsOn: 1 });
}

/**
 * Verifica se duas datas pertencem ao mesmo mês e ano.
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return isSameMonthDf(date1, date2);
}
