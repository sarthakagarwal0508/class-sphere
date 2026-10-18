import React, { useState } from 'react';
import { Copy, Share2, BookOpen, Users, Plus } from 'lucide-react';

export default function CreateClassroom() {
  const [formData, setFormData] = useState({
    name: 'Data Structures, Section A',
    subject: 'Computer Science',
    semester: 'Semester 3',
    description: 'Arrays, linked lists, stacks, queues and trees with weekly labs.',
  });

  const [joinCode] = useState('K7P2QX');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Create classroom</h1>
        <p className="text-xs text-slate-500">Students join using a unique code</p>
      </div>

      {/* Yellow Hero Banner */}
      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between relative overflow-hidden shadow-sm">
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-black text-slate-900">Start a new classroom</h2>
          <p className="text-xs text-slate-800">Create it, share the join code and students can join in seconds.</p>
          <div className="pt-2">
            <button onClick={handleCopy} className="px-4 py-2 rounded-xl bg-[#181829] text-white text-xs font-semibold">
              Share your code
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-slate-800" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Plus className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </div>

      {/* Main Form & Code Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Details */}
        <div className="lg:col-span-2 bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Classroom details</h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Classroom name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Semester</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <button
            onClick={() => alert('Classroom created successfully!')}
            className="px-5 py-2.5 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors"
          >
            Create classroom
          </button>
        </div>

        {/* Right Code Display & Info */}
        <div className="space-y-4">
          <div className="bg-[#181829] text-white rounded-2xl p-6 text-center space-y-3">
            <p className="text-xs text-slate-400 font-medium">Share this join code</p>
            <p className="text-4xl font-mono font-black tracking-widest text-[#fde047]">{joinCode}</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-[#fde047] text-slate-900 text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy code'}
              </button>
              <button
                onClick={() => alert('Link copied to clipboard!')}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                Share link
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#eceee8] rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">How students join</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p><span className="font-bold text-slate-900">1</span> Open ClassSphere and choose <span className="font-semibold text-slate-800">Join class</span></p>
              <p><span className="font-bold text-slate-900">2</span> Enter the code <span className="font-mono font-bold text-slate-900">{joinCode}</span></p>
              <p><span className="font-bold text-slate-900">3</span> The class appears on their dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}