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
    <div className="space-y-6 dashboard-stagger">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quiz results</h1>
        <p className="text-xs text-slate-500">Stack and Queue, 61 attempts</p>
      </div>

      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">How did the class do?</h2>
          <p className="text-xs text-slate-800">Scores, time taken and questions students found hardest.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <Award className="w-5 h-5 text-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#eceee8] rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Student scores</h3>
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
    </div>
  );
}
