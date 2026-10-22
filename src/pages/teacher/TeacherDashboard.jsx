import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, FileCheck2, Award, PlusCircle, 
  ArrowRight, Copy, Check, Sparkles, FolderPlus, HelpCircle, Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchMyClassrooms } from '../../services/classroomService';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classroomError, setClassroomError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Fetch real classrooms from backend
  useEffect(() => {
    let ignore = false;
    fetchMyClassrooms()
      .then((data) => {
        if (!ignore) {
          setClassrooms(data);
        }
      })
      .catch((err) => {
        if (!ignore) setClassroomError(err.message || 'Could not load classrooms.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Dynamically calculate metrics from real classrooms
  const totalStudents = classrooms.reduce(
    (sum, c) => sum + (c.students?.length || c.enrolledCount || 0),
    0
  );

  const metrics = [
    { label: 'Classrooms', value: classrooms.length, icon: BookOpen, color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' },
    { label: 'Total students', value: totalStudents || '0', icon: Users, color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' },
    { label: 'To grade', value: '—', icon: FileCheck2, color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' },
    { label: 'Class average', value: '—', icon: Award, color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' },
  ];

  const displayName = user?.name ? `Prof. ${user.name.split(' ')[0]}` : 'Professor';

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      {/* 🌟 Yellow Higher Card */}
      <div className="rounded-3xl bg-[#fde047] p-6 md:p-8 shadow-sm text-slate-900 flex items-center justify-between relative overflow-hidden">
        <div className="max-w-xl space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-slate-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Academic Portal &bull; Fall 2026
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            You have <span className="font-bold underline decoration-slate-900">{classrooms.length} active classrooms</span>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => navigate('/teacher/submissions')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition shadow-sm"
            >
              Grade pending work
            </button>
            <button 
              onClick={() => navigate('/teacher/create-class')}
              className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-slate-900 text-xs font-bold transition shadow-sm"
            >
              New classroom
            </button>
          </div>
        </div>

        {classroomError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
            {classroomError}
          </div>
        )}

        <div className="hidden sm:flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6 text-slate-900" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shadow-sm">
            <Users className="w-6 h-6 text-slate-900" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shadow-sm">
            <Award className="w-6 h-6 text-slate-900" />
          </div>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div 
              key={i} 
              className="rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-4 flex items-center gap-3 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button 
          onClick={() => navigate('/teacher/create-class')}
          className="p-3.5 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] hover:border-[#fde047] dark:hover:border-[#fde047] text-left transition group shadow-sm"
        >
          <PlusCircle className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition" />
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Create Class</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Generate join code</p>
        </button>

        <button 
          onClick={() => navigate('/teacher/upload-material')}
          className="p-3.5 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] hover:border-[#fde047] dark:hover:border-[#fde047] text-left transition group shadow-sm"
        >
          <Upload className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition" />
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Upload Notes</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">PDFs up to 10MB</p>
        </button>

        <button 
          onClick={() => navigate('/teacher/create-assignment')}
          className="p-3.5 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] hover:border-[#fde047] dark:hover:border-[#fde047] text-left transition group shadow-sm"
        >
          <BookOpen className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition" />
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">New Assignment</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Set rubrics & due date</p>
        </button>

        <button 
          onClick={() => navigate('/teacher/create-quiz')}
          className="p-3.5 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] hover:border-[#fde047] dark:hover:border-[#fde047] text-left transition group shadow-sm"
        >
          <HelpCircle className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-110 transition" />
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Create Quiz</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Timed MCQ builder</p>
        </button>
      </div>

      {/* My Classrooms Cohorts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            My Classrooms ({classrooms.length})
          </h2>
          <button 
            onClick={() => navigate('/teacher/create-class')}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            Create another <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading your classrooms...</div>
        ) : classrooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-white dark:bg-[#121214] space-y-3">
            <FolderPlus className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">No classrooms yet</p>
            <p className="text-xs text-slate-500">Create your first class to generate a join code for students.</p>
            <button
              onClick={() => navigate('/teacher/create-class')}
              className="px-4 py-2 rounded-xl bg-[#fde047] text-slate-950 font-bold text-xs"
            >
              Create Classroom
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classrooms.map((c) => {
              const code = c.classCode || c.code || 'N/A';
              const studentCount = c.students?.length || c.enrolledCount || 0;

              return (
                <div
                  key={c._id || c.id}
                  className="rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {c.description || `${studentCount} students enrolled`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {studentCount} Students
                    </span>
                    <button
                      onClick={() => handleCopyCode(code)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#fde047] hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold transition"
                      title="Click to copy join code"
                    >
                      {copiedCode === code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> {code}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission and quiz reporting endpoints are not part of the supplied API contract. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Submission status
            </h2>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            Student submission and grading data is not available through the supplied API endpoints.
          </div>
        </div>

        {/* Quiz Averages Column */}
        <div className="rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quiz Averages
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Across all enrolled cohorts</p>
          </div>

          <div className="flex h-36 items-center justify-center px-2 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Quiz result data is not available through the supplied API endpoints.
          </div>
        </div>
      </div>
    </div>
  );
}