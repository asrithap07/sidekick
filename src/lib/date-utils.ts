export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Parse YYYY-MM-DD as local date (not UTC) to avoid timezone shifts
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m - 1, d);
}

export function formatGroupLabel(date: Date, today: Date, tomorrow: Date): string {
  const d = startOfDay(date);
  const t = startOfDay(today);
  const tm = startOfDay(tomorrow);

  if (d.getTime() === t.getTime()) return "Today";
  if (d.getTime() === tm.getTime()) return "Tomorrow";

  // Same week → weekday name
  const diffDays = Math.round((d.getTime() - t.getTime()) / 86_400_000);
  if (diffDays > 0 && diffDays < 7) {
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Otherwise full date
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function isOverdue(date: Date, today: Date): boolean {
  return startOfDay(date) < startOfDay(today);
}