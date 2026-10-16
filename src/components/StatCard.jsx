import Card from "./Card";

const tones = {
  yellow: "bg-tone-yellow text-tone-yellow-fg",
  red: "bg-tone-red text-tone-red-fg",
  green: "bg-tone-green text-tone-green-fg",
  blue: "bg-tone-blue text-tone-blue-fg",
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