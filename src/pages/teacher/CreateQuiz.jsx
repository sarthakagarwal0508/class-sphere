import { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import {
  generateQuizFromPdf,
  generateQuizFromTopic,
} from '../../services/aiService';

export default function CreateQuiz() {
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    course: '',
    topic: '',
    duration: 15,
  });

  const [questions, setQuestions] = useState([]);

  const [newPrompt, setNewPrompt] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectOption, setNewCorrectOption] = useState(0);
  const [difficulty, setDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(5);
  const [quizFile, setQuizFile] = useState(null);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const handleGenerateQuiz = async () => {
    if (!quizDetails.topic.trim() && !quizFile) {
      setGenerationError('Enter a topic or choose a PDF before generating a quiz.');
      return;
    }
    if (quizFile && (
      (quizFile.type !== 'application/pdf' && !quizFile.name.toLowerCase().endsWith('.pdf'))
      || quizFile.size > 10 * 1024 * 1024
    )) {
      setGenerationError('Choose a PDF file no larger than 10 MB.');
      return;
    }

    setGenerating(true);
    setGenerationError('');
    setGeneratedQuiz(null);
    try {
      const numQuestions = Math.min(20, Math.max(1, Number(questionCount) || 1));
      const result = quizFile
        ? await generateQuizFromPdf({ file: quizFile, numQuestions, difficulty })
        : await generateQuizFromTopic({
          topic: quizDetails.topic.trim(),
          numQuestions,
          difficulty,
        });
      setGeneratedQuiz(result);
    } catch (error) {
      setGenerationError(error.message || 'Could not generate a quiz.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        prompt: newPrompt.trim(),
        options: newOptions.map((opt, i) => opt.trim() || `Option ${i + 1}`),
        correctOption: newCorrectOption,
      },
    ]);

    setNewPrompt('');
    setNewOptions(['', '', '', '']);
    setNewCorrectOption(0);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">

      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          Create Quiz
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Topic-tagged MCQs, automated evaluation, and analytics.
        </p>
      </div>

<div className="bg-[#181829] border border-slate-800 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm relative overflow-hidden text-white">
        <div className="space-y-2 max-w-md z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#fde047] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Assessment Builder
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Build a quiz in minutes
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Generate topic-based questions with the configured teacher-only AI service.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Quiz Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="e.g. Stack & Queue Mastery Test"
                value={quizDetails.title}
                onChange={(e) => setQuizDetails({ ...quizDetails, title: e.target.value })}
                className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Class / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={quizDetails.course}
                  onChange={(e) => setQuizDetails({ ...quizDetails, course: e.target.value })}
                  className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Time Limit (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={quizDetails.duration}
                  onChange={(e) => setQuizDetails({ ...quizDetails, duration: Number(e.target.value) })}
                  className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quiz topic for AI generation
              </label>
              <input
                type="text"
                value={quizDetails.topic}
                onChange={(e) => setQuizDetails({ ...quizDetails, topic: e.target.value })}
                placeholder="e.g. Binary search trees"
                className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Questions
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8f9fa] px-3 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                />
              </label>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Difficulty
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8f9fa] px-3 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                >
                  {['easy', 'medium', 'hard', 'mixed'].map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Or generate from PDF
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setQuizFile(e.target.files?.[0] ?? null)}
                  className="mt-1.5 w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-2 file:py-2 file:text-xs dark:text-slate-300 dark:file:bg-slate-800"
                />
              </label>
              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={generating || (!quizDetails.topic.trim() && !quizFile)}
                className="self-end rounded-xl bg-[#181829] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            {generationError && (
              <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">
                {generationError}
              </p>
            )}
            {generatedQuiz && (
              <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Generated quiz response
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This response is not saved as a student quiz; the documented API currently generates content only.
                </p>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-3 text-[11px] text-slate-100">
                  {JSON.stringify(generatedQuiz, null, 2)}
                </pre>
              </div>
            )}
          </div>

<form
            onSubmit={handleAddQuestion}
            className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Add a Question
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Question Prompt
              </label>
              <input
                type="text"
                placeholder="e.g. Which of the following is NOT a linear data structure?"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Options & Correct Answer (Select radio button for correct key)
              </label>
              {newOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-option"
                    checked={newCorrectOption === i}
                    onChange={() => setNewCorrectOption(i)}
                    className="w-4 h-4 text-amber-400 focus:ring-amber-400 cursor-pointer"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={(e) => {
                      const next = [...newOptions];
                      next[i] = e.target.value;
                      setNewOptions(next);
                    }}
                    className="flex-1 bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Add to Quiz Palette
            </button>
          </form>
        </div>

<div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Questions ({questions.length})
            </h3>

            {questions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No questions added yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        <span className="text-amber-500 font-black mr-1">{idx + 1}.</span>
                        {q.prompt}
                      </p>
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-slate-400 hover:text-rose-500 transition shrink-0"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      &bull; Correct: {q.options[q.correctOption]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
            Quiz content can be generated, but the documented API does not yet provide a publish or student-attempt endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
