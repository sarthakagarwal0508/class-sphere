import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  createAssignment,
} from '../../services/assignmentService';
import { fetchMyClassrooms } from '../../services/classroomService';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    instructions: '',
    points: 100,
    dueDate: '',
    dueTime: '23:59',
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMyClassrooms()
      .then((items) => {
        if (!active) return;
        setClassrooms(items);
        if (items.length) {
          setFormData((current) => ({
            ...current,
            course: String(items[0]._id ?? items[0].id),
          }));
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Could not load classrooms.');
      })
      .finally(() => {
        if (active) setLoadingClassrooms(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const dueDate = new Date(
        `${formData.dueDate}T${formData.dueTime || '23:59'}`
      ).toISOString();
      await createAssignment(formData.course, {
        title: formData.title.trim(),
        description: formData.instructions.trim(),
        dueDate,
        maxMarks: formData.points,
      });
      setIsSuccess(true);
    } catch (submitError) {
      setError(submitError.message || 'Could not publish this assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Create New Assignment</h1>
          <p className="text-xs text-slate-400">Configure instructions, maximum marks, deadline, and submission policies</p>
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Assignment published successfully.</span>
        </div>
      )}
      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Lab 5: Balanced AVL Trees and Rotation Logic"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Classroom *
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                required
                disabled={loadingClassrooms || classrooms.length === 0}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                {loadingClassrooms ? (
                  <option value="">Loading classrooms...</option>
                ) : classrooms.length === 0 ? (
                  <option value="">Create a classroom first</option>
                ) : (
                  classrooms.map((classroom) => {
                    const classroomId = classroom._id ?? classroom.id;
                    return (
                      <option key={classroomId} value={classroomId}>
                        {classroom.name ?? classroom.title ?? 'Classroom'}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Instructions & Grading Rubric *
            </label>
            <textarea
              rows="6"
              required
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Outline the problem specification, submission zip format, requirements, and test cases..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Max Score (Points)
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Due Time
              </label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting || loadingClassrooms || classrooms.length === 0}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
