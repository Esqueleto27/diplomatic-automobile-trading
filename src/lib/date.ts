/**
 * SQLite/D1 guarda `CURRENT_TIMESTAMP` como texto "YYYY-MM-DD HH:MM:SS" (UTC,
 * sin "T" ni offset) — no es ISO 8601 válido para el parser de Date. Convierte
 * ese formato al que `new Date()` sí entiende de forma confiable.
 */
export function sqliteTimestampToDate(value: string): Date {
  return new Date(`${value.replace(" ", "T")}Z`);
}
