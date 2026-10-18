import React, { useState } from 'react';
import { Download, FileText, User } from 'lucide-react';

export default function StudentSubmissions() {
  const [marks, setMarks] = useState('17');
  const submissions = [
    { id: 1, name: 'Aarav Mehta', task: 'Linked List, 19 Oct', status: 'Submitted', active: true },
    { id: 2, name: 'Kabir Singh', task: 'ER Diagram, 18 Oct', status: 'Submitted', active: false },
    { id: 3, name: 'Neha Gupta', task: 'Linked List, 18 Oct', status: 'Submitted', active: false },
    { id: 4, name: 'Riya Sharma', task: 'Linked List, 18 Oct', score: '18/20', status: 'Graded', active: false },
  ];

  return (
    <div className="space-y-6 dashboard-stagger">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Submissions</h1>
        <p className="text-xs text-slate-500">Grade work and leave feedback</p>
      </div>

      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Grade with feedback</h2>
          <p className="text-xs text-slate-800">Review work, add marks and leave comments students learn from.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#eceee8] rounded-2xl divide-y divide-slate-100 overflow-hidden">
          {submissions.map((s) => (
            <div key={s.id} className={`p-3.5 flex items-center justify-between cursor-pointer ${s.active ? 'bg-amber-50/40 border-l-4 border-[#fde047]' : 'hover:bg-slate-50'}`}>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                <p className="text-[11px] text-slate-400">{s.task}</p>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{s.status}</span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Aarav Mehta</h3>
              <p className="text-xs text-slate-400">Linked List Implementation, submitted 19 Oct, 10:42</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">Submitted</span>
          </div>

          {/* C Code Box with properly escaped JSX string */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed space-y-1">
            <p>{"struct Node { int data; struct Node* next; };"}</p>
            <p>{"void insert(struct Node** head, int value) { ... }"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Marks (out of 20)</label>
              <input type="text" value={marks} onChange={(e) => setMarks(e.target.value)} className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <option>Graded</option>
                <option>Needs revision</option>
              </select>
            </div>
          </div>
          <button onClick={() => alert('Grade saved!')} className="px-5 py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors">
            Save grade
          </button>
        </div>
      </div>
    </div>
  );
}
