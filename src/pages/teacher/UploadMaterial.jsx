import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function UploadMaterial() {
  const [materialType, setMaterialType] = useState('PDF');
  const sharedFiles = [
    { id: 1, title: 'Linked Lists: Complete Notes', meta: 'Linked List, PDF, 1.2 MB, 10 Oct', views: '58 views' },
    { id: 2, title: 'Stack and Queue Cheat Sheet', meta: 'Stack and Queue, Notes, 12 Oct', views: '51 views' },
    { id: 3, title: 'Normalization Explained', meta: 'Database Systems, PDF, 8 Oct', views: '47 views' },
    { id: 4, title: 'Responsive Design Guide', meta: 'Web Development, PDF, 2 Oct', views: '60 views' },
  ];

  return (
    <div className="space-y-6 dashboard-stagger">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Upload material</h1>
        <p className="text-xs text-slate-500">Share notes, PDFs and links topic-wise</p>
      </div>

      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Share learning material</h2>
          <p className="text-xs text-slate-800">Upload by topic so students can find, download and summarize it.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <Upload className="w-5 h-5 text-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">New material</h3>
          <input type="text" placeholder="Title (e.g. Trees: Traversals Explained)" className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs" />
          <div className="flex gap-2">
            {['PDF', 'Notes', 'Link'].map((t) => (
              <button key={t} onClick={() => setMaterialType(t)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${materialType === t ? 'bg-[#fde047] border-[#fde047] text-slate-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-[#fbfbf9]">
            <p className="text-xs font-semibold text-slate-800">Drop a file here or browse</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Max 20 MB</p>
          </div>
          <button onClick={() => alert('Material uploaded!')} className="w-full py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors">
            Upload and notify students
          </button>
        </div>

        <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Shared so far</h3>
          <div className="divide-y divide-slate-100">
            {sharedFiles.map((f) => (
              <div key={f.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                  <p className="text-[11px] text-slate-400">{f.meta}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                  {f.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
