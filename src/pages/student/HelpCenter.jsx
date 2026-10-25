import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LifeBuoy,
  Mail,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";

const supportEmail = "support@classsphere.edu";

const faqs = [
  {
    q: "How do I join a classroom?",
    a: 'Open "My Classes", choose the option to join a classroom, and enter the class code shared by your teacher. If you do not have a code, ask your teacher to share it with you.',
  },
  {
    q: "Where can I find my class materials?",
    a: 'Open "Study Material" or the relevant class to find resources shared by your teacher. Select a file to view or download it for later study.',
  },
  {
    q: "How do I submit an assignment?",
    a: 'Open "Assignments", select the assignment you want to work on, and follow its submission instructions. Check the assignment status afterwards to confirm it was submitted.',
  },
  {
    q: "Can I retake a quiz or see my score?",
    a: 'Open "Quizzes" to see the quizzes available to you. After completing a quiz, check "My Grades" for scores and results. Retakes depend on the quiz settings your teacher has chosen.',
  },
  {
    q: "How do Notes AI and flashcards help me study?",
    a: 'Notes AI can help turn study notes into concise key points. Flashcards let you review key terms and ideas through active recall. Use both as study aids and check important details against your class materials.',
  },
  {
    q: "Where can I see my progress and class updates?",
    a: 'Open "Progress" to review your learning activity, and "Announcements" to see updates from your teachers. You can also check "My Grades" for assessment results.',
  },
  {
    q: "Where can I ask a question about my lessons?",
    a: 'Visit the "Doubt Forum" to ask a question or browse discussions. For a private or class-specific issue, contact your teacher directly.',
  },
];

export default function StudentHelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [ticket, setTicket] = useState({
    subject: "",
    category: "Classes & Materials",
    message: "",
  });

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.q} ${faq.a}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSendMessage(event) {
    event.preventDefault();

    const subject = `[ClassSphere Student Support] ${ticket.category}: ${ticket.subject.trim()}`;
    const body = ticket.message.trim();
    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white md:text-2xl">
          Help & Support Center
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Find answers and get help with your classes, study tools, and account.
        </p>
      </div>

      <section className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#181829] p-6 text-white shadow-sm dark:bg-[#1a1a26] md:p-8">
        <div className="z-10 max-w-lg space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            STUDENT SUPPORT DESK
          </p>
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            Need a hand with your learning space?
          </h2>
          <p className="text-xs font-medium leading-relaxed text-slate-300">
            Find help with joining classes, submitting work, using study tools,
            and keeping up with classroom updates.
          </p>
        </div>

        <div className="relative hidden h-32 w-64 shrink-0 items-center justify-center sm:flex">
          <div className="absolute -right-6 top-1/2 z-0 h-48 w-48 -translate-y-1/2 rounded-full bg-[#fde047]" />
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-md">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-[#181829] text-white shadow-md">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-md">
              <Mail className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="flex items-center gap-3.5 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:border-[#1f1f23] dark:bg-[#121214]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Student Guides</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Answers for everyday classwork</p>
          </div>
        </article>

        <article className="flex items-center gap-3.5 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:border-[#1f1f23] dark:bg-[#121214]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Account Help</h3>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Login and verification guidance</p>
          </div>
        </article>

        <article className="flex items-center gap-3.5 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:border-[#1f1f23] dark:bg-[#121214]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Email Support</h3>
            <a className="text-[11px] text-slate-500 hover:underline dark:text-slate-400" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#1f1f23] dark:bg-[#121214]">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#f8f9fa] py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#fde047] dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 pt-2 dark:divide-slate-800">
              {filteredFaqs.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">
                  No matching questions found.
                </p>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaq === faq.q;
                  return (
                    <div key={faq.q} className="py-3">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? null : faq.q)}
                        className="flex w-full items-center justify-between gap-2 text-left text-xs font-bold text-slate-900 transition hover:text-amber-500 dark:text-white dark:hover:text-amber-400"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#1f1f23] dark:bg-[#121214]">
          <form onSubmit={handleSendMessage} className="space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Contact Support
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                This opens an email draft so you can send your question to support.
              </p>
            </div>

            <div>
              <label htmlFor="student-help-category" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                id="student-help-category"
                value={ticket.category}
                onChange={(event) => setTicket({ ...ticket, category: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-[#f8f9fa] px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#fde047] dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
              >
                <option>Classes & Materials</option>
                <option>Assignments & Quizzes</option>
                <option>Notes AI & Flashcards</option>
                <option>Login & Account</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="student-help-subject" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                id="student-help-subject"
                type="text"
                required
                maxLength={120}
                placeholder="What do you need help with?"
                value={ticket.subject}
                onChange={(event) => setTicket({ ...ticket, subject: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-[#f8f9fa] px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#fde047] dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="student-help-message" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message Details
              </label>
              <textarea
                id="student-help-message"
                rows="4"
                required
                maxLength={3000}
                placeholder="Tell us what happened and what you have tried..."
                value={ticket.message}
                onChange={(event) => setTicket({ ...ticket, message: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-[#f8f9fa] px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#fde047] dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#fde047] py-2.5 text-xs font-black text-slate-950 shadow-sm transition hover:bg-amber-400"
            >
              <Send className="h-3.5 w-3.5" />
              Open Email Draft
            </button>
          </form>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Please do not include your password or other sensitive account details.
          </p>
        </section>
      </div>
    </div>
  );
}
