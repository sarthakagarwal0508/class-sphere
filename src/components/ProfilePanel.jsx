export default function ProfilePanel({ name, email }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <section>
      <h2 className="text-lg font-extrabold">Profile</h2>

      <div className="mt-3 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-3xl font-extrabold">
          {initial}
        </div>
        <p className="mt-2 text-sm font-bold">{name}</p>
        <p className="text-xs text-muted">{email}</p>
      </div>
    </section>
  );
}