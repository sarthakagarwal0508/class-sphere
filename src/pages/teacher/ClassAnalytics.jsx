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
    <div className="space-y-6">

      <div>
        <h1 className="text-xl font-bold text-slate-900">Class analytics</h1>
        <p className="text-xs text-slate-500">Averages, quiz trends and submission completion</p>
      </div>

      {/* Dark Navy Hero Banner */}
      <div className="bg-[#181829] text-white rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Understand your classes</h2>
          <p className="text-xs text-slate-300">Trends, weak topics and students who may need support.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#fde047] text-slate-900 text-xs font-bold">
              Download report
            </button>s
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Visual */}
        <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Quiz average trend</h3>
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[
              { label: 'Q1', val: '62%', h: '62px' },
              { label: 'Q2', val: '70%', h: '78px' },
              { label: 'Q3', val: '66%', h: '72px' },
              { label: 'Q4', val: '74%', h: '88px' },
              { label: 'Q5', val: '78%', h: '98px' },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-600">{bar.val}</span>
                <div className="w-10 bg-[#fde047] rounded-t-lg" style={{ height: bar.h }} />
                <span className="text-xs text-slate-500 font-semibold">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Weak topics in class</h3>
          <div className="space-y-3">
            {[
              { topic: 'Normalization', pct: 48 },
              { topic: 'Stack and Queue', pct: 61 },
              { topic: 'SQL Joins', pct: 70 },
              { topic: 'Linked List', pct: 82 },
            ].map((t) => (
              <div key={t.topic} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{t.topic}</span>
                  <span className="text-slate-400 font-bold">{t.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#181829] h-full rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Students */}
      <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Students who may need support</h3>
        <p className="text-xs text-slate-500">Estimated by the ML model from past assessments. Use it to offer revision help.</p>

        <div className="p-3 bg-[#fbfbf9] rounded-xl flex items-center justify-between border border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Vikram Rao</h4>
            <p className="text-[11px] text-slate-400">Low quiz scores and 2 pending assignments</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600">
            High risk
          </span>
        </div>
      </div>
    </div>
  );
}