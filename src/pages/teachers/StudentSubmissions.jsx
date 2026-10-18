import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  CheckCircle,
  Clock,
  Send,
  Download,
  Filter
} from 'lucide-react';

export default function StudentSubmissions() {
  const [selectedClass, setSelectedClass] = useState('cls-1');
  const [selectedAssignment, setSelectedAssignment] = useState('asg-1');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savedNotification, setSavedNotification] = useState(null);

  // Submissions State
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      studentName: 'Alex Johnson',
      email: 'alex.j@classsphere.edu',
      submissionDate: 'Oct 17, 2026 14:22',
      fileUrl: '#',
      fileName: 'alex_johnson_bst_tree.zip',
      status: 'Needs Grading',
      grade: '',
      feedback: '',
    },
    {
      id: 'sub-2',
      studentName: 'Priya Sharma',
      email: 'priya.s@classsphere.edu',
      submissionDate: 'Oct 17, 2026 11:05',
      fileUrl: '#',
      fileName: 'priya_sharma_bst.py',
      status: 'Graded',
      grade: '98',
      feedback: 'Excellent time complexity and edge case handling.',
    },
    {
      id: 'sub-3',
      studentName: 'Marcus Vance',
      email: 'marcus.v@classsphere.edu',
      submissionDate: 'Oct 16, 2026 23:45',
      fileUrl: '#',
      fileName: 'vance_tree_rotations.cpp',
      status: 'Needs Grading',
      grade: '',
      feedback: '',
    },
    {
      id: 'sub-4',
      studentName: 'Elena Rostova',
      email: 'elena.r@classsphere.edu',
      submissionDate: 'Oct 16, 2026 19:10',
      fileUrl: '#',
      fileName: 'elena_solution.zip',
      status: 'Graded',
      grade: '92',
      feedback: 'Good implementation, but memory cleanup was missing in destructor.',
    },
  ]);

  const handleGradeChange = (id, newGrade) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade: newGrade } : s))
    );
  };

  const handleFeedbackChange = (id, newFeedback) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, feedback: newFeedback } : s))
    );
  };

  const handleSaveGrade = (id) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub.grade) {
      alert('Please enter a grade before saving.');
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Graded' } : s))
    );

    setSavedNotification(`Grade & feedback dispatched for ${sub.studentName}`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter === 'all') return true;
    return sub.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Student Submissions & Evaluation</h1>
        <p className="text-xs text-slate-400">Review submitted student files, assign scores, and provide qualitative feedback</p>
      </div>

      {savedNotification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Filter Classroom
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="cls-1">CS-A: Data Structures & Algorithms</option>
            <option value="cls-2">SE-3B: Advanced Web Engineering</option>
            <option value="cls-3">AI-1A: Machine Learning</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Filter Assignment
          </label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="asg-1">Lab 4: Binary Search Trees</option>
            <option value="asg-2">Assignment 2: Graph DFS & BFS</option>
            <option value="asg-3">Mid-Term Mini Project</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Grading Status
          </label>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'Needs Grading', 'Graded'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-sm">{sub.studentName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      sub.status === 'Graded'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{sub.email} &bull; Submitted {sub.submissionDate}</p>
              </div>

              {/* Download / Preview attachment */}
              <a
                href={sub.fileUrl}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold border border-slate-700 transition-colors w-fit"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{sub.fileName}</span>
              </a>
            </div>

            {/* Grading Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Grade (/100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 95"
                  value={sub.grade}
                  onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-center text-indigo-300 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-8">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Feedback to Student
                </label>
                <input
                  type="text"
                  placeholder="Enter comments or code review suggestions..."
                  value={sub.feedback}
                  onChange={(e) => handleFeedbackChange(sub.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2 pt-4 md:pt-0">
                <button
                  onClick={() => handleSaveGrade(sub.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}