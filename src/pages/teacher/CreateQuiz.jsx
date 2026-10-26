import Topbar from "../../components/Topbar";

export default function CreateQuiz() {
  return (
    <div className="space-y-5">
      <Topbar
        title="Create Quiz"
        backFallbackPath="/teacher/dashboard"
      />
    </div>
  );
}
