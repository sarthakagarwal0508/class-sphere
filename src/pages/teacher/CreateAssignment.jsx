import React, { useState } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';

export default function CreateAssignment() {
  const [formData, setFormData] = useState({
    title: 'Binary Tree Traversals',
    instructions: 'Implement inorder, preorder and postorder traversal in C and add output screenshots.',
    classroom: 'Data Structures',
    deadline: '30 Oct 2026',
    marks: '20',
  });

  return (
    <div className="space-y-6 dashboard-stagger">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Create assignment</h1>
        <p className="text-xs text-slate-500">Set instructions, deadline and marks</p>
      </div>

      <div className="bg-[#181829] text-white rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Set the next task</h2>
          <p className="text-xs text-slate-300">Add clear instructions, a deadline and total marks.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Assignment details</h3>
          <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs" />
          <textarea rows="4" value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs" />
          <div className="grid grid-cols-3 gap-3">
            <input type="text" value={formData.classroom} onChange={(e) => setFormData({...formData, classroom: e.target.value})} className="bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs" />
            <input type="text" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs" />
            <input type="text" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} className="bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs" />
          </div>
          <button onClick={() => alert('Assignment published!')} className="px-5 py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors">
            Publish assignment
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">What students will see</h4>
            <div className="p-3 bg-[#fbfbf9] rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900">{formData.title}</h5>
                <p className="text-[11px] text-slate-500">{formData.classroom}, due {formData.deadline}</p>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Pending</span>
            </div>
          </div>
          <div className="bg-[#fde047] rounded-2xl p-4 text-slate-900 space-y-1">
            <p className="text-xs font-bold">Late submissions</p>
            <p className="text-[11px] text-slate-800">Allow late work with a mark penalty, or close submissions at the deadline.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
