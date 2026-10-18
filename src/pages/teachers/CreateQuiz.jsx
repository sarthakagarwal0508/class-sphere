import React, { useState } from 'react';
import { HelpCircle, Check, Sparkles } from 'lucide-react';

export default function CreateQuiz() {
  const [selectedCorrect, setSelectedCorrect] = useState('B');

  const questions = [
    { id: 1, text: 'Which structure uses LIFO?', correct: 'Stack' },
    { id: 2, text: 'Time to access array index?', correct: 'O(1)' },
    { id: 3, text: 'A queue follows which principle?', correct: 'FIFO' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Create quiz</h1>
        <p className="text-xs text-slate-500">Topic-tagged MCQs, marked automatically</p>
      </div>

      {/* Dark Navy Hero Banner */}
      <div className="bg-[#181829] text-white rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Build a quiz in minutes</h2>
          <p className="text-xs text-slate-300">Add MCQs with topic tags. Marking happens automatically.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#fde047] text-slate-900 text-xs font-bold">
              Import questions
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Quiz Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#eceee8] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Quiz details</h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
              <input
                type="text"
                defaultValue="Stack and Queue"
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Class</label>
                <input
                  type="text"
                  defaultValue="Data Structures"
                  className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Topic tag</label>
                <input
                  type="text"
                  defaultValue="Stack and Queue"
                  className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="w-1/2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Duration (minutes)</label>
              <input
                type="number"
                defaultValue="15"
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Add Question Box */}
          <div className="bg-white border border-[#eceee8] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Add a question</h3>
            <input
              type="text"
              defaultValue="Which structure uses FIFO?"
              placeholder="Question prompt"
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />

            <div className="space-y-2 pt-1">
              <div
                onClick={() => setSelectedCorrect('A')}
                className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer ${
                  selectedCorrect === 'A' ? 'bg-[#fde047]/40 border-amber-400 font-bold' : 'border-slate-200'
                }`}
              >
                <span className="text-xs font-bold w-4">A</span>
                <span className="text-xs text-slate-800">Stack</span>
              </div>
              <div
                onClick={() => setSelectedCorrect('B')}
                className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer ${
                  selectedCorrect === 'B' ? 'bg-[#fde047] border-amber-400 font-bold' : 'border-slate-200'
                }`}
              >
                <span className="text-xs font-bold w-4">B</span>
                <span className="text-xs text-slate-800">Queue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Questions Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Questions (3)</h4>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-900">
                    <span className="text-amber-500 mr-1.5">{q.id}</span>
                    {q.text}
                  </p>
                  <p className="text-[11px] text-slate-500 pl-4">Correct: {q.correct}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Quiz published!')}
              className="w-full py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors mt-2"
            >
              Publish quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}