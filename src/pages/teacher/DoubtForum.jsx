import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, Clock } from 'lucide-react';

export default function DoubtForum() {
  const [tab, setTab] = useState('open');
  const [replyText, setReplyText] = useState('Correct. Also remember to handle the head and tail cases separately.');

  const doubts = [
    {
      id: 1,
      question: 'Difference between singly and doubly linked list insertion?',
      meta: 'Aarav Mehta, Data Structures, 2 replies',
      active: true,
    },
    {
      id: 2,
      question: 'When do we use 3NF instead of BCNF?',
      meta: 'Riya Sharma, Database Systems, 1 reply',
      active: false,
    },
    {
      id: 3,
      question: 'Why does flex-wrap not work on my navbar?',
      meta: 'Neha Gupta, Web Development, no replies',
      active: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Doubt Forum</h1>
        <p className="text-xs text-slate-500">Answer student doubts and mark them resolved</p>
      </div>

      <div className="bg-[#fde047] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Help students get unstuck</h2>
          <p className="text-xs text-slate-800">Reply to open doubts and mark them resolved.</p>
          <div className="pt-2">
            <button className="px-4 py-2 rounded-xl bg-[#181829] text-white text-xs font-semibold">
              See unanswered
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#eceee8] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Open doubts</p>
            <p className="text-xl font-extrabold text-slate-900">5</p>
          </div>
        </div>
        <div className="bg-white border border-[#eceee8] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Resolved</p>
            <p className="text-xl font-extrabold text-slate-900">12</p>
          </div>
        </div>
        <div className="bg-white border border-[#eceee8] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg reply time</p>
            <p className="text-xl font-extrabold text-slate-900">3 h</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex bg-[#f1f2ec] p-1 rounded-xl">
            <button
              onClick={() => setTab('open')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                tab === 'open' ? 'bg-[#181829] text-white' : 'text-slate-600'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setTab('resolved')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                tab === 'resolved' ? 'bg-[#181829] text-white' : 'text-slate-600'
              }`}
            >
              Resolved
            </button>
          </div>

          <div className="bg-white border border-[#eceee8] rounded-2xl divide-y divide-slate-100 overflow-hidden">
            {doubts.map((d) => (
              <div
                key={d.id}
                className={`p-3.5 cursor-pointer transition-colors ${
                  d.active ? 'bg-amber-50/40 border-l-4 border-[#fde047]' : 'hover:bg-slate-50'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-900">{d.question}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{d.meta}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#eceee8] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Difference between singly and doubly linked list insertion?
              </h3>
              <p className="text-xs text-slate-400">Aarav Mehta, Data Structures</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
              Open
            </span>
          </div>

          <div className="p-3 bg-[#fbfbf9] rounded-xl border border-slate-100 space-y-1">
            <p className="text-xs font-bold text-slate-900">Riya Sharma <span className="text-[11px] font-normal text-slate-400">classmate</span></p>
            <p className="text-xs text-slate-700">In a doubly list you also update the prev pointer of the next node.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Your reply</label>
            <textarea
              rows="3"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-[#fbfbf9] border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Reply posted!')}
              className="px-4 py-2 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-semibold transition-colors"
            >
              Post reply
            </button>
            <button
              onClick={() => alert('Doubt marked as resolved!')}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
            >
              Mark resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
