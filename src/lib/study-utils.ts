import { isSameWeek as isSameWeekDf, isSameMonth as isSameMonthDf, isSameYear as isSameYearDf, format as formatDf } from 'date-fns';

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
  return getLocalDateStr(new Date());
}

/**
 * Retorna a data no formato YYYY-MM-DD respeitando o fuso horário local.
 */
export function getLocalDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
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

/**
 * Verifica se duas datas pertencem ao mesmo ano.
 */
export function isSameYear(date1: Date, date2: Date): boolean {
  return isSameYearDf(date1, date2);
}
