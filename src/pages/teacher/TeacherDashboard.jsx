import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileCheck2, Sparkles, Award } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Classrooms', value: '3', icon: BookOpen, color: 'bg-amber-100 text-amber-800' },
    { label: 'Total students', value: '184', icon: Users, color: 'bg-blue-100 text-blue-800' },
    { label: 'To grade', value: '6', icon: FileCheck2, color: 'bg-rose-100 text-rose-800' },
    { label: 'Class average', value: '74%', icon: Award, color: 'bg-emerald-100 text-emerald-800' },
  ];

  const classrooms = [
    { id: 'dsa', name: 'Data Structures', section: 'Section A, 62 students', joinCode: 'DS4X9K', stats: '4 assignments  3 quizzes', avg: '74%', progress: 74, bg: 'bg-[#fefce8] border-amber-200' },
    { id: 'dbms', name: 'Database Systems', section: 'Section A, 58 students', joinCode: 'DB7M2Q', stats: '2 assignments  5 quizzes', avg: '68%', progress: 68, bg: 'bg-white border-[#eceee8]' },
    { id: 'webdev', name: 'Web Development', section: 'Section B, 64 students', joinCode: 'WD1P8R', stats: '6 assignments  2 quizzes', avg: '81%', progress: 81, bg: 'bg-white border-[#eceee8]' },
  ];

  const needsGrading = [
    { id: 1, name: 'Aarav Mehta', task: 'Linked List Implementation, 19 Oct', status: 'Submitted', type: 'pending' },
    { id: 2, name: 'Kabir Singh', task: 'ER Diagram Design, 18 Oct', status: 'Submitted', type: 'pending' },
    { id: 3, name: 'Riya Sharma', task: 'Linked List Implementation, 18 Oct', score: '18/20', status: 'Graded', type: 'graded' },
  ];

  return (
    <div className="space-y-6 dashboard-stagger">
      {/* 🌟 Yellow Higher Card */}
      <div className="rounded-3xl bg-[#fde047] p-6 md:p-8 shadow-sm text-slate-900 flex items-center justify-between relative overflow-hidden">
        <div className="max-w-xl space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-slate-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Academic Portal &bull; Fall 2026
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Welcome back, Prof. Sharma! 👋
          </h1>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            You have <span className="font-bold underline decoration-slate-900">6 assignments</span> awaiting evaluation across your 3 active classrooms today.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button onClick={() => navigate('/teacher/submissions')} className="px-4 py-2 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold shadow-sm transition-colors">
              Grade pending work
            </button>
            <button onClick={() => navigate('/teacher/create-classroom')} className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-slate-900 text-xs font-semibold transition-colors">
              New classroom
            </button>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Award className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border border-[#eceee8] rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
              <m.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{m.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Classrooms */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">My Classrooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classrooms.map((c) => (
            <div key={c.id} className={`${c.bg} border rounded-2xl p-5 space-y-3 hover:border-slate-300 transition-all`}>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500">{c.section}</p>
              </div>
              <div className="inline-block bg-[#f4f5f0] text-slate-700 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                Join code: {c.joinCode}
              </div>
              <p className="text-xs text-slate-500">{c.stats}</p>
              <div className="space-y-1 pt-1">
                <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#181829] h-full rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Class average {c.avg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Grading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#eceee8] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Needs grading</h3>
          <div className="space-y-3">
            {needsGrading.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-[#fbfbf9] border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.task}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.type === 'pending' ? (
                    <>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        {item.status}
                      </span>
                      <button onClick={() => navigate('/teacher/submissions')} className="px-3 py-1 rounded-lg bg-[#fde047] hover:bg-amber-400 text-slate-900 text-xs font-bold transition-colors">
                        Grade
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold font-mono text-slate-800">{item.score}</span>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {item.status}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Averages */}
        <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900">Quiz averages</h3>
          <div className="flex items-end justify-around h-36 pt-4">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">62%</span>
              <div className="w-10 bg-[#fde047] rounded-t-lg" style={{ height: '70px' }} />
              <span className="text-xs text-slate-500 font-semibold">Q1</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">70%</span>
              <div className="w-10 bg-[#fde047] rounded-t-lg" style={{ height: '90px' }} />
              <span className="text-xs text-slate-500 font-semibold">Q2</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">74%</span>
              <div className="w-10 bg-[#fde047] rounded-t-lg" style={{ height: '105px' }} />
              <span className="text-xs text-slate-500 font-semibold">Q3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
