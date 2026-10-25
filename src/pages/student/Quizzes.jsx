import { Link } from "react-router-dom";
import { CircleHelp, Clock, Award } from "lucide-react";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";

export default function Quizzes() {
  return (
    <div className="space-y-5">
      <Topbar title="Quizzes" subtitle="Timed quizzes from your teachers" />
      <HeroBanner
        variant="yellow"
        title="Test what you have learned"
        subtitle="Quiz attempts and results will appear here when supported by the backend."
        icons={[CircleHelp, Clock, Award]}
      />
      <Card className="space-y-3 p-6">
        <h2 className="text-lg font-extrabold">Quizzes are not connected yet</h2>
        <p className="text-sm leading-6 text-muted">
          The current API reference does not include student quiz listing, attempt, submission, or grading endpoints. Teacher quiz generation is available, but generated quizzes are not saved for students to take.
        </p>
        <Link to="/student/dashboard" className="inline-flex w-fit rounded-xl bg-brand px-4 py-2 text-sm font-bold text-on-brand">
          Back to dashboard
        </Link>
      </Card>
    </div>
  );
}
