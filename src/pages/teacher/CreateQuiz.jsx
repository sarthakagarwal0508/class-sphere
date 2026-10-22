import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function CreateQuiz() {
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    course: '',
    topic: '',
    duration: 15,
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      prompt: 'Which data structure follows the LIFO principle?',
      options: ['Queue', 'Stack', 'Linked List', 'Array'],
      correctOption: 1,
    },
    {
      id: 2,
      prompt: 'What is the worst-case time complexity of accessing an array element by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctOption: 0,
    },
  ]);

  const [newPrompt, setNewPrompt] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectOption, setNewCorrectOption] = useState(0);

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
      {/* High-Contrast Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          Create Quiz
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Topic-tagged MCQs, automated evaluation, and analytics.
        </p>
      </div>

      {/* Dark Navy Hero Banner */}
      <div className="bg-[#181829] border border-slate-800 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm relative overflow-hidden text-white">
        <div className="space-y-2 max-w-md z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#fde047] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Assessment Builder
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Build a quiz in minutes
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Add multiple-choice questions with answer keys. Instant grading happens automatically when students submit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quiz Details & Question Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
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
          </div>

          {/* Add Question Form */}
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

        {/* Right Column: Question Palette */}
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

          <button
            onClick={() => alert('Quiz Published Successfully!')}
            disabled={questions.length === 0}
            className="w-full py-3 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish Quiz ({questions.length} questions)
          </button>
        </div>
      </div>
    </div>
  );
}