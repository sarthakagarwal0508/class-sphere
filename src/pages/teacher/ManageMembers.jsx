import React, { useState } from 'react';
import { Users, CheckCircle2, BarChart2, Flag } from 'lucide-react';

export default function ManageMembers() {
  const [filter, setFilter] = useState('all');
  const stats = [
    { label: 'Enrolled', value: '62', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active this week', value: '58', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Average score', value: '74%', icon: BarChart2, color: 'text-amber-600 bg-amber-50' },
    { label: 'Need support', value: '4', icon: Flag, color: 'text-rose-600 bg-rose-50' },
  ];
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Mehta', email: 'aarav@college.edu', joined: '2 Oct', score: '78%', status: 'Active' },
    { id: 2, name: 'Riya Sharma', email: 'riya@college.edu', joined: '2 Oct', score: '85%', status: 'Active' },
    { id: 3, name: 'Kabir Singh', email: 'kabir@college.edu', joined: '3 Oct', score: '52%', status: 'Needs support' },
    { id: 4, name: 'Neha Gupta', email: 'neha@college.edu', joined: '4 Oct', score: '91%', status: 'Active' },
    { id: 5, name: 'Vikram Rao', email: 'vikram@college.edu', joined: '5 Oct', score: '44%', status: 'Needs support' },
  ]);

  const filtered = students.filter((s) => {
    if (filter === 'support') return s.status === 'Needs support';
    if (filter === 'top') return parseInt(s.score) >= 80;
    return true;
  });

  return (
    <div className="space-y-6 dashboard-stagger">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Members</h1>
        <p className="text-xs text-slate-500">62 students enrolled in Data Structures</p>
      </div>

      <div className="bg-[#181829] text-white rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Know your class</h2>
          <p className="text-xs text-slate-300">See who is active, who is excelling and who may need support.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-900 text-xs font-bold transition-colors">
              Invite students
            </button>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
      </div>

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

      <div className="flex items-center gap-2">
        {['all', 'support', 'top'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
              filter === tab ? 'bg-[#181829] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'all' ? 'All students' : tab === 'support' ? 'Need support' : 'Top performers'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#eceee8] rounded-2xl divide-y divide-slate-100 overflow-hidden">
        {filtered.map((st) => (
          <div key={st.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                {st.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                <p className="text-[11px] text-slate-500">{st.email}, joined {st.joined}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-slate-800">{st.score}</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${st.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {st.status}
              </span>
              <button onClick={() => setStudents(students.filter(s => s.id !== st.id))} className="text-xs text-slate-400 hover:text-rose-600 font-medium">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
