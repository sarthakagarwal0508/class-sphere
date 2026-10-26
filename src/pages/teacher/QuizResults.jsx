import Topbar from "../../components/Topbar";

export default function QuizResults() {
  return (
    <div className="space-y-5">
      <Topbar
        title="Quiz Results"
        backFallbackPath="/teacher/dashboard"
      />
    </div>
  );
}
