import { BarChart2 } from "lucide-react";
import Card from "../../components/Card";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";

export default function QuizResults() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Topbar title="Quiz Results" subtitle="Quiz analytics and student attempts" />
      <HeroBanner
        variant="navy"
        title="Quiz results"
        subtitle="Review student attempts and class performance when quiz results are available."
        icons={[BarChart2, BarChart2, BarChart2]}
      />
      <Card className="space-y-3 p-6">
        <h2 className="text-lg font-extrabold">Quiz results API not available</h2>
        <p className="text-sm leading-6 text-muted">
          The supplied backend reference does not include endpoints to publish quizzes, record student attempts, or retrieve quiz results. The quiz-generation API only returns generated content and does not save it. This page will show actual results once those backend endpoints are added.
        </p>
      </Card>
    </div>
  );
}
