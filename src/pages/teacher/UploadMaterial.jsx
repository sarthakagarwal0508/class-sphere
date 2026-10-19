import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function UploadMaterial() {
  const [materialType, setMaterialType] = useState('PDF');
  const [allowAi, setAllowAi] = useState(true);

  const sharedFiles = [
    { id: 1, title: 'Linked Lists: Complete Notes', meta: 'Linked List, PDF, 1.2 MB, 10 Oct', views: '58 views' },
    { id: 2, title: 'Stack and Queue Cheat Sheet', meta: 'Stack and Queue, Notes, 12 Oct', views: '51 views' },
    { id: 3, title: 'Normalization Explained', meta: 'Database Systems, PDF, 8 Oct', views: '47 views' },
    { id: 4, title: 'Responsive Design Guide', meta: 'Web Development, PDF, 2 Oct', views: '60 views' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Upload material</h1>
        <p className="text-xs text-slate-500">Share notes, PDFs and links topic-wise</p>
      </div>

     
      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Share learning material</h2>
          <p className="text-xs text-slate-800">Upload by topic so students can find, download and summarize it.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#181829] text-white text-xs font-semibold">
              Browse library
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <Upload className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        <div className="bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">New material</h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input
              type="text"
              placeholder="Trees: Traversals Explained"
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Class</label>
              <select className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <option>Data Structures</option>
                <option>Database Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Topic</label>
              <input
                type="text"
                placeholder="Trees"
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {['PDF', 'Notes', 'Link'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMaterialType(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                  materialType === t
                    ? 'bg-[#fde047] border-[#fde047] text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-[#fbfbf9] cursor-pointer">
            <p className="text-xs font-semibold text-slate-800">Drop a PDF here or browse</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Max 20 MB</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={allowAi}
              onChange={(e) => setAllowAi(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span className="text-xs text-slate-700">Allow students to use Notes AI on this file</span>
          </label>

          <button className="w-full py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors">
            Upload and notify students
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Shared so far</h3>
            <div className="divide-y divide-slate-100">
              {sharedFiles.map((f) => (
                <div key={f.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                    <p className="text-[11px] text-slate-400">{f.meta}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                      {f.views}
                    </span>
                    <button className="text-xs text-slate-400 hover:text-slate-900 font-medium">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

       
          <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-900">Storage</span>
              <span className="font-semibold text-slate-500">1.2 GB of 5 GB used (24%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#181829] h-full rounded-full" style={{ width: '24%' }} />
            </div>
            <p className="text-[11px] text-slate-400">PDFs, notes and links count toward storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}