import React from 'react';
import { BarChart2, CheckCircle2, Users, HelpCircle } from 'lucide-react';

export default function ClassAnalytics() {
  const stats = [
    { label: 'Class average', value: '74%', icon: BarChart2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Submission rate', value: '81%', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active students', value: '58/62', icon: Users, color: 'text-amber-600 bg-amber-50' },
    { label: 'Quizzes this month', value: '4', icon: HelpCircle, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="space-y-6 dashboard-stagger">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Class analytics</h1>
        <p className="text-xs text-slate-500">Averages, quiz trends and submission completion</p>
      </div>

      <div className="bg-[#181829] text-white rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Understand your classes</h2>
          <p className="text-xs text-slate-300">Trends, weak topics and students who may need support.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-white" />
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
    </div>
  );
}
