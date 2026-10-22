import React, { useState } from 'react';
import { 
  FileCheck2, Users, Award, Clock, Download, 
  CheckCircle2, AlertCircle, Save, Sparkles, Filter, ChevronRight
} from 'lucide-react';

export default function StudentSubmissions() {
  const [filter, setFilter] = useState('pending'); // 'pending' or 'graded'
  const [selectedId, setSelectedId] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      student: 'Aarav Mehta',
      email: 'aarav@college.edu',
      class: 'Data Structures (CS-A)',
      assignment: 'Lab 4: Binary Search Trees',
      submittedAt: 'Today at 10:45 AM',
      status: 'pending',
      marks: 18,
      maxMarks: 20,
      feedback: 'Excellent recursive insertion logic. Consider balancing edge cases for duplicate values.',
      codeSnippet: `// Binary Search Tree - Insert Implementation
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insertNode(root, value) {
  if (!root) return new Node(value);
  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }
  return root;
}`,
      fileName: 'bst_implementation.cpp',
      fileSize: '14.2 KB',
    },
    {
      id: 2,
      student: 'Kabir Singh',
      email: 'kabir@college.edu',
      class: 'Database Systems (CS-B)',
      assignment: 'Lab 2: E-R Diagram & Normalization',
      submittedAt: 'Yesterday at 4:15 PM',
      status: 'pending',
      marks: 16,
      maxMarks: 20,
      feedback: 'Good 3NF normalization. Foreign key constraints in the orders table need review.',
      codeSnippet: `-- Schema definition for E-Commerce Orders
CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2)
);`,
      fileName: 'schema_normalization.sql',
      fileSize: '8.6 KB',
    },
    {
      id: 3,
      student: 'Riya Sharma',
      email: 'riya@college.edu',
      class: 'Data Structures (CS-A)',
      assignment: 'Lab 3: Linked List Reversal',
      submittedAt: '18 Oct at 2:30 PM',
      status: 'graded',
      marks: 19,
      maxMarks: 20,
      feedback: 'Flawless 3-pointer iterative reversal. Clean time complexity O(n) and O(1) space.',
      codeSnippet: `// Iterative Linked List In-Place Reversal
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      fileName: 'reverse_list.cpp',
      fileSize: '11.4 KB',
    },
  ]);

  const selectedSub = submissions.find((s) => s.id === selectedId) || submissions[0];

  const handleUpdateMarks = (val) => {
    const num = Math.min(Math.max(Number(val) || 0, 0), selectedSub.maxMarks);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? { ...s, marks: num } : s))
    );
  };

  const handleUpdateFeedback = (text) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? { ...s, feedback: text } : s))
    );
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? { ...s, status: 'graded' } : s))
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredList = submissions.filter((s) => s.status === filter);

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          Student Submissions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Evaluate submitted code, assign scores, and leave constructive feedback.
        </p>
      </div>

      {/*  Dark Navy Hero Banner with Yellow Accent (Images 4 & 5 Design System) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#181829] dark:bg-[#1a1a26] text-white p-6 md:p-8 flex items-center justify-between border border-slate-800 shadow-sm">
        <div className="space-y-2 z-10 max-w-md">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            EVALUATION WORKSPACE
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Grade with feedback
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Review student work, assign marks, and leave comments that guide academic growth.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-[#fde047] text-xs font-bold border border-white/10">
              <Clock className="w-3.5 h-3.5" /> 2 pending evaluation
            </span>
          </div>
        </div>

        <div className="relative hidden sm:flex items-center justify-center w-64 h-32 shrink-0">
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#fde047] z-0" />
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-md flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#181829] text-white shadow-md flex items-center justify-center border border-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-md flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Evaluation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Queue */}
        <div className="bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filter === 'pending'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              To Grade ({submissions.filter((s) => s.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('graded')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filter === 'graded'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Graded ({submissions.filter((s) => s.status === 'graded').length})
            </button>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No submissions in this queue.</p>
            ) : (
              filteredList.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                    selectedId === sub.id
                      ? 'border-[#fde047] bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.student}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {sub.assignment}
                      </p>
                    </div>
                    {sub.status === 'graded' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
                        {sub.marks}/{sub.maxMarks}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">{sub.submittedAt}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Submission Workspace (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 shadow-sm space-y-6">
          {selectedSub ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedSub.assignment}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Student: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSub.student}</span> &bull; {selectedSub.class}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5" /> {selectedSub.submittedAt}
                </div>
              </div>

              {/* Code Inspection Window */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Code Submission Preview ({selectedSub.fileName})
                  </span>
                  <button 
                    onClick={() => alert(`Downloading ${selectedSub.fileName}...`)}
                    className="text-amber-500 hover:text-amber-600 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Download className="w-3 h-3" /> Download file
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                  <code>{selectedSub.codeSnippet}</code>
                </pre>
              </div>

              {/* Grading Form */}
              <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Awarded Marks (Out of {selectedSub.maxMarks})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedSub.maxMarks}
                      value={selectedSub.marks}
                      onChange={(e) => handleUpdateMarks(e.target.value)}
                      className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={selectedSub.status}
                      onChange={(e) =>
                        setSubmissions((prev) =>
                          prev.map((s) => (s.id === selectedSub.id ? { ...s, status: e.target.value } : s))
                        )
                      }
                      className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                    >
                      <option value="pending">Needs Revision / Pending</option>
                      <option value="graded">Graded & Approved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Feedback for Student
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Provide constructive feedback on code structure, time complexity, or edge cases..."
                    value={selectedSub.feedback}
                    onChange={(e) => handleUpdateFeedback(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#fde047] hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-sm"
                  >
                    <Save className="w-4 h-4" /> Save Grade & Feedback
                  </button>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Saved!
                    </span>
                  )}
                </div>
              </form>
            </>
          ) : (
            <p className="text-xs text-slate-400 py-16 text-center">Select a submission from the queue.</p>
          )}
        </div>
      </div>
    </div>
  );
}