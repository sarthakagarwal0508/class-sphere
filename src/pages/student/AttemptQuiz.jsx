import { Link } from "react-router-dom";
import { CircleHelp } from "lucide-react";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";

export default function AttemptQuiz() {
  return (
    <div className="space-y-5">
      <Topbar title="Quiz attempt" subtitle="Quiz attempt service unavailable" />
      <HeroBanner
        variant="navy"
        title="Quiz attempts are not connected"
        subtitle="The backend does not currently provide endpoints to start or submit a student quiz."
        icons={[CircleHelp, CircleHelp, CircleHelp]}
      />
      <Card className="space-y-3 p-6">
        <p className="text-sm leading-6 text-muted">
          Generated quizzes are currently returned to the teacher only and are not persisted. Student attempt and result APIs are needed before this page can submit real answers.
        </p>
        <Link to="/student/quizzes" className="inline-flex w-fit rounded-xl bg-brand px-4 py-2 text-sm font-bold text-on-brand">
          Back to quizzes
        </Link>
      </Card>
    </div>
  );
}
