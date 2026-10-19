const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-10-20" se aaj tak kitne din bache (negative = nikal gaya)
export function daysLeft(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${isoDate}T00:00:00`);
  return Math.round((due - today) / 86400000);
}

export function daysLeftLabel(days) {
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

// Date -> "19 Oct"
export function formatDayMonth(date = new Date()) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}