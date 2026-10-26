import Topbar from "../../components/Topbar";

export default function AttemptQuiz() {
  return (
    <div className="space-y-5">
      <Topbar title="Quiz attempt" backFallbackPath="/student/quizzes" />
    </div>
  );
}
