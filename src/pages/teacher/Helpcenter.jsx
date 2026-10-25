import React, { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Mail, LifeBuoy, ChevronDown, 
  ChevronUp, Search, Send, CheckCircle2, BookOpen, 
  ShieldCheck, Sparkles 
} from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Message Form State
  const [ticket, setTicket] = useState({
    subject: '',
    category: 'Classroom & Students',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const faqs = [
    {
      q: 'How do students join my classroom cohort?',
      a: 'Go to your Dashboard or "Create Classroom". Each class generates a unique 6-character alphanumeric code (e.g., K7P2QX). Share this code with students. In their student portal, they click "Join Classroom", enter the code, and are instantly enrolled.',
    },
    {
      q: 'How does code submission and grading work?',
      a: 'When students submit assignments, they appear under "Submissions". You can view their raw code with syntax highlighting in the terminal preview, test or download the file, assign marks out of your rubric total, and type constructive feedback.',
    },
    {
      q: 'What are the limits for uploading study materials?',
      a: 'ClassSphere supports PDF documents up to 10 MB per file. Uploaded files are immediately accessible to enrolled students and can be processed by Notes AI for auto-generated study cards.',
    },
    {
      q: 'Do students get notified when I post an announcement?',
      a: 'Yes! Whenever you post from "Announcements", MongoDB generates an in-app notification record for every student enrolled in that specific cohort.',
    },
    {
      q: 'How are quizzes evaluated automatically?',
      a: 'When creating a quiz in "Create Quiz", you select the correct answer key for each MCQ. When students complete the timed quiz, ClassSphere grades it instantly and computes class averages, hardest questions, and pass rates.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.message.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTicket({ subject: '', category: 'Classroom & Students', message: '' });
      setTimeout(() => setSentSuccess(false), 4000);
    }, 700);
  };

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          Help & Support Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Guides, frequently asked questions, and direct support for educators.
        </p>
      </div>

      {/* 🌟 Dark Navy Hero Banner with Yellow Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-[#181829] dark:bg-[#1a1a26] text-white p-6 md:p-8 flex items-center justify-between border border-slate-800 shadow-sm">
        <div className="space-y-2 z-10 max-w-md">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            EDUCATOR SUPPORT DESK
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            How can we assist you today?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Find answers to common questions about classroom setup, grading, and student management, or message our tech team directly.
          </p>
        </div>

        <div className="relative hidden sm:flex items-center justify-center w-64 h-32 shrink-0">
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#fde047] z-0" />
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-md flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#181829] text-white shadow-md flex items-center justify-center border border-slate-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-md flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Quick Guides</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Step-by-step documentation</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">System Status</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">● All Systems Operational</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Email Hotline</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">support@classsphere.edu</p>
          </div>
        </div>
      </div>

      {/* Main Grid: FAQs & Message Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                />
              </div>
            </div>

            {/* Accordion List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
              {filteredFaqs.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No matching questions found.</p>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="py-3">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full flex items-center justify-between text-left gap-2 text-xs font-bold text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <form onSubmit={handleSendMessage} className="space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Have an inquiry or issue? We reply within 2 hours.
              </p>
            </div>

            {sentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Message sent! We will follow up by email.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={ticket.category}
                onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
              >
                <option value="Classroom & Students">Classroom & Students</option>
                <option value="Grading & Rubrics">Grading & Rubrics</option>
                <option value="Google OAuth / Login">Google OAuth / Login</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Other">Other Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Question regarding student join codes"
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message Details
              </label>
              <textarea
                rows="4"
                required
                placeholder="Describe your issue or feedback in detail..."
                value={ticket.message}
                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Sending message...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}