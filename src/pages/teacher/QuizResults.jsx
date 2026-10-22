import React from 'react';
import { Award, BarChart2, CheckCircle2, Clock, Download, Sparkles, AlertCircle } from 'lucide-react';

export default function QuizResults() {
  const stats = [
    { label: 'Attempts', value: '61', icon: Award, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' },
    { label: 'Class average', value: '72%', icon: BarChart2, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60' },
    { label: 'Passed', value: '54/61', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'Avg time', value: '11 min', icon: Clock, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60' },
  ];

  const students = [
    { name: 'Neha Gupta', score: '10/10', progress: 100 },
    { name: 'Riya Sharma', score: '9/10', progress: 90 },
    { name: 'Aarav Mehta', score: '7/10', progress: 70 },
    { name: 'Kabir Singh', score: '4/10', progress: 40 },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Score,Percentage\n"
      + students.map(s => `"${s.name}","${s.score}",${s.progress}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quiz_results_stack_and_queue.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          Quiz Results
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Stack and Queue &bull; 61 student submissions evaluated automatically.
        </p>
      </div>

      {/* 🌟 Dark Navy Hero Banner with Yellow Accent (Images 4 & 5 Design System) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#181829] dark:bg-[#1a1a26] text-white p-6 md:p-8 flex items-center justify-between border border-slate-800 shadow-sm">
        <div className="space-y-2 z-10 max-w-md">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            ASSESSMENT REPORT
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            How did the class do?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Scores, time taken, and the curriculum concepts students found hardest.
          </p>
          <div className="pt-2">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download report (CSV)
            </button>
          </div>
        </div>

        <div className="relative hidden sm:flex items-center justify-center w-64 h-32 shrink-0">
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#fde047] z-0" />
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-md flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#181829] text-white shadow-md flex items-center justify-center border border-slate-700">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-md flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div 
            key={s.label} 
            className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-4 flex items-center gap-3 shadow-sm"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scores & Hardest Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Scores */}
        <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Scores
            </h3>
            <button 
              onClick={handleExportCSV}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 transition"
            >
              Export CSV
            </button>
          </div>

          <div className="space-y-3.5">
            {students.map((st) => (
              <div key={st.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{st.name}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{st.score}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#181829] dark:bg-[#fde047] h-full rounded-full transition-all duration-300" 
                    style={{ width: `${st.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardest Questions & Revisit Alert */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Hardest Questions
            </h3>
            <p className="text-xs text-slate-400">Percentage of students who answered correctly</p>
            
            <div className="space-y-2 text-xs pt-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="font-medium text-slate-800 dark:text-slate-200">Q4 FIFO vs LIFO</span>
                <span className="font-bold text-rose-500">48%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-slate-800 dark:text-slate-200">Q7 Circular queue pointers</span>
                <span className="font-bold text-amber-500">55%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-slate-800 dark:text-slate-200">Q2 Array index access</span>
                <span className="font-bold text-emerald-500">90%</span>
              </div>
            </div>
          </div>

          {/* Revisit in Class Action Card */}
          <div className="bg-[#181829] border border-slate-800 rounded-2xl p-5 text-white space-y-2.5 shadow-sm">
            <p className="text-xs font-bold text-[#fde047] flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" /> Revisit in Class
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Only 48% of students answered Question 4 correctly. A quick 5-minute recap in your next lecture will help bridge the gap.
            </p>
            <button 
              onClick={() => alert("Announcement posted to class feed!")}
              className="px-4 py-2 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm mt-1"
            >
              Post as announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}