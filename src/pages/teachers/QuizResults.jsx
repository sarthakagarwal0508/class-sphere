import React from 'react';
import { Award, BarChart2, CheckCircle2, Clock } from 'lucide-react';

export default function QuizResults() {
  const stats = [
    { label: 'Attempts', value: '61', icon: Award, color: 'text-blue-600 bg-blue-50' },
    { label: 'Class average', value: '72%', icon: BarChart2, color: 'text-amber-600 bg-amber-50' },
    { label: 'Passed', value: '54/61', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Avg time', value: '11 min', icon: Clock, color: 'text-purple-600 bg-purple-50' },
  ];

  const students = [
    { name: 'Neha Gupta', score: '10/10', progress: 100 },
    { name: 'Riya Sharma', score: '9/10', progress: 90 },
    { name: 'Aarav Mehta', score: '7/10', progress: 70 },
    { name: 'Kabir Singh', score: '4/10', progress: 40 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quiz results</h1>
        <p className="text-xs text-slate-500">Stack and Queue, 61 attempts</p>
      </div>

      {/* Yellow Hero Banner */}
      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">How did the class do?</h2>
          <p className="text-xs text-slate-800">Scores, time taken and the questions students found hardest.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#181829] text-white text-xs font-semibold">
              Download report
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <Award className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#eceee8] rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scores & Hardest Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Student scores</h3>
            <button className="text-xs font-semibold text-slate-600 hover:text-black">Export CSV</button>
          </div>
          <div className="space-y-3">
            {students.map((st) => (
              <div key={st.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{st.name}</span>
                  <span className="font-mono font-bold text-slate-900">{st.score}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#181829] h-full rounded-full" style={{ width: `${st.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Hardest questions</h3>
            <p className="text-xs text-slate-400">Share of students who got it right</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-800">Q4 FIFO vs LIFO</span>
                <span className="font-bold text-rose-600">48%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-800">Q7 Circular queue</span>
                <span className="font-bold text-amber-600">55%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-slate-800">Q2 Array access</span>
                <span className="font-bold text-emerald-600">90%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#181829] rounded-2xl p-5 text-white space-y-2">
            <p className="text-xs font-bold text-slate-200">Revisit in class</p>
            <p className="text-xs text-slate-400">Only 48% got FIFO vs LIFO right. A quick recap could help.</p>
            <button className="px-4 py-2 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-900 text-xs font-bold transition-colors mt-1">
              Post as announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}