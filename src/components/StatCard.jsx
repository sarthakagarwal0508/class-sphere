import Card from "./Card";

const tones = {
  yellow: "bg-brand-soft text-amber-700",
  red: "bg-red-100 text-red-500",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
};

export default function StatCard({ label, value, icon: Icon, tone = "yellow" }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm leading-tight text-muted">{label}</p>
        <p className="text-2xl font-extrabold leading-tight">{value}</p>
      </div>
    </Card>
  );
}