import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, FileCheck2, Clock, PlusCircle, Upload, HelpCircle, ArrowRight, Copy, Check, ChevronRight, Sparkles } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const metrics = [
    { label: 'Active Classrooms', value: '6', subtext: '+1 this semester', icon: BookOpen, color: 'from-blue-500/20 to-indigo-500/20', text: 'text-blue-400' },
    { label: 'Enrolled Students', value: '284', subtext: '94% average attendance', icon: Users, color: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400' },
    { label: 'Pending to Grade', value: '38', subtext: '8 urgent (< 24h)', icon: FileCheck2, color: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-400' },
    { label: 'Upcoming Deadlines', value: '4', subtext: 'Next in 18 hours', icon: Clock, color: 'from-purple-500/20 to-pink-500/20', text: 'text-purple-400' },
  ];

  const classes = [
    { id: 'cls-1', name: 'Data Structures & Algorithms', subject: 'Computer Science', section: 'CS-A', studentsCount: 64, joinCode: 'DSA402', color: 'border-l-indigo-500', nextAssignment: 'Binary Trees Implementation' },
    { id: 'cls-2', name: 'Advanced Web Engineering', subject: 'Software Eng.', section: 'SE-3B', studentsCount: 52, joinCode: 'WEB881', color: 'border-l-emerald-500', nextAssignment: 'GraphQL Microservices Lab' },
    { id: 'cls-3', name: 'Machine Learning Fundamentals', subject: 'Artificial Intelligence', section: 'AI-1A', studentsCount: 78, joinCode: 'ML9032', color: 'border-l-purple-500', nextAssignment: 'Linear Regression from Scratch' },
  ];

  const recentSubmissions = [
    { id: 'sub-1', student: 'Alex Johnson', class: 'CS-A', assignment: 'Lab 4: Binary Trees', time: '12m ago', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { id: 'sub-2', student: 'Priya Sharma', class: 'AI-1A', assignment: 'Model Overfitting Analysis', time: '45m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 'sub-3', student: 'Marcus Vance', class: 'SE-3B', assignment: 'REST API Authentication', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Fall Semester 2026 Academic Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Welcome back, Dr. Jenkins! 👋</h1>
          <p className="mt-2 text-sm text-slate-300">You have <span className="text-amber-400 font-semibold">38 assignments</span> awaiting evaluation.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${metric.text}`} />
              </div>
              <p className="text-2xl font-bold text-slate-100">{metric.value}</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">{metric.label}</p>
              <p className="text-[11px] text-slate-400 mt-1">{metric.subtext}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => navigate('/teacher/create-class')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold">
            <PlusCircle className="w-4 h-4" /> New Classroom
          </button>
          <button onClick={() => navigate('/teacher/create-assignment')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold">
            <BookOpen className="w-4 h-4" /> New Assignment
          </button>
          <button onClick={() => navigate('/teacher/upload-material')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold">
            <Upload className="w-4 h-4" /> Upload Notes
          </button>
          <button onClick={() => navigate('/teacher/create-quiz')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-all text-xs font-semibold">
            <HelpCircle className="w-4 h-4" /> Create Quiz
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">My Created Classrooms ({classes.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((c) => (
            <div key={c.id} className={`bg-slate-900/70 border border-slate-800 rounded-2xl p-5 border-l-4 ${c.color}`}>
              <h3 className="font-bold text-slate-100 text-base">{c.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{c.subject} &bull; {c.section}</p>
              <div className="mt-4 flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">{c.studentsCount} Students</span>
                <span className="text-xs font-mono bg-slate-950 px-2 py-0.5 rounded text-indigo-300 font-bold border border-slate-700">{c.joinCode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
