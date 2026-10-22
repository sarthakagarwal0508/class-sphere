import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Send, Sparkles } from 'lucide-react';

export default function DoubtForum() {
  const [filter, setFilter] = useState('open'); // 'open' or 'resolved'
  const [activeDoubtId, setActiveDoubtId] = useState(1);
  const [replyText, setReplyText] = useState('');

  const [doubts, setDoubts] = useState([
    {
      id: 1,
      student: 'Aarav Mehta',
      class: 'Data Structures',
      title: 'Difference between singly and doubly linked list memory usage?',
      body: 'In a doubly linked list, how much extra pointer overhead is there compared to a singly linked list in 64-bit systems?',
      time: '2 hours ago',
      status: 'open',
      replies: [
        { author: 'Prof. Sharma', text: 'Each node in a doubly linked list requires an additional pointer (prev), taking 8 bytes extra on a 64-bit architecture.', time: '1 hour ago', isTeacher: true }
      ]
    },
    {
      id: 2,
      student: 'Riya Sharma',
      class: 'Database Systems',
      title: 'B+ Tree vs Binary Search Tree indexing in DBMS?',
      body: 'Why do relational databases prefer B+ trees over regular balanced BSTs for disk storage?',
      time: 'Yesterday',
      status: 'resolved',
      replies: [
        { author: 'Prof. Sharma', text: 'B+ Trees have a high branching factor, reducing disk I/O operations significantly compared to binary trees.', time: 'Yesterday', isTeacher: true }
      ]
    }
  ]);

  const activeDoubt = doubts.find(d => d.id === activeDoubtId) || doubts[0];

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeDoubt) return;

    setDoubts(prev => prev.map(d => {
      if (d.id === activeDoubt.id) {
        return {
          ...d,
          replies: [
            ...d.replies,
            { author: 'Prof. Sharma', text: replyText.trim(), time: 'Just now', isTeacher: true }
          ]
        };
      }
      return d;
    }));

    setReplyText('');
  };

  const toggleResolved = (doubtId) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return { ...d, status: d.status === 'resolved' ? 'open' : 'resolved' };
      }
      return d;
    }));
  };

  const filteredDoubts = doubts.filter(d => d.status === filter);

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          Doubt Forum
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Answer student questions and clarify course concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Doubts List */}
        <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilter('open')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filter === 'open' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Open Doubts
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filter === 'resolved' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredDoubts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No doubts in this category.</p>
            ) : (
              filteredDoubts.map(d => (
                <div
                  key={d.id}
                  onClick={() => setActiveDoubtId(d.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                    activeDoubtId === d.id
                      ? 'border-[#fde047] bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{d.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{d.student} &bull; {d.class}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Thread */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          {activeDoubt ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{activeDoubt.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Asked by <span className="font-semibold text-slate-700 dark:text-slate-300">{activeDoubt.student}</span> in {activeDoubt.class} &bull; {activeDoubt.time}
                  </p>
                </div>
                <button
                  onClick={() => toggleResolved(activeDoubt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeDoubt.status === 'resolved'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {activeDoubt.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {activeDoubt.body}
              </p>

              {/* Replies */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Responses</h3>
                {activeDoubt.replies.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <p className="text-[11px] font-bold text-amber-900 dark:text-amber-300">{r.author} &bull; {r.time}</p>
                    <p className="text-xs text-slate-800 dark:text-slate-200">{r.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handlePostReply} className="space-y-2 pt-2">
                <textarea
                  rows="3"
                  placeholder="Type your official answer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Post Answer
                </button>
              </form>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-10 text-center">Select a doubt thread to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}