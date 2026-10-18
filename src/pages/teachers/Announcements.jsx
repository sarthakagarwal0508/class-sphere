import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function Announcements() {
  const [formData, setFormData] = useState({
    classroom: 'Data Structures',
    title: 'Lab moved to Friday',
    message: 'This week the DS lab will be held on Friday at 10:00 in Lab 2.',
  });

  const posts = [
    { id: 1, title: 'Lab moved to Friday', class: 'Data Structures', msg: 'This week the DS lab will be held on Friday at 10:00 in Lab 2.', time: 'Today', seen: '58 of 62 seen' },
    { id: 2, title: 'Normalization quiz', class: 'Database Systems', msg: 'A 20 minute quiz on normalization is live from Sunday.', time: '14 Oct', seen: '55 of 58 seen' },
    { id: 3, title: 'Portfolio marks out', class: 'Web Development', msg: 'Marks and feedback are now available.', time: '12 Oct', seen: '64 of 64 seen' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Announcements</h1>
        <p className="text-xs text-slate-500">Post class updates and alerts</p>
      </div>

      {/* Dark Navy Hero Banner */}
      <div className="bg-[#181829] text-white rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Keep everyone in the loop</h2>
          <p className="text-xs text-slate-300">Post updates and students get an in-app alert instantly.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#fde047] text-slate-900 text-xs font-bold">
              View history
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">New announcement</h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Class</label>
            <input
              type="text"
              value={formData.classroom}
              onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
            <textarea
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <button
            onClick={() => alert('Announcement published!')}
            className="w-full py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors"
          >
            Post announcement
          </button>
        </div>

        {/* Right History */}
        <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Posted</h3>
          <div className="divide-y divide-slate-100">
            {posts.map((p) => (
              <div key={p.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                  <span className="text-[11px] text-slate-400">{p.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">{p.class}</p>
                <p className="text-xs text-slate-700">{p.msg}</p>
                <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 mt-1">
                  {p.seen}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}