import { Link } from "react-router-dom";
import { ClipboardList, CircleHelp, Sparkles } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const intro =
  "Classrooms, assignments, quizzes, AI flashcards and progress insights, connected for teachers and students.";

const copy = {
  student: {
    headline: "One place to teach, learn and revise.",
    features: [
      { icon: ClipboardList, text: "Assignments with deadlines and feedback" },
      { icon: CircleHelp, text: "Quizzes marked automatically" },
      { icon: Sparkles, text: "AI summaries and flashcards" },
    ],
  },
  teacher: {
    headline: "Teach, track and support every learner.",
    features: [
      { icon: ClipboardList, text: "Create classrooms and share a join code" },
      { icon: CircleHelp, text: "Build quizzes that mark themselves" },
      { icon: Sparkles, text: "Class analytics and early support insights" },
    ],
  },
};

export default function AuthLayout({ role = "student", children }) {
  const { headline, features } = copy[role];

  return (
    <div className="grid min-h-screen bg-card lg:grid-cols-2">

      <section className="relative hidden overflow-hidden bg-panel p-12 text-white lg:flex lg:flex-col">
        <Link to="/" className="relative z-10 text-2xl font-extrabold tracking-tight">
          Class<span className="text-brand">Sphere</span>
        </Link>

        <div className="relative z-10 my-auto max-w-md pb-20">
          <h1 className="text-4xl font-extrabold leading-tight">{headline}</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">{intro}</p>

          <ul className="mt-6 space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-base">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-panel-2">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute -bottom-16 -right-10 h-72 w-72 rounded-full bg-brand" />
        <div className="absolute bottom-24 right-40 h-36 w-36 rounded-full bg-panel-2" />
      </section>

<main className="relative flex items-center justify-center px-6 py-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 block text-xl font-extrabold tracking-tight lg:hidden">
            Class<span className="text-logo">Sphere</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
