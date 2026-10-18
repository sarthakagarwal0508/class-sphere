import React, { useState } from 'react';
import { Download, CheckCircle, FileText, User } from 'lucide-react';

export default function StudentSubmissions() {
  const [tab, setTab] = useState('toGrade');
  const [marks, setMarks] = useState('17');
  const [status, setStatus] = useState('Graded');
  const [feedback, setFeedback] = useState('Good use of pointers. Add a function to free memory.');

  const submissions = [
    { id: 1, name: 'Aarav Mehta', task: 'Linked List, 19 Oct', status: 'Submitted', active: true },
    { id: 2, name: 'Kabir Singh', task: 'ER Diagram, 18 Oct', status: 'Submitted', active: false },
    { id: 3, name: 'Neha Gupta', task: 'Linked List, 18 Oct', status: 'Submitted', active: false },
    { id: 4, name: 'Riya Sharma', task: 'Linked List, 18 Oct', score: '18/20', status: 'Graded', active: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Submissions</h1>
        <p className="text-xs text-slate-500">Grade work and leave feedback</p>
      </div>

      {/* Yellow Hero Banner */}
      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Grade with feedback</h2>
          <p className="text-xs text-slate-800">Review work, add marks and leave comments students learn from.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#181829] text-white text-xs font-semibold">
              Grade next
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <User className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Submissions List */}
        <div className="space-y-3">
          <div className="flex bg-[#f1f2ec] p-1 rounded-xl">
            <button
              onClick={() => setTab('toGrade')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'toGrade' ? 'bg-[#181829] text-white' : 'text-slate-600'
              }`}
            >
              To grade
            </button>
            <button
              onClick={() => setTab('graded')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'graded' ? 'bg-[#181829] text-white' : 'text-slate-600'
              }`}
            >
              Graded
            </button>
          </div>

          <div className="bg-white border border-[#eceee8] rounded-2xl divide-y divide-slate-100 overflow-hidden">
            {submissions.map((s) => (
              <div
                key={s.id}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  s.active ? 'bg-amber-50/40 border-l-4 border-[#fde047]' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                  <p className="text-[11px] text-slate-400">{s.task}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border border-[#eceee8] rounded-2xl text-xs text-slate-500 flex justify-between">
            <span>Grading progress</span>
            <span className="font-bold text-slate-800">6 left to grade</span>
          </div>
        </div>

        {/* Right Evaluation Workspace */}
        <div className="lg:col-span-2 bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Aarav Mehta</h3>
              <p className="text-xs text-slate-400">Linked List Implementation, submitted 19 Oct, 10:42</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
              Submitted
            </span>
          </div>

          {/* Code Submission Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <p>struct Node &#123; int data; struct Node* next; &#125;;</p>
            <p>void insert(struct Node** head, int value) &#123; ... &#125;</p>
          </div>

          {/* Attachment */}
          <div className="p-3 bg-[#fbfbf9] rounded-xl flex items-center justify-between border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">linked_list.c</p>
              <p className="text-[11px] text-slate-400">2.4 KB</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Marks (out of 20)</label>
              <input
                type="text"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                <option>Graded</option>
                <option>Needs revision</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Feedback</label>
            <textarea
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <button
            onClick={() => alert('Grade and feedback saved!')}
            className="px-5 py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors"
          >
            Save grade
          </button>
        </div>
      </div>
    </div>
  );
}