const letters = ["M", "T", "W", "T", "F", "S", "S"];

function getWeek(today) {
  const daysSinceMonday = (today.getDay() + 6) % 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function CalendarCard() {
  const today = new Date();
  const week = getWeek(today);

  return (
    <div className="flex justify-between rounded-xl bg-soft p-1.5">
      {week.map((d, i) => {
        const isToday = d.toDateString() === today.toDateString();

        return (
          <div
            key={i}
            className={`flex w-8 flex-col items-center rounded-lg py-1.5 text-xs ${
              isToday ? "bg-panel text-white" : "text-muted"
            }`}
          >
            <span>{letters[i]}</span>
            <span className="font-bold">{d.getDate()}</span>
          </div>
        );
      })}
    </div>
  );
}